from os.path import realpath, dirname, join
from random import randint
from ...server.database import add_image


def act(json):
    x = int(json["x"]) 
    y = int(json["y"])
    if json["randomize"]:
        x += randint(-5, 5)
        y += randint(-5, 5)
    add_image(
        filename = json["file"], 
        duration = json["duration"], 
        x = x, 
        y = y, 
        width = json["width"],
        # height = json["height"],
        height = 0,
        fade_in = json["fade"]
    )

def javascript():
    return open(join(dirname(realpath(__file__)), "module.js"), "rb")