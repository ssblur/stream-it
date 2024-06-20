from os.path import dirname, join, relpath
from ...server.database import add_sound
from ...util import module_file


def act(json):
    from ...server.modules import modules
    for macro in json["macros"]:
        modules[macro["mod"]].act(macro["data"])

def javascript():
    return open(join(dirname(__file__), "module.js"), "rb")