// Get Date of Today
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}

if (mm < 10) {
    mm = '0' + mm;
}
// Today's Date-Time
today = yyyy + '-' + mm + '-' + dd;

window.onload = () => {
    document.querySelectorAll(".datefield").forEach(field => {
        field.setAttribute("min", today + 'T00:00'); 
    });

    let checkboxes = document.querySelectorAll(".check-box");

    const handleChange = async (event) => {
        let innerRow = event.composedPath().filter(res => res.className === "inner-row")[0]
        let loader = innerRow.querySelector('.loader')

        event.target.classList.toggle('hidden', true)
        loader.classList.toggle('hidden', false)

        // Do Ajax
        let res = await updateDatabase(event.target).then((result) => {
            return result
        }).catch((err) => {
            return err
        });

        if (res) {
            let name = innerRow.querySelector('.name')
            name.classList.toggle('line-through')
        } else {
            event.target.checked = false
        }

        event.target.classList.toggle('hidden', false)
        loader.classList.toggle('hidden', true)

    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleChange);
    });

    const updateDatabase = (target) => {
        return new Promise((resolve, reject) => {
            let url = $(target).attr("data-url");
            let id = $(target).attr("data-id");
            $.ajax({
                url: url,
                headers: { "X-CSRFToken": getCookie('csrftoken') },
                dataType: "json",
                type: "Put",
                async: true,
                data: JSON.stringify({ 'id': id }),
                success: function (res) {
                    resolve(true)
                },
                error: function (xhr, exception) {
                    var msg = "";
                    if (xhr.status === 0) {
                        msg = "Not connect.\n Verify Network.";
                    } else if (xhr.status == 404) {
                        msg = "Requested page not found. [404]";
                    } else if (xhr.status == 500) {
                        msg = "Internal Server Error [500].";
                    } else if (exception === "parsererror") {
                        msg = "Requested JSON parse failed.";
                    } else if (exception === "timeout") {
                        msg = "Time out error.";
                    } else if (exception === "abort") {
                        msg = "Ajax request aborted.";
                    } else {
                        msg = "Error:" + xhr.status + " ";
                    }
                    console.log(msg)
                    reject(false)
                }
            });
        })
    }


    // Add Todo

    let row_add_btn = document.getElementById('row-add');
    let row_form = document.querySelector('.row-form');
    let form = document.getElementById('form');

    row_add_btn.addEventListener('click', () => {
        row_form.classList.toggle('hidden')
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(event.target)
        let data = {}
        for(let [name, value] of formData) {
            data = {...data, [name]:`${value}`} // have to close "data" in brackets So, that object with get the value from variable
        }
        new Promise((resolve, reject) => {
            let url = $(event.target).attr("data-url");
            $.ajax({
                url: url,
                headers: { "X-CSRFToken": getCookie('csrftoken') },
                dataType: "json",
                type: "Post",
                async: true,
                data: data,
                success: function (res) {
                    resolve(true)
                    location.reload()
                },
                error: function (xhr, exception) {
                    var msg = "";
                    if (xhr.status === 0) {
                        msg = "Not connect.\n Verify Network.";
                    } else if (xhr.status == 404) {
                        msg = "Requested page not found. [404]";
                    } else if (xhr.status == 500) {
                        msg = "Internal Server Error [500].";
                    } else if (exception === "parsererror") {
                        msg = "Requested JSON parse failed.";
                    } else if (exception === "timeout") {
                        msg = "Time out error.";
                    } else if (exception === "abort") {
                        msg = "Ajax request aborted.";
                    } else {
                        msg = "Error:" + xhr.status + " ";
                    }
                    console.log(xhr.status)
                    reject(false)
                }
            });
        })
    });
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}