from os.path import dirname, join, relpath
from os import system
from ...server.database import add_sound
from ...util import module_file

def act(json):
    system(json["command"])

def javascript():
    return module_file(join(dirname(relpath(__file__, ".")), "module.js"))