import pyautogui
from time import sleep

# f = open('./plugins/comick-getdata.js', 'r')

# code = ''

# for line in f.readlines():
#     code += line
#     code += '\n'


x = 3  # how many messages or comments you want to send

sleep(3)

while True:  # forever loop

    pyautogui.hotkey('ctrl', 'v')

    sleep(1)  # A bit delay of 600 ms
    pyautogui.typewrite("\n")  # New line, here 'Enter' to send text
    sleep(3)

    print(x)
    x = x - 1  # decrement x value by 1

    if x == 0:
        break  # get out of the loop and finish

# f.close()
