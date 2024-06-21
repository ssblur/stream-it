import sys
from os.path import join

def frozen():
    return getattr(sys, 'frozen', False)

def module_file(path, flags="rb"):
    return open(module_path(path), flags)

def module_path(path):
    if getattr(sys, 'frozen', False):
        return join(sys._MEIPASS, path)
    return path