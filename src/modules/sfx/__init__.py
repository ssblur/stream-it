from os.path import dirname, join, relpath
from ...util import module_file
from ...server.database import add_sound


def act(json):
    # add the sfx to the browser source
    add_sound(json["file"])

def javascript():
    return open(join(dirname(__file__), "module.js"), "rb")