# ----------- Builder stage ------------
FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install --verbose && \
    npm rebuild sqlite3 --build-from-source --verbose && \
    apt-get remove -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

# ----------- Production stage ------------
FROM node:18-bullseye

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/conf.yml ./conf.yml
COPY --from=builder /app/Vue ./Vue
COPY package*.json ./

EXPOSE 8030

CMD ["npm", "run", "start:prod"]
