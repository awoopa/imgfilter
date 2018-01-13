from collections import defaultdict
from IPython import display
from PIL import Image
from torch import nn
from torch.autograd import Variable
from torchvision import models, transforms

import json
import numpy as np
import torch

# Define a global transformer to appropriately scale images and subsequently convert them to a Tensor.
img_size = 224
loader = transforms.Compose([
  transforms.Resize(img_size),
  transforms.CenterCrop(img_size),
  transforms.ToTensor(),
]) 
def load_image(filename):
  """
  Simple function to load and preprocess the image.

  1. Open the image.
  2. Scale/crop it and convert it to a float tensor.
  3. Convert it to a variable (all inputs to PyTorch models must be variables).
  4. Add another dimension to the start of the Tensor (b/c VGG expects a batch).
  5. Move the variable onto the GPU.
  """
  image = Image.open(filename).convert('RGB')
  image_tensor = loader(image).float()
  image_var = Variable(image_tensor).unsqueeze(0)
  return image_var.cuda()

# Load ImageNet label to category name mapping.
imagenet_categories = list(json.load(open('data/imagenet_categories.json')).values())

# Load pretrained VGG model
vgg_model = models.vgg16(pretrained=True).cuda()
vgg_model.eval()

def predict_tags(image_path, num=10):
  """
  Given an image path, return the top [num] predictions, along with their corresponding
  probabilities.
  """
  # Define a softmax layer, for the probabilities.
  softmax = nn.Softmax(dim=0)

  # Load/preprocess the image.
  img = load_image(image_path)

  # Run the image through the model and softmax.
  label_likelihoods = softmax(vgg_model(img).squeeze())

  # Get the top 5 labels, and their corresponding likelihoods.
  probs, indices = label_likelihoods.topk(num)

  # Iterate and return the predictions.
  predictions = []
  for i in range(num):
    predictions.append((imagenet_categories[indices.data[i]], probs.data[i]))

  return predictions
