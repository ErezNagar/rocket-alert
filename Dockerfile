FROM --platform=$BUILDPLATFORM alpine:3.18 as build-base

RUN apk update && \
    apk add --no-cache curl xz busybox gcc g++ make musl-dev nodejs npm \
    curl -fsSL http://ftp.gnu.org/gnu/tar/tar-1.34.tar.gz -o tar-1.34.tar.gz && \
    tar -xzf tar-1.34.tar.gz && \
    cd tar-1.34 && \
    export FORCE_UNSAFE_CONFIGURE=1 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf tar-1.34 tar-1.34.tar.gz

RUN echo "Node.js path:" && which node && node -v
RUN echo "npm path:" && which npm && npm -v

FROM build-base as build

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

FROM --platform=$TARGETPLATFORM cgr.dev/chainguard/wolfi-base as wolfi-node

COPY --from=build /usr/local /usr/local
COPY --from=build /usr/lib /usr/lib
COPY --from=build /usr/bin/node /usr/bin/node
COPY --from=build /usr/bin/npm /usr/bin/npm

WORKDIR /opt/app
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/package-lock.json ./

CMD ["npm", "start"]
EXPOSE 3000
