// JS Module for Commands
// Used to run commands on the host system

class Module {
    /**
     * Converts button json to the Manage panel for the element
     * @param {*} json Button JSON to use to generate this element
     * @param {HTMLElement} element Button JSON to use to generate this element
     */
    static fromJSON(json, element) {
        element.innerHTML = `
            <h3>Key Settings</h3>
            <small>
                Presses a key when the button is pressed.
            </small>
            <fieldset class="flex one">
                <label>
                    <input class="key-key" type="text" value="${json.key ?? "space"}">
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
        return {
            key: key.value,
            type: type.value
        };
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Key";
    }
}