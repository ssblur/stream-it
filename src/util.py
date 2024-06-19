import sys
from os.path import join

def frozen():
    return getattr(sys, 'frozen', False)

def module_file(path, flags="rb"):
    if getattr(sys, 'frozen', False):
        path = join(sys._MEIPASS, path)
    return open(path, flags)