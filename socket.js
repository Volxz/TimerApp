const axios = require("axios");
const schedule = require("node-schedule");
const TimerHelper = require("./database/timer");
let notifications = new Map();

let timerHelper = new TimerHelper();

exports.init = (io) => {
    io.origins((origin, callback) => {
        callback(null, true);
    });

    io.on('connection', socket => {
        socket.emit("timers", Array.from(timers));
        socket.emit('time-sync', new Date().getTime());

        socket.on('reset-timer', async id => {
            const timer = await timerHelper.getByID(id);
            if(!timer)
                return;
            timer.expires_at = await new Date().getTime() + ( timer.length * 1000);
            timerHelper.update(timer);
            scheduleNotification(timer.id, timer.expires_at);

            io.emit("timer-update", timer)
        });

        socket.on('zero-timer', async id => {
            const timer = await timerHelper.getByID(id);
            if(!timer)
                return;

            timer.expires_at = null;
            timerHelper.update(timer);
            cancelNotification(timer.name);
            io.emit("timer-update", timer);
        });

        socket.on('delete-timer', id => {
            timerHelper.delete(id);
            io.emit("delete-timer", id);
            cancelNotification(timerName);
        });

        socket.on('get-time', () => {
            socket.emit('time-sync', new Date().getTime());
        })
    })

};

function scheduleNotification(name, time) {
    cancelNotification(name);
    let job = setTimeout(() => {
        sendNotification(name);
    }, time - new Date().getTime());
    notifications.set(name, job)
}

function cancelNotification(name) {
    let notification = notifications.get(name);
    if (notification) {
        clearTimeout(notification)
    }
}

async function sendNotification(id) {
    const timer = await timerHelper.getByID(id);
    if(!timer)
        return;
    axios({
        method: 'post',
        url: process.env.PUSHER_URL,
        headers: {
            "Authorization": process.env.PUSHER_KEY,
            "Content-Type": "application/json"
        },
        data: {
            "interests": ["timers"],
            "web": {
                "notification": {
                    "title": "Timer " + timer.name + " Expired.",
                    "body": "Timer " + timer.name + " has completed. Click here to view timer status.",
                    "deep_link": "https://edctimer.azurewebsites.net/"
                }
            }
        }
    })
}