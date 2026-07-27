# Build the React application with a same-origin API path for production.
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Run the API and serve the compiled frontend from the same container.
FROM node:22-alpine AS production

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
# Prisma CLI is required at startup to apply committed migrations safely.
RUN npm ci --include=dev

COPY backend/ ./
RUN npx prisma generate

COPY --from=frontend-build /app/frontend/dist /app/frontend-dist

RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
