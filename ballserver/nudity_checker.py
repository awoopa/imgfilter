from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler, url

import json
import classify_nsfw

#docker run --volume=$(pwd):/workspace bvlc/caffe:cpu python ./main.py

class MainHandler(RequestHandler):
  def get(self):
    self.write("Hello, this is the nudity checker.")

class ImageHandler(RequestHandler):
  def post(self):
    image_data = self.request.files['image'][0]['body']
    image_name = self.get_argument('name')
    blocked_words = json.loads(self.get_argument('block'))
  
    # Write the file to disk
    open("temp/%s" % image_name, "wb+").write(image_data)

    # Determine block or not
    score  = is_nude("temp/%s" % image_name)

    self.finish(json.dumps({"nsfw_score": score}))

def is_nude(image_path):
  """
  Determine whether or not to block, and return the caption.
  """
  return classify_nsfw.main(image_path)
  
 
def make_app():
  return Application([
    url(r"/", MainHandler),
    url(r"/test", ImageHandler),
    url(r"/image", ImageHandler),
  ])

def main():
  app = make_app()
  app.listen(9999)
  print('Running app.')
  IOLoop.instance().start()

if __name__ == "__main__":
  main()

