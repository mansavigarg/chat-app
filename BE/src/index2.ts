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
        if(data.type === "join"){
            allSockets.push({
                socket,
                room: data.payload.roomId
            })
        }

        if(data.type === "chat"){
            const currentUserRoom = allSockets.find((x) => x.socket == socket)
            const roomMates = allSockets.filter((x) => x.room == currentUserRoom?.room)

            roomMates.forEach((mate) => {
                mate.socket.send(data.payload.message)
            })
        }
    })

    socket.on("disconnect" , () => {

    })
})