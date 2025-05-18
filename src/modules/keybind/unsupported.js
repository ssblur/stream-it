// JS Module for Commands
// Provided when keyboard is unsupported for a platform

class Module {
    static fromJSON(json, element) {
        element.innerHTML = `
            <h3>Key Settings</h3>
            <small>
                Currently unsupported on this platform.
            </small>
        `;
    }

    /**
     * Generates button JSON based on the Manage panel for this element
     * @param {HTMLElement} element The element to pull information from
     * @returns {Object} Data representing this module's data for this button
     */
    static toJSON(element) {
        return {};
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Key";
    }
}