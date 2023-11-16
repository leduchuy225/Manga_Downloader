import re
import os
import shutil


def condition(element: str):
    return int(element.split("_")[0])


mypath = os.path.abspath('./plugins/Kindaichi')


for data_file in sorted(os.listdir(mypath), key=condition):
    print(data_file)

    x = re.findall(r"File (\d+)", data_file)

    # Trick
    if len(x) == 0:
        x.append('6')

    des = os.path.abspath('./plugins/Kindaichi/Kindaichi_' +
                          str((int(x[0]) // 3) + 1))
    # Check whether the specified path exists or not
    isExist = os.path.exists(des)
    if not isExist:
        # Create a new directory because it does not exist
        os.makedirs(des)
        print("The new directory is created!")

    src_path = os.path.abspath('./plugins/Kindaichi/' + data_file)

    shutil.move(src_path, des)
