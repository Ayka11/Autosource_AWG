# Production image: build React, serve static files with Express (server.js)
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time env for CRA (optional; override at build with Cloud Build substitutions)
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_VERTEX_API_KEY
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_VERTEX_API_KEY=$REACT_APP_VERTEX_API_KEY

RUN npm run build

ENV NODE_ENV=production
EXPOSE 8080

# Cloud Run sets PORT; server.js reads process.env.PORT
CMD ["npm", "run", "start:prod"]
