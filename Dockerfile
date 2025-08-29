FROM node:22

WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the internal port
EXPOSE 8000

# Start with PM2
CMD ["pm2-runtime", "ecosystem.config.js"]