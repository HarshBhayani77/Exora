FROM node:20-alpine

WORKDIR /app

# Install dependencies required for Prisma client and entrypoint network probe
RUN apk add --no-cache libc6-compat openssl netcat-openbsd

# Copy dependency manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Linux client
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Build production Next.js bundle
RUN npm run build

# Configure entrypoint script (handling CRLF if copied from Windows)
COPY docker-entrypoint.sh /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npx", "next", "start", "-p", "3001", "-H", "0.0.0.0"]
