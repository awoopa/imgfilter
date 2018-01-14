from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler, url

import epilepsy
import json
import ms_cv
import tag as tagger

class MainHandler(RequestHandler):
  def get(self):
    self.write("Hello, world")


class ImageHandler(RequestHandler):
  def post(self):
    print("request!")
    image_data = self.request.files['image'][0]['body']
    image_name = self.get_argument('name')
    blocked_words = json.loads(self.get_argument('block'))

    # Write the file to disk
    open("temp/%s" % image_name, "wb+").write(image_data)

    # Determine block or not
    block, caption = should_block("temp/%s" % image_name, blocked_words)

    self.finish(json.dumps({"block": block, "caption": caption}))


class GIFHandler(RequestHandler):
  def post(self):
    gif_data = self.request.files['gif'][0]['body']
    gif_name = self.get_argument('name')
  
    # Write the file to disk
    open("temp/%s" % gif_name, "wb+").write(gif_data)

    # Determine block or not
    block = should_block_gif("temp/%s" % gif_name)

    self.finish(json.dumps({"block": block, "caption": "GIF"}))


def should_block_gif(gif_path):
  """
  Determine whether or not to block GIF.
  """
  return epilepsy.is_gif_safe(gif_path)


def should_block(image_path, blocked_words):
  """
  Determine whether or not to block, and return the caption.
  """
  vgg_tags = [e[0] for e in tagger.predict_tags(image_path)]
  ms_tags = ms_cv.predict_tags(image_path)
  ms_caption = ms_cv.predict_caption(image_path)

  for word in blocked_words:
    for tag in vgg_tags + ms_tags:
      if word in tag:
        return True, ms_caption

  return False, ms_caption


def make_app():
  return Application([
    url(r"/", MainHandler),
    url(r"/test", ImageHandler),
    url(r"/image", ImageHandler),
    url(r"/gif", GIFHandler),
  ])


def main():
  app = make_app()
  app.listen(9999)
  print('Running app.')
  IOLoop.instance().start()

if __name__ == "__main__":
  main()

