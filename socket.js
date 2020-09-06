const axios = require("axios");
const schedule = require("node-schedule");

let timers = new Map();
let notifications = new Map();


exports.init = (io) => {
    io.origins((origin, callback) => {
        callback(null, true);
    });

    io.on('connection', socket => {
        socket.emit("timers", Array.from(timers))
        console.log("Client " + socket.id + " connected!")

        socket.on('reset-timer', timerName => {
            //let fifteen = new Date().getTime() + (10 * 1000);
            let fifteen = new Date().getTime() + (15 * 60 * 1000);
            timers.set(timerName, fifteen)
            scheduleNotification(timerName, fifteen);
            io.emit("timers", Array.from(timers))
        })

        socket.on('zero-timer', timerName => {
            timers.set(timerName, new Date().getTime())
            io.emit("timers", Array.from(timers))
            cancelNotification(timerName);
        })

        socket.on('delete-timer', timerName => {
            timers.delete(timerName);
            io.emit("timers", Array.from(timers))
            cancelNotification(timerName);
        })

    })

}

function scheduleNotification(name, time) {
    cancelNotification(name);
    let job = setTimeout(() => {
        sendNotification(name);
    }, time - new Date().getTime())
    notifications.set(name,job)
}

function cancelNotification(name) {
    let notification = notifications.get(name);
    if (notification && notification != null && notification !== undefined) {
        clearTimeout(notification)
    }
}

function sendNotification(name) {
    axios({
        method: 'post',
        url: process.env.PUSHER_URL,
        headers: {
            "Authorization": process.env.PUSHER_KEY,
            "Content-Type" : "application/json"
        },
        data: {
            "interests": ["timers"],
            "web":{
                "notification":{
                    "title": "Timer " + name + " Expired.",
                    "body": "Timer " + name + " has completed. Click here to view timer status."
                }
            }
        }
    })
}