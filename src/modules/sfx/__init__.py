from os.path import dirname, join, relpath
from ...util import module_file
from ...server.database import add_sound


def act(json):
    # add the sfx to the browser source
    add_sound(json["file"])

def javascript():
    return module_file(join(dirname(relpath(__file__, ".")), "module.js"))