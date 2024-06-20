ARG ALPINE_V=3.18
FROM --platform=$BUILDPLATFORM alpine:${ALPINE_V} as build-base

ARG TAR_V=1.34
RUN apk update && \
    apk add --no-cache curl xz busybox gcc g++ make musl-dev nodejs npm && \
    curl -fsSL http://ftp.gnu.org/gnu/tar/tar-${TAR_V}.tar.gz -o tar-${TAR_V}.tar.gz && \
    tar -xzf tar-${TAR_V}.tar.gz && \
    cd tar-${TAR_V} && \
    export FORCE_UNSAFE_CONFIGURE=1 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf tar-${TAR_V} tar-${TAR_V}.tar.gz

FROM build-base as build

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

FROM --platform=$TARGETPLATFORM cgr.dev/chainguard/wolfi-base as wolfi-node
ENV USER="rocketalert"

RUN mkdir -p /opt/app && \
    adduser -D ${USER} && \
    chown -R ${USER}:${USER} /opt/app

USER ${USER}

COPY --from=build /usr/local /usr/local
COPY --from=build /usr/lib /usr/lib
COPY --from=build /usr/bin/node /usr/bin/node
COPY --from=build /usr/bin/npm /usr/bin/npm

WORKDIR /opt/app
COPY --from=build --chown=${USER}:${USER} /opt/app/build ./build
COPY --from=build --chown=${USER}:${USER} /opt/app/node_modules ./node_modules
COPY --from=build --chown=${USER}:${USER} /opt/app/package.json ./
COPY --from=build --chown=${USER}:${USER} /opt/app/package-lock.json ./

CMD ["npm", "start"]
EXPOSE 3000