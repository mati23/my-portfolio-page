FROM mcr.microsoft.com/dotnet/sdk:10.0.400-alpine3.24@sha256:620e765fe18186c08399f7aa978f79f04b6bbf0ee1b3b8a91e2d5c9619e59da1 AS build
RUN apk upgrade --no-cache && rm -rf /usr/share/powershell /usr/bin/pwsh
WORKDIR /src
COPY backend.csproj packages.lock.json ./
RUN dotnet restore --locked-mode
COPY . .
RUN dotnet publish --no-restore -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0.11-alpine3.24-extra@sha256:58ec3158d8581044c9ba2115994770118ffd1697fdc49391ad83bd81e7bcd4af AS final
RUN apk upgrade --no-cache
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS="5126;9464"
COPY --from=build /app .
USER $APP_UID
EXPOSE 5126
HEALTHCHECK --interval=30s --timeout=3s CMD ["dotnet", "backend.dll", "--health-check"]
ENTRYPOINT ["dotnet", "backend.dll"]
