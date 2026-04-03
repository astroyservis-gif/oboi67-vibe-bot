# Этап 1: Сборка (Build)
FROM node:22-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код проекта
COPY . .

# Собираем Vite-приложение (результат появится в папке /app/dist)
RUN npm run build

# Этап 2: Раздача статики через Nginx (Production)
FROM nginx:alpine

# Удаляем дефолтный конфиг Nginx и копируем наш
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные файлы из первого этапа (build) в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем 80 порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
