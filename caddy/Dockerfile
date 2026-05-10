# --- Build React app ---
FROM node:20-alpine AS build
WORKDIR /app
COPY sonance-ui/package.json sonance-ui/package-lock.json ./
RUN npm install --production=false
COPY sonance-ui/ .
RUN npm run build

# --- Caddy with static files ---
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
