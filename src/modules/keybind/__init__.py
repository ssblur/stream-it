from os.path import realpath, dirname, join
from ...server.database import add_sound
from time import sleep
from pynput.keyboard import Controller

def act(json):
    keys = Controller()
    press = json["type"]

    if press != "release":
        keys.press(json["key"])
    
    if press == "tap":
        sleep(0.05)

    if press != "press":
        keys.release(json["key"])

def javascript():
    return open(join(dirname(realpath(__file__)), "module.js"), "rb")