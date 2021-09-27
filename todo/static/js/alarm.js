let alarms = document.querySelectorAll(".alarm-time");
let alarm_row = document.querySelectorAll(".row-alarm");

// Initialize the Alarm Audio
const alarmCtx = new AudioContext();
let source = null;
const ALARM_TIMEOUT = 50000; // timeout in ms

let buffer = ''
async function InitializeAlarm(alarmName = "", url = "/media/alarms/rooster-crowing.wav", index = "") {
    try {
        source.disconnect()
    } catch (error) {
        console.log('Alarm not Initialized')
    }

    source = alarmCtx.createBufferSource();
    buffer = await fetchAlarm(alarmCtx, url).then((result) => {
        return result
    }).catch((err) => {
        return err
    });
    source.buffer = buffer;
    source.loop = true;
    source.connect(alarmCtx.destination);
    console.log('Alarm Changed')

    if (alarmName) {
        setCookie("alarm", { 'alarmName': alarmName, 'url': url, 'index': index });
    }
}

// Checks If alarm is stored in cookie
const alarmCookie = JSON.parse(getCookie("alarm"));
if (alarmCookie) {
    document.getElementById("alarm-field").selectedIndex = alarmCookie.index;
    InitializeAlarm(alarmName = alarmCookie.name, url = alarmCookie.url, index = alarmCookie.index);
} else {
    InitializeAlarm();
}

document.getElementById('alarm-field').addEventListener('change', (event) => {
    selectedOption = event.target.options[event.target.selectedIndex];
    InitializeAlarm(alarmName = selectedOption.getAttribute('data-name'), url = event.target.value, index = selectedOption.index);
});


// Filter the to_be_alarmed elements
alarms_not_timed = filterAlarmNotTimed(alarms);

function filterAlarmNotTimed(alarms) {
    return Array.from(alarms).filter(elem => {
        let alarm_timestamp = elem.getAttribute('data-time')
        let timestamp = new Date().getTime() + Math.abs(new Date().getTimezoneOffset() * 60000)
        if (Math.floor(alarm_timestamp) < Math.floor(timestamp / 1000)) {
            elem.setAttribute('data-time', 'alarmed');
            return false
        }
        return true
    });
}

// Checks for alarming every second
let timeout;
setInterval(() => {
    alarms_not_timed.forEach((element, index) => {
        let timestamp = new Date().getTime();
        let alarm_timestamp = element.getAttribute('data-time')
        let todo_title = element.getAttribute('data-title')

        timestamp += Math.abs(new Date().getTimezoneOffset() * 60000) // this gets the difference between local TZ and UTC in ms
        console.log(
            Math.floor(alarm_timestamp), Math.floor(timestamp / 1000)
        )
        if (Math.floor(alarm_timestamp) === Math.floor(timestamp / 1000)) {
            console.log(`Alarm Time for ${element}`)
            source.start();
            let newNotification = createNotification("ARM (Times UP)!", `Hey, your todo: (${todo_title}) in timed up!`)
            // newNotification.onclose = ()=>{
            //     console.log("closed")
            //     source.stop();
            // };
            
            setAutoMute(source);
            element.setAttribute('data-time', 'alarmed')
            updateTimedAlarms();
        }
    })
}, 1000);

updateTimedAlarms()
function updateTimedAlarms() {
    alarms_timed = Array.from(alarms).filter(elem => {
        let alarm_timestamp = elem.getAttribute('data-time')
        return alarm_timestamp === "alarmed";
    })
    alarms_timed.forEach((element, index) => {
        try {
            updateTimed(alarm_row[index]); // in todo.js
        } catch (error) {
            
        }
        // alarm_row[index].classList.toggle('row-timed', true);
    });
    alarms_not_timed = filterAlarmNotTimed(alarms)
}

function setAutoMute(source) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        console.log('stoped');
        source.stop();
    }, ALARM_TIMEOUT);
}

function fetchAlarm(audioCtx, url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "arraybuffer";
        request.onload = async function () {
            let undecodedAudio = request.response;
            try {
                await audioCtx.decodeAudioData(undecodedAudio, (data) => {
                    buffer = data
                });
            } catch (error) {
                reject(error)
            }
            // console.log('Loaded New Alarm', buffer)
            resolve(buffer)
        };
        request.send();
        request.onerror = () => {
            reject(false)
        }
    });
}




document.querySelector("#notification-model .close-btn").addEventListener('click', (event) => {
    try {
        source.stop();
    } catch (e) {
        console.log('Alarm already closed.')
    }
    document.querySelector("#notification-model").classList.toggle("hidden", true);
})



function setCookie(name, value) {
    document.cookie = name + "=" + JSON.stringify(value) + "; path=/";
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