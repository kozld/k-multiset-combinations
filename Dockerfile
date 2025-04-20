ARG BUILDER_IMAGE="node:lts-alpine"
ARG RUNNER_IMAGE="node:lts-slim"

# Stage 1: Build
FROM ${BUILDER_IMAGE} AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM ${RUNNER_IMAGE} AS runner

WORKDIR /app

# Only production-dependencies
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

CMD ["node", "dist/index.js"]