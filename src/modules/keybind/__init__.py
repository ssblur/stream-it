from os.path import dirname, join, relpath
from time import sleep
from pynput.keyboard import Controller, Key
from ...server.database import add_sound
from ...util import module_file

special_keys = {
    "alt": Key.alt,
    "alt_gr": Key.alt_gr,
    "alt_l": Key.alt_l,
    "alt_r": Key.alt_r,
    "backspace": Key.backspace,
    "caps_lock": Key.caps_lock,
    "cmd": Key.cmd,
    "cmd_l": Key.cmd_l,
    "cmd_r": Key.cmd_r,
    "ctrl": Key.ctrl,
    "ctrl_l": Key.ctrl_l,
    "ctrl_r": Key.ctrl_r,
    "delete": Key.delete,
    "down": Key.down,
    "end": Key.end,
    "enter": Key.enter,
    "esc": Key.esc,
    "f1": Key.f1,
    "f2": Key.f2,
    "f3": Key.f3,
    "f4": Key.f4,
    "f5": Key.f5,
    "f6": Key.f6,
    "f7": Key.f7,
    "f8": Key.f8,
    "f9": Key.f9,
    "f10": Key.f10,
    "f11": Key.f11,
    "f12": Key.f12,
    "f13": Key.f13,
    "f14": Key.f14,
    "f15": Key.f15,
    "f16": Key.f16,
    "f17": Key.f17,
    "f18": Key.f18,
    "f19": Key.f19,
    "f20": Key.f20,
    "home": Key.home,
    "insert": Key.insert,
    "left": Key.left,
    "media_next": Key.media_next,
    "media_play_pause": Key.media_play_pause,
    "media_previous": Key.media_previous,
    "media_volume_down": Key.media_volume_down,
    "media_volume_mute": Key.media_volume_mute,
    "media_volume_up": Key.media_volume_up,
    "menu": Key.menu,
    "num_lock": Key.num_lock,
    "page_down": Key.page_down,
    "page_up": Key.page_up,
    "pause": Key.pause,
    "print_screen": Key.print_screen,
    "right": Key.right,
    "scroll_lock": Key.scroll_lock,
    "shift": Key.shift,
    "shift_l": Key.shift_l,
    "shift_r": Key.shift_r,
    "space": Key.space,
    "tab": Key.tab,
    "up": Key.up
}

def act(json):
    keys = Controller()
    press = json["type"]
    key = json["key"]
    holds = []

    if json["ctrl"]:
        holds += [Key.ctrl]
    if json["shift"]:
        holds += [Key.shift]
    if json["alt"]:
        holds += [Key.alt]
    if json["cmd"]:
        holds += [Key.cmd]

    for k in holds:
        keys.press(k)
    if holds:
        sleep(0.02)

    if key in special_keys:
        key = special_keys[key]

    if press != "release":
        keys.press(key)
    
    if press == "tap":
        sleep(0.05)

    if press != "press":
        keys.release(key)

    for k in holds:
        keys.release(k)

def javascript():
    return module_file(join(dirname(relpath(__file__, ".")), "module.js"))