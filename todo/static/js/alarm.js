let alarm_times = document.querySelectorAll(".alarm-time");

// Initialize the Alarm Audio
const alarmCtx = new AudioContext();
let source = null;

let buffer = ''
async function InitializeAlarm(alarmName = "", url = "/media/alarms/mixkit-short-rooster-crowing-2470.wav", index="") {
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
alarm_times = Array.from(alarm_times).filter(elem => {
    let alarm_timestamp = elem.getAttribute('data-time')
    let timestamp = new Date().getTime() + Math.abs(new Date().getTimezoneOffset() * 60000)
    return Math.floor(alarm_timestamp) > Math.floor(timestamp / 1000)
})

// Checks for alarming every second
setInterval(() => {
    alarm_times.forEach(element => {
        let timestamp = new Date().getTime();
        let alarm_timestamp = element.getAttribute('data-time')

        timestamp += Math.abs(new Date().getTimezoneOffset() * 60000) // this gets the difference between local TZ and UTC in ms

        if (Math.floor(alarm_timestamp) === Math.floor(timestamp / 1000)) {
            console.log(`Alarm Time for ${element}`)
            source.loop = true;
            source.start();
            element.setAttribute('data-time', 'alarmed')
        }
    })
}, 1000);



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