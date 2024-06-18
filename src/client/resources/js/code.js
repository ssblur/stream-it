function check() {
    fetch(
        "/api/code", 
        {
            method: "POST",
            body: "{}"
        }
    ).then(
        response => response.json()
    ).then(
        response => {
            if(response.approved)
                window.location.href = "/";
            else
                setTimeout(check, 2000);
        }
    );
}

check();