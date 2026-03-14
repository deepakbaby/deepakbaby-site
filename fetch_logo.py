import urllib.request
import json

url = "https://raw.githubusercontent.com/openclaw/openclaw/main/assets/logo.svg"
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
