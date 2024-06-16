from pkgutil import iter_modules
from .. import modules as mods
from os.path import dirname
from importlib import import_module

path = dirname(mods.__file__)
modules = {}
for i in iter_modules((path,)):
    modules[i.name] = import_module(f".{i.name}", package=mods.__package__)