import io from "socket.io-client";

const URL = "http://localhost:3000/";

const socket = io(URL);

socket.on("connect", () => {
    console.log("connected")
})

socket.emit("hello from client")

export {
    socket
}