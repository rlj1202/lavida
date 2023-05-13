FROM node:19.9.0-alpine AS builder
ARG BUILD_CONTEXT

WORKDIR /base
COPY . .

RUN npm ci
RUN npm run build:${BUILD_CONTEXT}

FROM node:19.9.0-alpine
ARG BUILD_CONTEXT

WORKDIR /base
COPY --from=builder /base/package.json .
COPY --from=builder /base/node_modules ./node_modules
COPY --from=builder /base/apps/${BUILD_CONTEXT}/package.json ./apps/${BUILD_CONTEXT}/
COPY --from=builder /base/apps/${BUILD_CONTEXT}/dist ./apps/${BUILD_CONTEXT}/dist

ENV BUILD_CONTEXT=${BUILD_CONTEXT}
ENV NODE_ENV=production
CMD npm run start:prod:${BUILD_CONTEXT}
