FROM python:3.11-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Запрещаем Python писать .pyc файлы на диск (оптимизация)
ENV PYTHONDONTWRITEBYTECODE 1
# Запрещаем буферизацию stdin/stdout (чтобы логи сразу выводились в терминал)
ENV PYTHONUNBUFFERED 1

# Копируем файл с зависимостями
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код бота
COPY . .

# Команда для запуска бота
CMD ["python", "main.py"]
