import io from "socket.io-client";

const URL = "https://chess-backend-2022.herokuapp.com/";

const socket = io(URL);

socket.on("connect", () => {
    console.log("connected")
})

socket.emit("hello from client")

export {
    socket
}