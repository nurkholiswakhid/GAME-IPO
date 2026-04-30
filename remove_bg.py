import os
from rembg import remove
from PIL import Image

def remove_background(input_path, output_path):
    print(f"Processing: {input_path}")
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path, format="PNG")
        print(f"Success: Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

public_dir = os.path.join("frontend", "public")
characters = ["char_arka.png", "char_nexa.png", "char_dira.png", "char_rivo.png", "char_zeno.png", "char_ardi.png", "char_budi.png"]

for char_file in characters:
    file_path = os.path.join(public_dir, char_file)
    if os.path.exists(file_path):
        remove_background(file_path, file_path) # Overwrite
    else:
        print(f"File not found: {file_path}")

print("Background removal complete.")
