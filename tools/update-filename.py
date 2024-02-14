from os.path import isfile, join, exists
from os import listdir, rename
import json


def getFullName(name: str):
  return name.split('/')[len(name.split('/')) - 1]


def getName(name: str):
  return getFullName(name).split('.')[0]


def getExtension(name: str):
  return name.split('.')[len(name.split('.')) - 1]


jsonPath = 'resources/TalesOfAHaremInAnotherWorld_json'
imagePath = 'resources/TalesOfAHaremInAnotherWorld'


onlyfiles = [f for f in listdir(jsonPath) if isfile(join(jsonPath, f))]

for file in onlyfiles:
  with open(join(jsonPath, file)) as f:
    data = json.load(f)

    jsonFileName = getName(file)

    print(file)

    index = 0

    for imageName in data["images"]:

      name = getFullName(imageName)
      imagePathName = join(imagePath, jsonFileName, name)
      imagePathNewName = join(imagePath, jsonFileName,
                              str(index) + '.' + getExtension(name))
      if exists(imagePathName):
        rename(imagePathName, imagePathNewName)
        index += 1
