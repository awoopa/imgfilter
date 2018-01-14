import json
import requests

api_endpoint = "http://40.71.180.110:8080/image"

def has_nudity(image_path):
  files = {'image': open(image_path, 'rb').read()}
  res = requests.post(api_endpoint, params={'name': image_path}, files=files)

  print(res.text)
  
  return json.loads(res.text)['nsfw_score'] > 0.05
