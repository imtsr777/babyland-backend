# ---- build stage: install all deps and compile TypeScript ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- runtime stage: production deps + compiled code only ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/dist ./dist

# Uploaded images live here (mounted as a volume); must be writable by the non-root user
RUN mkdir -p /app/images && chown -R node:node /app/images
USER node

EXPOSE 8008
# Run node directly so it receives SIGTERM from `docker stop`
CMD ["node", "dist"]
