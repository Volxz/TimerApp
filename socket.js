const axios = require("axios");
const { v4: uuidv4 } = require('uuid');


const TimerHelper = require("./database/TimerHelper");
let notifications = new Map();

let timerHelper = new TimerHelper();

exports.init = (io) => {
    io.origins((origin, callback) => {
        callback(null, true);
    });

    io.on('connection', socket => {
        socket.emit('time-sync', new Date().getTime());

        timerHelper.getAllTimers().then((data)=>{
            socket.emit("timers", data);
        });

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
            io.emit("timer-remove", id);
            cancelNotification(id);
        });

        socket.on('get-time', () => {
            socket.emit('time-sync', new Date().getTime());
        });

        socket.on('create-timer', async data => {
            let timer = {
                id: uuidv4(),
                name: data.name,
                length: data.length,
                expires_at: data.expires_at,
            };
            timerHelper.createDocument(timer);
            io.emit("timer-update", timer);
        });

    })
};

function scheduleNotification(id, time) {
    cancelNotification(id);
    let job = setTimeout(() => {
        sendNotification(id);
    }, time - new Date().getTime());
    notifications.set(id, job)
}

function cancelNotification(id) {
    let notification = notifications.get(id);
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