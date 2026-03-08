import os
import json

with open("./webignore.json", 'r') as f:
    IGNORE = set(json.load(f))

def cleanup():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE]
        for file in files:
            if file.endswith('.cast') or file == 'index.html' or file == 'files.json':
                file_path = os.path.join(root, file)
                print("del", file_path)
                os.remove(file_path)

if __name__ == "__main__":
    cleanup()

