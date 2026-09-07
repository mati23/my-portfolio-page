#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
reports="${SECURITY_REPORT_DIR:-security-reports}"
mkdir -p "$reports"

npm --prefix frontend ci
npm --prefix frontend audit --audit-level=low --json > "$reports/npm.json"
npm --prefix frontend audit --omit=dev --audit-level=low --json > "$reports/npm-production.json"
dotnet restore backend/backend.csproj --locked-mode
dotnet list backend/backend.csproj package --vulnerable --include-transitive --format json > "$reports/nuget.json"
dotnet build backend/backend.csproj --no-restore -c Release

trivy fs --scanners vuln,secret,misconfig --include-dev-deps --exit-code 1 \
  --skip-dirs .git --skip-dirs frontend/node_modules --skip-dirs frontend/dist \
  --skip-dirs backend/bin --skip-dirs backend/obj --skip-dirs backend/data \
  --skip-dirs "$reports" --format json --output "$reports/source.json" .

for component in frontend backend; do
  docker build --target build -t "portfolio-${component}-build:security" "$component"
  docker build -t "portfolio-${component}:security" "$component"
  for image in "portfolio-${component}-build:security" "portfolio-${component}:security"; do
    trivy image --scanners vuln --exit-code 1 \
      --format json --output "$reports/${image//:/-}.json" "$image"
  done
done

gitleaks git . --redact --no-banner --report-format json --report-path "$reports/secrets-history.json"
echo "Security checks passed: npm, NuGet, source, build/runtime images and Git history."
