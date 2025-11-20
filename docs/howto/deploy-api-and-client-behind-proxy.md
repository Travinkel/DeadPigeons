### Goal

Deploy the API and client behind an Nginx reverse proxy with TLS termination, correct forwarded headers, streaming/WebSockets support, and strict secrets handling.

> Source modules: W38 — Deployment ([CDS.Security](http://CDS.Security) track).[[1]](https://www.notion.so/W38-Deployment-b2f5e4388cd9455389da5d6df99fd9ea?pvs=21)
>

---

### Prerequisites

- Docker and Fly CLI installed
- Environment variables for secrets (no secrets in git)[[2]](https://www.notion.so/Exam-Information-Key-Dates-3rd-Semester-2024-b2c2f24c68984c9195d310f1bb1be28d?pvs=21)
- Built API and client images locally or via CI

---

### 1) Nginx reverse proxy config

Create `nginx.conf`:

```
server {
    listen 80;
    server_name $host;

    # Redirect to HTTPS (handled by platform if using [Fly.io](http://Fly.io) with force_https)
    # return 301 https://$host$request_uri;

    location /api/ {
        proxy_pass http://api:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off; proxy_cache off; chunked_transfer_encoding on;
        proxy_read_timeout 300; proxy_send_timeout 300; proxy_connect_timeout 300;
    }

    location / {
        proxy_pass http://client:80;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### 2) Docker Compose (local test)

`docker-compose.yml`:

```yaml
services:
  api:
    image: your-api:latest
    environment:
      - ASPNETCORE_URLS=http://+:8080
      - ConnectionStrings__Default=... # from .env (not committed)
  client:
    image: your-client:latest
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8080:80"
    depends_on: [api, client]
```

Run: `docker compose up -d` then open [`http://localhost:8080`](http://localhost:8080).

---

### 3) [Fly.io](http://Fly.io) deployment (reverse proxy front)

`fly.toml` (excerpt):

```toml
app = "deadpigeons-proxy"
[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
```

Steps:

1. `fly launch` for proxy app, deploy Nginx container.
2. Point `proxy_pass` targets to internal private apps or shared app within same org (WireGuard/privatelink optional).
3. Set secrets: `fly secrets set ConnectionStrings__Default=... JWT__Secret=...`

---

### 4) CORS and headers

- Keep API CORS allowlist strict; do not duplicate wildcard headers at the proxy.
- Ensure `Authorization` header is forwarded unmodified.

---

### 5) Smoke tests

- GET `/health` → 200
- Unprotected route loads via proxy
- Protected route returns 401 when unauthenticated, 200 when authorized

---

### 6) Evidence

- Add links to PRs and deploy URLs in RAG Map row “Reverse proxy (Nginx) — deploy API and client behind proxy”.[[3]](https://www.notion.so/Reverse-proxy-Nginx-deploy-API-and-client-behind-proxy-6fcf8be7fdaa4eabae438797544356f1?pvs=21)

---

### Pitfalls (from W38)

- Don’t commit `.env` with real secrets
- Ensure Docker build context is correct; add missing files
- Map ports correctly (host:container)

---

### Rollback

- Keep previous image tag; `fly deploy --image <previous>` to roll back.