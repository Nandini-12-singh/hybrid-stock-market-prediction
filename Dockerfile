FROM node:20-slim as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.12-slim as backend

WORKDIR /app/backend
# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for the backend Express server
RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/package*.json ./
RUN npm install

# Copy Python requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend
COPY backend/ ./

# Copy the built frontend from the frontend-build stage
COPY --from=frontend-build /app/.next /app/frontend/.next
COPY --from=frontend-build /app/public /app/frontend/public

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Default command to start the Express backend
CMD ["node", "backend/index.js"]