import os
from PIL import Image

def optimize_images(input_dir, output_dir, target_width=700, quality=80):
    # Создаем папку назначения, если ее нет
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created folder: {output_dir}")

    # Поддерживаемые форматы (исключаем svg и уже оптимизированные)
    supported_formats = {'.jpg', '.jpeg', '.png'}

    processed_count = 0

    for filename in os.listdir(input_dir):
        ext = os.path.splitext(filename)[1].lower()
        if ext not in supported_formats:
            continue

        input_path = os.path.join(input_dir, filename)
        
        # Полный путь до файла, исключаем папки
        if not os.path.isfile(input_path):
            continue

        output_filename = os.path.splitext(filename)[0] + '.webp'
        output_path = os.path.join(output_dir, output_filename)

        try:
            with Image.open(input_path) as img:
                # Вычисляем новую высоту с сохранением пропорций
                ratio = target_width / float(img.size[0])
                target_height = int(float(img.size[1]) * float(ratio))

                # Если картинка уже меньше 700px, возможно, ее не стоит растягивать, 
                # но по ТЗ делаем ширину 700px. Для улучшения качества можно использовать LANCZOS
                img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                
                # Конвертируем в RGB если изображение в формате Palette или CMYK (для WebP)
                if img_resized.mode in ("P", "CMYK"):
                    img_resized = img_resized.convert("RGB")

                # Сохраняем в WebP
                img_resized.save(output_path, 'WEBP', quality=quality)
                print(f"Optimized: {filename} -> {output_filename} ({target_width}x{target_height})")
                processed_count += 1
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Done! Processed images: {processed_count}")

if __name__ == "__main__":
    # Указываем пути (предполагается, что скрипт запускается из папки web)
    input_directory = "public"
    output_directory = os.path.join("public", "optimized")
    
    print(f"Starting image optimization from {input_directory} to {output_directory}...")
    optimize_images(input_directory, output_directory)
