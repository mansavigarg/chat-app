// ------ Braodcasting message logic -----------

// import { WebSocketServer, WebSocket } from "ws";

// const wss = new WebSocketServer({ port: 8080 })

// let userCount = 0;
// let allSocket: WebSocket[] = [];

// wss.on("connection", (socket) => {
//     allSocket.push(socket)
//     userCount++;
//     console.log("user connected --- #" + userCount)


//     socket.on("message", (message) => {
//         console.log("Message received --->> " + message.toString())
//         allSocket.forEach((socket) => socket.send("Here is the message that is sent from the server -->> " + message.toString()))
//     })

//     socket.on("disconnect", () => {
//         allSocket = allSocket.filter( x => x != socket)
//     })
// })



// --------- Chat app with roomId ------- using optimal way to store allSockets
// import { WebSocketServer, WebSocket } from "ws";

// const wss = new WebSocketServer({ port: 8080 })


// let allSockets: Map<string, Set<WebSocket>> = new Map()

// wss.on("connection", (socket) => {
//     socket.on("message", (message) => {
//         const data = JSON.parse(message.toString())
//         const { type, payload } = data

//         if(type === "join") {
//             const { room } = payload
//             if (!allSockets.has(room)) {
//                 allSockets.set(room, new Set())
//             }
//             allSockets.get(room)!.add(socket)
//         }

//         if(type === "chat") {
//             const { room, message } = payload
//             const roomSockets = allSockets.get(room)
//             if(roomSockets) {
//                 roomSockets.forEach((roomSocket) => {
//                     roomSocket.send(message)
//                 })
//             }
//         }
//     })

//     socket.on("disconnect" , () => {
//         allSockets.forEach((sockets, room) => {
//             sockets.delete(socket)
//             if (sockets.size === 0) {
//                 allSockets.delete(room)
//             }
//         })
//     })
// })



// --------- Chat app with roomId ------- using not-so-optimal way to store allSockets
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 })

interface User {
    socket: WebSocket,
    room: string
}
let allSockets: User[] = []

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const data = JSON.parse(message.toString())
        console.log("User data is received: " + data)
        if(data.type === "join"){

            allSockets.push({
                socket,
                room: data.payload.roomId
            })
        }

        if(data.type === "chat"){
            console.log("user wants to chat")
            const currentUserRoom = allSockets.find((x) => x.socket == socket)
            console.log("Current user roomid is: " + currentUserRoom)
            const roomMates = allSockets.filter((x) => x.room == currentUserRoom?.room)
            console.log("Current user roommates are: " + roomMates)

            roomMates.forEach((mate) => {
                mate.socket.send(data.payload.message)
            })
        }
    })

    socket.on("disconnect" , () => {

    })
})
