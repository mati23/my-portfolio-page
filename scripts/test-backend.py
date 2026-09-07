"""Exercise the actual production image, including metrics isolation and development Swagger."""
import datetime
import json
import subprocess
import time
import urllib.error
import urllib.request


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True).strip()


def request(base, path, headers=None):
    try:
        with urllib.request.urlopen(urllib.request.Request(base + path, headers=headers or {}), timeout=5) as response:
            return response.status, response.headers, response.read()
    except urllib.error.HTTPError as response:
        return response.code, response.headers, response.read()


for environment in ("Production", "Development"):
    container = docker("run", "-d", "-e", f"ASPNETCORE_ENVIRONMENT={environment}",
                       "-p", "127.0.0.1::5126", "portfolio-backend:security")
    try:
        address = docker("port", container, "5126/tcp").splitlines()[0]
        base = "http://" + address
        for attempt in range(30):
            try:
                if request(base, "/health")[0] == 200:
                    break
            except (OSError, urllib.error.URLError):
                pass
            time.sleep(0.2)
        else:
            raise AssertionError("API did not become healthy")

        status, _, body = request(base, "/weatherforecast")
        assert status == 200
        forecast = json.loads(body)
        assert len(forecast) == 5
        today = datetime.datetime.now(datetime.timezone.utc).date()
        for index, item in enumerate(forecast, 1):
            assert set(item) == {"date", "temperatureC", "temperatureF", "summary"}
            assert -20 <= item["temperatureC"] < 55
            assert item["temperatureF"] == 32 + int(item["temperatureC"] / 0.5556)
            assert item["date"] == str(today + datetime.timedelta(days=index))

        for path in ("/metrics", "/metrics/"):
            assert request(base, path)[0] == 404
            assert request(base, path, {"Host": "localhost:9464"})[0] == 404
        metrics = docker("run", "--rm", "--network", "container:" + container,
                         "--entrypoint", "wget", "portfolio-frontend:security",
                         "-qO-", "http://127.0.0.1:9464/metrics")
        assert "http_requests_received_total" in metrics
        docker("exec", container, "dotnet", "backend.dll", "--health-check")

        status, headers, _ = request(base, "/weatherforecast", {"Origin": "http://localhost:8000"})
        assert status == 200 and headers.get("Access-Control-Allow-Origin") == "http://localhost:8000"
        _, headers, _ = request(base, "/weatherforecast", {"Origin": "https://untrusted.example"})
        assert headers.get("Access-Control-Allow-Origin") is None
        status, _, body = request(base, "/swagger/v1/swagger.json")
        if environment == "Development":
            assert status == 200 and "/weatherforecast" in json.loads(body)["paths"]
            assert request(base, "/swagger/index.html")[0] == 200
        else:
            assert status == 404
        print(f"{environment}: health, forecast, CORS, Swagger policy and metrics isolation passed")
    finally:
        docker("rm", "-f", container)
