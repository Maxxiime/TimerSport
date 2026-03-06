# TimerSport

## 1. Project description

TimerSport is a mobile-friendly fitness timer built for gym and crossfit workouts. It is a React + Vite application designed to run as a static frontend in production.

## 2. Requirements

Before deploying with Docker, make sure you have:

- Docker
- Docker Compose

## 3. Quick start (Docker Compose – recommended)

The fastest and recommended way to deploy TimerSport is with Docker Compose.

```bash
git clone https://github.com/Maxxiime/TimerSport.git
cd TimerSport
docker compose up -d --build
```

Once started, the application is available at:

```text
http://SERVER_IP:4270
```

> If you run locally, you can use `http://localhost:4270`.

## 4. Updating the application

To update to the latest code and redeploy:

```bash
git pull
docker compose up -d --build
```

## 5. Manual Docker build (without compose)

If you prefer not to use Compose:

```bash
docker build -t timersport .
docker run -d -p 4270:80 --name timersport timersport
```

## 6. Changing the exposed port

The container serves the app on port `80` internally. In `docker-compose.yml`, change the host port in the `ports` section:

```yaml
ports:
  - "PORT:80"
```

Example (host port `5000`):

```yaml
ports:
  - "5000:80"
```

Then restart with:

```bash
docker compose up -d --build
```

## 7. Stopping the container

```bash
docker compose down
```

## 8. Rebuilding cleanly

If you want a clean rebuild of images:

```bash
docker compose down
docker builder prune -f
docker compose up -d --build
```

## 9. Production notes

This repository includes a production-ready Docker setup:

- A multi-stage Docker build
- `npm run build` compiles the Vite application
- The final image uses `nginx:alpine` to serve static files from `/dist`
- The container exposes port `80`
- The resulting image is lightweight and suitable for production deployments (including Docker hosts and Portainer)
