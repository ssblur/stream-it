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
            <h3>Image Settings</h3>
            <small>
                Displays a graphic on the Stream It! browser source at the supplied
                position for a set duration.
            </small>
            <fieldset class="flex one">
                <label class="flex two">
                    <div class="two-third">Seconds On-Screen:</div>
                    <input 
                        type="number" 
                        min="0"
                        class="image-duration third"
                        value="${json.duration ?? 10}">
                </label>
                <label class="flex two">
                    <div class="two-third">X Position (% of screen):</div>
                    <input 
                        type="number" 
                        min="-100" 
                        max="100" 
                        class="image-x third"
                        value="${json.x ?? 10}">
                </label>
                <label class="flex two">
                    <div class="two-third">Y Position (% of screen):</div>
                    <input 
                        type="number" 
                        min="-100" 
                        max="100" 
                        class="image-y third"
                        value="${json.y ?? 10}">
                </label>
                <label class="flex two">
                    <div class="two-third">Width (% of screen):</div>
                    <input 
                        type="number" 
                        min="-100" 
                        max="100" 
                        class="image-width third"
                        value="${json.width ?? 25}">
                </label>
                <!-- <label class="flex two">
                    <div class="two-third">Height (% of screen):</div>
                    <input 
                        type="number" 
                        min="-100" 
                        max="100" 
                        class="image-height third" 
                        value="${json.height ?? 25}">
                </label> -->
                <label>
                    <input class="image-fade" type="checkbox" ${json.fade ? "checked" : ""}>
                    <span class="checkable">Fade In</span>
                </label>
                <label>
                    <input class="image-randomize" type="checkbox" ${json.randomize ? "checked" : ""}>
                    <span class="checkable">Randomize Position</span>
                </label>
                <label>
                    Currently set to <b>${json.file ?? "nothing"}</b>.
                    <form class="image-form">
                        <input class="image-file" type="file" name="file" accept="image/*">
                    </form>
                    <input class="image-filename" type="hidden" value="${json.file ?? ""}">
                </label>
            </fieldset>
        `;

        let form = element.getElementsByClassName("image-form")[0];
        let file = form.getElementsByClassName("image-file")[0];
        if(json.file) {
            let image = document.createElement("img");
            image.style.maxWidth = "100%";
            image.src = json.file;
            form.appendChild(image);
        }

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
                let filename = root.getElementsByClassName("image-filename")[0];
                filename.value = data[0];

                let image = root.getElementsByTagName("img");
                if(image.length)
                    image[0].remove();

                image = document.createElement("img");
                image.style.maxWidth = "100%";
                image.src = data[0];
                root.appendChild(image);
            });
        });
    }

    /**
     * Generates button JSON based on the Manage panel for this element
     * @param {HTMLElement} element The element to pull information from
     * @returns {Object} Data representing this module's data for this button
     */
    static toJSON(element) {
        let file = element.getElementsByClassName("image-filename")[0];
        let duration = element.getElementsByClassName("image-duration")[0];
        let x = element.getElementsByClassName("image-x")[0];
        let y = element.getElementsByClassName("image-y")[0];
        let width = element.getElementsByClassName("image-width")[0];
        let height = 0; // Unused; prefer 'auto'
        let fade = element.getElementsByClassName("image-fade")[0];
        let randomize = element.getElementsByClassName("image-randomize")[0];
        return {
            file: file.value,
            duration: duration.value,
            x: x.value,
            y: y.value,
            width: width.value,
            height: height.value,
            fade: fade.checked,
            randomize: randomize.checked
        };
    }

    /**
     * @returns {String} A name for this module
     */
    static getName() {
        return "Image";
    }
}