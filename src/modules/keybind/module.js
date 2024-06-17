// JS Module for Commands
// Used to run commands on the host system

class Module {
    /**
     * Converts button json to the Manage panel for the element
     * @param {*} json Button JSON to use to generate this element
     * @param {HTMLElement} element Button JSON to use to generate this element
     */
    static fromJSON(json, element) {
        let keys = {
            "alt": "Alt",
            "alt_gr": "AltGr",
            "alt_l": "Left Alt",
            "alt_r": "Right Alt",
            "backspace": "Backspace",
            "caps_lock": "Caps Lock",
            "cmd": "Windows / Command / Super",
            "cmd_l": "Left Windows / Command / Super",
            "cmd_r": "Right Windows / Command / Super",
            "ctrl": "Ctrl",
            "ctrl_l": "Left Ctrl",
            "ctrl_r": "Right Ctrl",
            "delete": "Delete",
            "down": "Down Arrow",
            "end": "End",
            "enter": "Enter / Return",
            "esc": "Esc",
            "f1": "F1",
            "f2": "F2",
            "f3": "F3",
            "f4": "F4",
            "f5": "F5",
            "f6": "F6",
            "f7": "F7",
            "f8": "F8",
            "f9": "F9",
            "f10": "F10",
            "f11": "F11",
            "f12": "F12",
            "f13": "F13",
            "f14": "F14",
            "f15": "F15",
            "f16": "F16",
            "f17": "F17",
            "f18": "F18",
            "f19": "F19",
            "f20": "F20",
            "home": "Home",
            "insert": "Insert",
            "left": "Left Arrow",
            "media_next": "Next Song",
            "media_play_pause": "Play / Pause",
            "media_previous": "Previous Song",
            "media_volume_down": "Volume Down",
            "media_volume_mute": "Mute",
            "media_volume_up": "Volume Up",
            "menu": "Context Menu",
            "num_lock": "Num Lock",
            "page_down": "Page Down",
            "page_up": "Page Up",
            "pause": "Pause / Break",
            "print_screen": "Print Screen",
            "right": "Right Arrow",
            "scroll_lock": "Scroll Lock",
            "shift": "Shift",
            "shift_l": "Left Shift",
            "shift_r": "Right Shift",
            "space": "Space Bar",
            "tab": "Tab Bar",
            "up": "Up Arrow",
            "q": "Q",
            "w": "W",
            "e": "E",
            "r": "R",
            "t": "T",
            "y": "Y",
            "u": "U",
            "i": "I",
            "o": "O",
            "p": "P",
            "a": "A",
            "s": "S",
            "d": "D",
            "f": "F",
            "g": "G",
            "h": "H",
            "j": "J",
            "k": "K",
            "l": "L",
            "z": "Z",
            "x": "X",
            "c": "C",
            "v": "V",
            "b": "B",
            "n": "N",
            "m": "M",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "9",
            "0": "0",
            "[": "[",
            "]": "]",
            "\\": "\\",
            ";": "'",
            ",": ",",
            ".": ".",
            "/": "/",
            "-": "-",
            "=": "=",
            "*": "*",
            "-": "-",
            "+": "+",
            "`": "`"
        };

        let options = "";
        for(let option in keys)
            options += `<option value="${option}" ${json.key == option ? "selected" : ""}>
                ${keys[option]}
            </option>`;

        element.innerHTML = `
            <h3>Key Settings</h3>
            <small>
                Presses a key when the button is pressed.
            </small>
            <fieldset class="flex one">
                <label>
                    <input class="key-ctrl" type="checkbox" ${json.ctrl ? "checked" : ""}>
                    <span class="checkable">Ctrl</span>
                </label>
                <label>
                    <input class="key-shift" type="checkbox" ${json.shift ? "checked" : ""}>
                    <span class="checkable">Shift</span>
                </label>
                <label>
                    <input class="key-alt" type="checkbox" ${json.alt ? "checked" : ""}>
                    <span class="checkable">Alt</span>
                </label>
                <label>
                    <input class="key-cmd" type="checkbox" ${json.cmd ? "checked" : ""}>
                    <span class="checkable">Windows / Command / Super</span>
                </label>
                <label>
                    <select class="key-key" value="${json.key ?? "space"}">
                        ${options}
                    </select>
                </label>
                <label>
                    <select class="key-type" value="${json.type ?? "tap"}">
                        <option value="tap" ${json.type == "tap" ? "selected" : ""}>Tap</option>
                        <option value="press" ${json.type == "press" ? "selected" : ""}>Hold</option>
                        <option value="release" ${json.type == "release" ? "selected" : ""}>Release</option>
                    </select>
                </label>
            </fieldset>
        `;
    }

    /**
     * Generates button JSON based on the Manage panel for this element
     * @param {HTMLElement} element The element to pull information from
     * @returns {Object} Data representing this module's data for this button
     */
    static toJSON(element) {
        let key = element.getElementsByClassName("key-key")[0];
        let type = element.getElementsByClassName("key-type")[0];
        let ctrl = element.getElementsByClassName("key-ctrl")[0];
        let shift = element.getElementsByClassName("key-shift")[0];
        let alt = element.getElementsByClassName("key-alt")[0];
        let cmd = element.getElementsByClassName("key-cmd")[0];
        return {
            key: key.value,
            type: type.value,
            ctrl: ctrl.checked,
            shift: shift.checked,
            alt: alt.checked,
            cmd: cmd.checked,
        };
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Key";
    }
}