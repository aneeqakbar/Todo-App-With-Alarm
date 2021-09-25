askNotificationPerm();

document.getElementById('notify-btn').addEventListener('click',()=>{
    askNotificationPerm();
})

// Request for Permission
function askNotificationPerm() {

    function notifyBtnHandler(perm) {// we are recieving perm but not using it because its not sure that if the updated notification.permission or not.
        if (Notification.permission === "default" || Notification.permission === "denied") {
            document.getElementById('notify-btn').style.display = "block";
        } else {
            document.getElementById('notify-btn').style.display = "none";
        }
    }

    function checkNotificationPromise() {
        try {
            Notification.requestPermission().then();
        } catch (e) {
            return false
        }
        return true
    }

    if (!('Notification' in window)) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission().then((perm) => {
                notifyBtnHandler(perm); // we are giving in perm but not using it because its not sure that if we have recieved the updated notification or not.
            })
        } else {
            Notification.requestPermission((perm) => {
                notifyBtnHandler(perm);
            })
        }
    }
}

// Check Permission & Notify

let n = null;

function createNotification(title, text, icon = null) {
    if (n != null) {
        try {
            n.close();
        } catch (e) {
            console.log(e)
        }
    }
    n = new Notification(title, { body: text, icon: icon })

    let notification_model = document.querySelector("#notification-model");
    notification_model.querySelector(".notification-title").innerHTML = `${title}`;
    notification_model.querySelector(".description").innerHTML = `${text}`;
    notification_model.classList.toggle("hidden",false);

    setTimeout(()=>{
        autoClose(n);
    },15000)
    return n
}


// Close Notification

// document.addEventListener('visibilitychange', function () {
//     if (document.visibilityState === 'visible') {
//         // The tab has become visible so clear the now-stale Notification.
//         n.close();
//     }
// });

function autoClose(n) {
    try {
        n.close();
    } catch (e) { }
}