ARG ALPINE_V=3.18
FROM --platform=$BUILDPLATFORM alpine:${ALPINE_V} AS build-base

RUN apk update && \
    apk add --no-cache curl xz busybox gcc g++ make musl-dev nodejs npm

FROM build-base AS build
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install

FROM build AS cleanup
RUN find /opt/app -name "*.md" -type f -exec rm -f {} + && \
    find /opt/app -name ".DS_Store" -type f -exec rm -f {} + && \
    find /opt/app -name ".vscode" -type d -exec rm -rf {} + && \
    find /opt/app -name ".gitlab" -type d -exec rm -rf {} + && \
    find /opt/app -name ".dockerignore" -type f -exec rm -f {} + && \
    find /opt/app -name "docker-compose.yml" -type f -exec rm -f {} + && \
    find /opt/app -name "Dockerfile" -type f -exec rm -f {} +

FROM --platform=$TARGETPLATFORM cgr.dev/chainguard/node:latest AS wolfi-node
ENV USER="node"

WORKDIR /app
COPY --from=cleanup --chown=${USER}:${USER} /opt/app /app

RUN npm install

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "src/App.js"]
EXPOSE 3000
