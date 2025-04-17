FROM node:18 AS build
RUN npm install -g pnpm
WORKDIR /app
# pnpm 사용 시 이 두개만 필요
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf