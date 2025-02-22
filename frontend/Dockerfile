# Stage 1: Build the app
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
RUN npm install -g vite@latest -D
COPY . .
RUN npm run build

# Stage 2: Serve the app using vite preview
FROM node:20
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json package-lock.json ./
RUN npm install --production --force
RUN npm install -g vite@latest -D

# Expose the port vite preview runs on (default is 4173)
EXPOSE 4173

# Start the app in preview mode
CMD ["npm", "run", "preview"]