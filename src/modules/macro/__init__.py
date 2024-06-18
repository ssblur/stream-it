from os.path import realpath, dirname, join
from ...server.database import add_sound


def act(json):
    from ...server.modules import modules
    for macro in json["macros"]:
        modules[macro["mod"]].act(macro["data"])

def javascript():
    return open(join(dirname(realpath(__file__)), "module.js"), "rb")