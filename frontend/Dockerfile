FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm install

COPY . .

# Build-time environment variables for Next.js build
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
ENV NEXT_PUBLIC_CURRENCY=INR
ENV NEXT_PUBLIC_CURRENCY_SYMBOL=₹
ENV NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
