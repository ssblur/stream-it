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
            <h3>Command Settings</h3>
            <small>
                Runs the following command when the button is pressed. 
                <br>
                On Windows this is run in cmd, on OS X this is run through Terminal,
                and on Linux this is run through your default shell provider.
            </small>
            <fieldset class="flex one">
                <label>
                    <input class="command-command" type="text" value="${json.command ?? "echo Test command"}">
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
        let command = element.getElementsByClassName("command-command")[0];
        return {
            command: command.value,
        };
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Command";
    }
}