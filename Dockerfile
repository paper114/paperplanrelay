FROM m.daocloud.io/docker.io/library/node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm ci --ignore-scripts
RUN SHARP_DIST_BASE_URL=https://npmmirror.com/mirrors/sharp-libvips/v8.14.5/ \
  npm_config_sharp_dist_base_url=https://npmmirror.com/mirrors/sharp-libvips/v8.14.5/ \
  npm_config_sharp_binary_host=https://npmmirror.com/mirrors/sharp/ \
  npm rebuild sharp --foreground-scripts

COPY . .

ARG VITE_CONTACT_EMAIL=
ARG VITE_ICP_BEIAN=
ARG VITE_PUBLIC_SECURITY_BEIAN=
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
ENV VITE_ICP_BEIAN=$VITE_ICP_BEIAN
ENV VITE_PUBLIC_SECURITY_BEIAN=$VITE_PUBLIC_SECURITY_BEIAN

RUN DATABASE_URL=file:/data/paperplane.db /app/node_modules/.bin/prisma generate --schema server/prisma/schema.prisma \
  && npm run build --workspace=client \
  && npm run build --workspace=server

FROM m.daocloud.io/docker.io/library/node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/package*.json ./server/
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma

EXPOSE 3000

CMD ["sh", "-c", "/app/node_modules/.bin/prisma migrate deploy --schema server/prisma/schema.prisma && node server/dist/index.js"]
