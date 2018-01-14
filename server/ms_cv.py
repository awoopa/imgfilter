import requests, base64

headers = {
  # Request headers.
  'Content-Type': 'application/octet-stream',
 
  # NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
  'Ocp-Apim-Subscription-Key': 'b944a6ebb9434cb48fa88f8dc3ea4e2d',
}

params = {
  # Request parameters. All of them are optional.
  'visualFeatures': 'Categories,Description',
  'details': 'Celebrities',
  'language': 'en',
}


# Filename to caption cache
caption_cache = {}

# Filename to (microsoft cognitive services) tags cache
tag_cache = {}
def query(image_path):
  image = open(image_path,'rb').read() # Read image file in binary mode

  try:
    response = requests.post(url='https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze',
                             headers=headers,
                             params=params,
                             data=image)
    data = response.json()
  except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

  tag_cache[image_path] = data['description']['tags']
  caption_cache[image_path] = data['description']['captions'][0]['text']

def predict_tags(image_path):
  """
  Get tags for the image.
  """
  if image_path not in tag_cache:
    query(image_path)

  return tag_cache[image_path]

def predict_caption(image_path):
  """
  Get caption for the image.
  """
  if image_path not in caption_cache:
    query(image_path)

  return caption_cache[image_path]
