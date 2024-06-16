/**
 * UUID v4 generator
 * @see https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
 * @returns 
 */
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

function createButton(uuid, name, color, width, modules) {
    let buttons = document.getElementById("buttons");
    let template = document.getElementById("button-template");
    
    let div = document.createElement("div");
    div.className = "p-3 button-config";
    div.innerHTML = template.innerHTML;

    buttons.appendChild(div);

    for(let key in modules) {
        let modulePlaceholder = div.getElementsByClassName("placeholder-module")[0];
        modulePlaceholder.className = `module-config module-config-${key}`;
        MODULES[key].fromJSON(modules[key], modulePlaceholder);
    }

    div.getElementsByClassName("button-uuid")[0].value = uuid;

    div.getElementsByClassName("delete-button")[0].onclick = () => {
        div.remove();
    };

    let button = div.getElementsByClassName("button-name")[0];
    button.onclick = () => fetch(
        `/api/activate/${uuid}`,
        {
            method: "POST",
            body: "{}"
        }
    ).then(console.log);

    let nameElement = div.getElementsByClassName("appearance-name")[0];
    nameElement.oninput = () => {
        if(nameElement.value.trim() == "")
            button.innerText = "Button";
        else
            button.innerText = nameElement.value;
    }
    nameElement.value = name;
    button.innerText = name;
    
    let colorElement = div.getElementsByClassName("appearance-color")[0];
    colorElement.oninput = () => {
        let value = colorElement.value;
        if(value.trim() == "")
            button.style.backgroundColor = "";
        else
            button.style.backgroundColor = value;
    }
    colorElement.value = color;
    button.style.backgroundColor = color;

    let widthElement = div.getElementsByClassName("appearance-width")[0];
    widthElement.oninput = () => {
        let value = widthElement.value;
        value = parseInt(value);
        div.style.width = `${25 * value}%`;
    }
    widthElement.value = width;
    div.style.width = `${25 * width}%`;
}

window.onload = () => {
    let container = document.getElementById("button-container");
    for(let key in MODULES) {
        let module = MODULES[key];
        let button = document.createElement("button");
        let data = {};
        data[key] = {}

        button.className = "full";
        button.innerText = `Add ${module.getName()}`;
        button.onclick = () => {
            createButton(uuidv4(), "", "", 1, data)
        };

        container.appendChild(button);
    };

    let saveButton = document.getElementById("save-button");
    saveButton.onclick = () => {
        let configs = document.getElementsByClassName("button-config");
        let output = {};

        // Save module data
        // Why did I decide to use class names for state? 
        // Who knows but I'm doing this for fun.
        // Might as well get goofy with it
        for(let config of configs) {
            let uuid = config.getElementsByClassName("button-uuid")[0].value;
            let moduleConfig = config.getElementsByClassName("module-config")[0];
            let data = {};

            for(let className of moduleConfig.classList)
                if(className.startsWith("module-config-")) { // Seriously I know I was sick but why did I do this
                    console.log(className.substring(14));
                    data[className.substring(14)] = MODULES[className.substring(14)].toJSON(moduleConfig);
                }

            output[uuid] = {
                name: config.getElementsByClassName("appearance-name")[0].value,
                color: config.getElementsByClassName("appearance-color")[0].value,
                width: config.getElementsByClassName("appearance-width")[0].value,
                data: data
            };
        }

        fetch(
            "/api/update",
            {
                method: "POST",
                body: JSON.stringify(output)
            }
        ).then(console.log);
    };

    let resetButton = document.getElementById("reset-button");
    resetButton.onclick = () => {
        for(let config of document.getElementsByClassName("button-config")) {
            config.remove();
        }

        fetch(
            "/api/update",
            {
                method: "POST",
                body: "{}"
            }
        ).then(console.log);
    };

    
    let closeButton = document.getElementById("close-button");
    closeButton.onclick = () => {
        fetch("/shutdown");

        document.body.innerHTML = "<h1>Stream It! has been shut down. You may now close this window.</h1>";
    };

    // Load existing buttons on page load
    fetch(
        "/api/buttons",
        {
            method: "POST",
            body: ""
        }
    )
        .then(response => response.json())
        .then(data => {
            for(let key in data) {
                let value = data[key];
                createButton(key, value.name, value.color, value.width, value.data)
            }
        });
}