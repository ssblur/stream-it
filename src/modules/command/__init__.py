from os.path import realpath, dirname, join
from ...server.database import add_sound
from os import system

def act(json):
    system(json["command"])

def javascript():
    return open(join(dirname(realpath(__file__)), "module.js"), "rb")