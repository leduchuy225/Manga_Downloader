import re
import os
import shutil

# Config
numberOfFileInFolder = 30

currentPath = './liar_game'
newPath = './liar_game'

# Process


def condition(element: str):
  return int(float(element.split("_")[0]))


mypath = os.path.abspath(currentPath)


for data_file in sorted(os.listdir(mypath), key=condition):
  print(data_file)

  # x = re.findall(r"File (\d+)", data_file)

  # # Trick
  # if len(x) == 0:
  #     x.append('6')

  des = os.path.abspath(newPath+'/liar_game_' +
                        str((int(float(data_file.split('_')[0])) // numberOfFileInFolder) + 1))
  # Check whether the specified path exists or not
  isExist = os.path.exists(des)
  if not isExist:
    # Create a new directory because it does not exist
    os.makedirs(des)
    print("The new directory is created!")

  src_path = os.path.abspath(currentPath + '/' + data_file)

  shutil.move(src_path, des)
