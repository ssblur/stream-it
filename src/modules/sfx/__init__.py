from os.path import realpath, dirname, join
from ...server.database import add_sound


def act(json):
    # add the sfx to the browser source
    add_sound(json["file"])

def javascript():
    return open(join(dirname(realpath(__file__)), "module.js"), "rb")