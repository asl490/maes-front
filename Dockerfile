FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/owner_template/browser/ /usr/share/nginx/html/
COPY --from=build /app/dist/owner_template/browser/index.csr.html /usr/share/nginx/html/index.html
EXPOSE 8080
