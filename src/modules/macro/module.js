// JS Module for SFX
// Used to play sound effects in the Stream It! browser source

class Module {
    /**
     * Converts button json to the Manage panel for the element
     * @param {*} json Button JSON to use to generate this element
     * @param {HTMLElement} element Button JSON to use to generate this element
     */
    static fromJSON(json, element) {
        let options = ""; // Add an entry for each button type.

        for(let [key, value] of Object.entries(MODULES))
            if(value.getName() != "Macro")
                options += `<option value="${key}">${value.getName()}</option>`;

        element.innerHTML = `
            <h3>Macro</h3>
            <small>
                Allows you to chain multiple actions in one button. 
                Actions are run in order, top to bottom.
            </small>
            <fieldset class="flex one">
                <label>
                    <select class="macro-controls">
                        ${options}
                    </select>
                </label>
                <label>
                    <button class="full macro-add">
                        Add Action
                    </button>
                </label>
            </fieldset>
            
            <fieldset class="flex one macro-macros">

            </fieldset>
        `;

        let addButton = element.getElementsByClassName("macro-add")[0];
        addButton.onclick = () => {
            let mod = element.getElementsByClassName("macro-controls")[0].value;
            let macro = document.createElement("div");
            macro.className = `macro-macro macro-macro-${mod}`;
            MODULES[mod].fromJSON({}, macro);

            let hr = document.createElement("hr");

            let del = document.createElement("button");
            del.innerText = `Remove ${MODULES[mod].getName()}`;
            del.className = "full dangerous";
            del.onclick = () => {
                macro.remove();
                hr.remove();
            };
            macro.appendChild(del);

            let macros = element.getElementsByClassName("macro-macros")[0];
            macros.appendChild(hr);
            macros.appendChild(macro);
        };

        if(json.macros)
            for(let data of json.macros) {
                let mod = data.mod;
                let macro = document.createElement("div");
                macro.className = `macro-macro macro-macro-${mod}`;
                MODULES[mod].fromJSON(data.data, macro);
    
                let hr = document.createElement("hr");
    
                let del = document.createElement("button");
                del.innerText = `Remove ${MODULES[mod].getName()}`;
                del.className = "full dangerous";
                del.onclick = () => {
                    macro.remove();
                    hr.remove();
                };
                macro.appendChild(del);
    
                let macros = element.getElementsByClassName("macro-macros")[0];
                macros.appendChild(hr);
                macros.appendChild(macro);
            }
    }

    /**
     * Generates button JSON based on the Manage panel for this element
     * @param {HTMLElement} element The element to pull information from
     * @returns {Object} Data representing this module's data for this button
     */
    static toJSON(element) {
        // Generate the JSON for each sub-module
        let data = {}
        data.macros = [];

        let macros = element.getElementsByClassName("macro-macros")[0];
        for(let macro of macros.getElementsByClassName("macro-macro")) {
            let mod = null;
            for(let className of macro.classList)
                if(className.startsWith("macro-macro-"))
                    mod = className.substring(12);
            data.macros.push({
                mod: mod,
                data: MODULES[mod].toJSON(macro)
            });
        }

        return data;
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Macro";
    }
}