"""Build and exercise isolated Compose projects; only temporary projects are removed."""
import gzip
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.error
import urllib.request
import uuid

root = Path(__file__).resolve().parents[1]
project = 'portfolio-test-' + uuid.uuid4().hex[:10]
env = dict(os.environ, FRONTEND_BIND_ADDRESS='127.0.0.1', FRONTEND_PORT='0', BACKEND_PORT='0', COMPOSE_PROFILES='')
report = {'project': project, 'checks': [], 'compression': {}}

def compose(*args, name=project):
    return subprocess.check_output(['docker', 'compose', '-f', str(root / 'docker-compose.yml'), '-p', name, *args], env=env, text=True).strip()

def docker(*args):
    return subprocess.check_output(['docker', *args], text=True).strip()

def request(base, path, encoding='identity'):
    try:
        response = urllib.request.urlopen(urllib.request.Request(base + path, headers={'Accept-Encoding': encoding}), timeout=10)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read()

try:
    compose('build')
    compose('up', '-d', '--wait', '--wait-timeout', '120')
    assert compose('ps', '--services', '--status', 'running') == 'frontend'
    base = 'http://' + compose('port', 'frontend', '4173')
    for path in ['/', '/bookreviews', '/bookreviews/make-it-stick', '/myfavourites', '/myportfolio']:
        status, headers, body = request(base, path)
        assert status == 200 and b'<title>' in body
        assert headers.get('X-Content-Type-Options') == 'nosniff'
        assert "frame-ancestors 'none'" in headers.get('Content-Security-Policy', '')
    for path in ['/missing', '/bookreviews/missing', '/.env', '/resources/missing.json']:
        assert request(base, path)[0] == 404
    html = request(base, '/')[2].decode()
    js = re.search(r'src="(/assets/[^\"]+\.js)"', html)[1]
    for path in ['/', js]:
        _, _, plain = request(base, path)
        _, headers, compressed = request(base, path, 'gzip')
        assert headers.get('Content-Encoding') == 'gzip'
        assert 'Accept-Encoding' in headers.get('Vary', '')
        assert gzip.decompress(compressed) == plain and len(compressed) < len(plain)
        report['compression'][path] = {'plain': len(plain), 'gzip': len(compressed)}
    report['checks'].append('frontend-only: health, routes, 404, CSP and lossless HTTP gzip')
    compose('--profile', 'backend', 'build', 'backend')
    compose('--profile', 'backend', 'up', '-d', '--wait', '--wait-timeout', '120')
    assert set(compose('ps', '--services', '--status', 'running').splitlines()) == {'frontend', 'backend'}
    api = 'http://' + compose('port', 'backend', '5126')
    assert request(api, '/health')[0] == 200
    assert len(json.loads(request(api, '/weatherforecast')[2])) == 5
    assert request(api, '/metrics')[0] == 404
    backend = compose('ps', '-q', 'backend')
    info = json.loads(docker('inspect', backend))[0]
    assert info['NetworkSettings']['Ports'].get('9464/tcp') is None
    assert info['NetworkSettings']['Ports']['5126/tcp'][0]['HostIp'] == '127.0.0.1'
    metrics = compose('exec', '-T', 'frontend', 'wget', '-qO-', 'http://backend:9464/metrics')
    assert 'http_requests_received_total' in metrics
    report['images'] = {}
    for service in ['frontend', 'backend']:
        info = json.loads(docker('inspect', compose('ps', '-q', service)))[0]
        assert info['Config']['User'] not in ['', '0', 'root']
        assert info['State']['Health']['Status'] == 'healthy'
        report['images'][service] = info['Image']
    report['checks'].append('backend profile: health, contract, DNS, internal metrics, loopback and non-root users')
    # A second instance proves there is no fixed container-name conflict.
    compose('up', '-d', '--build', '--wait', '--wait-timeout', '120', name=project + '-second')
    assert request('http://' + compose('port', 'frontend', '4173', name=project + '-second'), '/')[0] == 200
    report['checks'].append('two concurrent Compose projects without name or port conflicts')
finally:
    compose('--profile', 'backend', 'down', '--remove-orphans', name=project + '-second')
    compose('--profile', 'backend', 'down', '--remove-orphans')
if os.environ.get('COMPOSE_TEST_REPORT'):
    Path(os.environ['COMPOSE_TEST_REPORT']).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
