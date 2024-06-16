// JS Module for SFX
// Used to play sound effects in the Stream It! browser source

class Module {
    /**
     * Converts button json to the Manage panel for the element
     * @param {*} json Button JSON to use to generate this element
     * @param {HTMLElement} element Button JSON to use to generate this element
     */
    static fromJSON(json, element) {
        element.innerHTML = `
            <h3>SFX Settings</h3>
            <small>
                Plays the selected sound through the Stream It! browser source
                when this button is clicked.
            </small>
            <fieldset class="flex one">
                <label>
                    Currently set to <b>${json.file ?? "nothing"}</b>.
                    <form class="sfx-form">
                        <input class="sfx-file" type="file" name="file" accept="audio/*">
                    </form>
                    <input class="sfx-filename" type="hidden" value="${json.file ?? ""}">
                    <br>
                    <audio controls>
                        <source src="${json.file ?? ""}">
                    </audio>
                </label>
            </fieldset>
        `;

        let form = element.getElementsByClassName("sfx-form")[0];
        let file = form.getElementsByClassName("sfx-file")[0];

        file.addEventListener("change", (event) => {
            fetch(
                "/api/upload",
                {
                    method: "POST",
                    body: new FormData(form)
                }
            ).then(response => response.json())
            .then(data => {
                let root = event.target.parentNode.parentNode;
                let filename = root.getElementsByClassName("sfx-filename")[0];
                filename.value = data[0];

                let audio = root.getElementsByTagName("audio")[0];
                audio.remove();

                audio = document.createElement("audio");
                audio.src = data[0];
                audio.controls = 1;
                root.appendChild(audio);
            });
        });
    }

    /**
     * Generates button JSON based on the Manage panel for this element
     * @param {HTMLElement} element The element to pull information from
     * @returns {Object} Data representing this module's data for this button
     */
    static toJSON(element) {
        let file = element.getElementsByClassName("sfx-filename")[0];
        return {
            file: file.value,
        };
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "SFX";
    }
}