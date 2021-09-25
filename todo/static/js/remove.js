let remove_forms = document.querySelectorAll('.remove-form');
let row_alarm = document.querySelectorAll('.row-alarm');

remove_forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let i = Number(form.getAttribute('data-index')) - 1;
        let url = form.getAttribute('data-url');
        let todo_id = Number(form.getAttribute('data-id'));

        let res = await removeFromDB(url, todo_id).then(res => {
            return true
        }).catch(e => {
            console.log(e)
            return false
        })

        if (res) {
            removeFromTable(i);
        }

    });
});

function removeFromTable(i) {
    row_alarm[i].remove();
}

function removeFromDB(url, todo_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            headers: { "X-CSRFToken": getCookie('csrftoken') },
            dataType: "json",
            type: "Delete",
            async: true,
            data: JSON.stringify({ 'id': todo_id }),
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
    });
}