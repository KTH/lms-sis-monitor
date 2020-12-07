FROM node:10-alpine

COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

# Source files
COPY [".env.in", ".env.in"]
COPY ["app.js", "app.js"]

# Source directories
COPY ["src", "src"]

RUN npm ci --production
EXPOSE 3000
CMD ["node", "app.js"]
