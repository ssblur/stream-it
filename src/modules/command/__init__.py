from os.path import dirname, join, relpath
from os import system
from ...server.database import add_sound
from ...util import module_file

def act(json):
    system(json["command"])

def javascript():
    return open(join(dirname(__file__), "module.js"), "rb")