"""Exercise the actual production image, including metrics isolation and development Swagger."""
import datetime
import json
import os
import subprocess
import time
import urllib.error
import urllib.request


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True, stderr=subprocess.STDOUT).strip()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(base, path, headers=None, method=None):
    try:
        with urllib.request.build_opener(NoRedirect).open(urllib.request.Request(base + path, headers=headers or {}, method=method), timeout=5) as response:
            return response.status, response.headers, response.read()
    except urllib.error.HTTPError as response:
        return response.code, response.headers, response.read()


image = os.environ.get("BACKEND_IMAGE", "portfolio-backend:security")
for environment, extra, allowed in (
    ("Production", [], "http://localhost:8000"),
    ("Development", [], "http://127.0.0.1:8000"),
    ("Production", ["-e", "Cors__AllowedOrigins=https://portfolio.example"], "https://portfolio.example"),
):
    container = docker("run", "-d", "-e", f"ASPNETCORE_ENVIRONMENT={environment}",
                       *extra, "-p", "127.0.0.1::5126", image)
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

        assert request(base, "/failure")[0] == 404, "Test-only endpoint must not exist in the API"
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

        status, headers, _ = request(base, "/weatherforecast", {"Origin": allowed})
        assert status == 200 and headers.get("Access-Control-Allow-Origin") == allowed
        _, headers, _ = request(base, "/weatherforecast", {"Origin": "https://untrusted.example"})
        assert headers.get("Access-Control-Allow-Origin") is None
        for origin in (allowed, "https://untrusted.example"):
            status, headers, _ = request(base, "/weatherforecast", {
                "Origin": origin, "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "X-Test"}, method="OPTIONS")
            assert status == 204 and "Location" not in headers
            assert headers.get("Access-Control-Allow-Origin") == (allowed if origin == allowed else None)
        if extra:
            assert request(base, "/weatherforecast", {"Origin": "http://localhost:8000"})[1].get("Access-Control-Allow-Origin") is None
        assert request(base, "/weatherforecast", {"X-Forwarded-Proto": "https", "X-Forwarded-Host": "untrusted.example"})[0] == 200
        assert "Failed to determine the https port" not in docker("logs", container)
        status, _, body = request(base, "/swagger/v1/swagger.json")
        if environment == "Development":
            assert status == 200 and "/weatherforecast" in json.loads(body)["paths"]
            assert request(base, "/swagger/index.html")[0] == 200
        else:
            assert status == 404
        print(f"{environment}: health, forecast, CORS, Swagger policy and metrics isolation passed")
    finally:
        docker("rm", "-f", container)

# Explicit redirect mode: assert Location without following it or requiring a certificate.
container = docker("run", "-d", "-e", "HttpsRedirection__Enabled=true", "-e", "HttpsRedirection__Port=7139",
                   "-p", "127.0.0.1::5126", image)
try:
    base = "http://" + docker("port", container, "5126/tcp").splitlines()[0]
    for _ in range(50):
        try:
            if request(base, "/health")[0] == 200: break
        except OSError: pass
        time.sleep(0.2)
    status, headers, _ = request(base, "/weatherforecast", {"X-Forwarded-Proto": "https"})
    assert status == 307 and headers["Location"] == "https://127.0.0.1:7139/weatherforecast"
    assert request(base, "/metrics")[0] == 404
    print("Explicit HTTPS: redirect target, untrusted forwarding headers and HTTP health passed")
finally:
    docker("rm", "-f", container)

for settings in (["Cors__AllowedOrigins=*"], ["Cors__AllowedOrigins=https://portfolio.example/path"],
                 ["HttpsRedirection__Enabled=true"]):
    args = [value for setting in settings for value in ("-e", setting)]
    container = docker("run", "-d", *args, image)
    try:
        for _ in range(50):
            if docker("inspect", "--format", "{{.State.Running}}", container) == "false": break
            time.sleep(0.2)
        assert docker("inspect", "--format", "{{.State.Running}}", container) == "false"
        assert docker("inspect", "--format", "{{.State.ExitCode}}", container) != "0"
        assert "InvalidOperationException" in docker("logs", container)
    finally:
        docker("rm", "-f", container)
print("Invalid origin and missing redirect port rejected at startup")
