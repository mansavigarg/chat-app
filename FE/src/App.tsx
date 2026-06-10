import { useEffect, useState, useRef} from "react"



function App() {
    const [message, setMessage] = useState<string[]>(["Start messaging ......"])
    const wsRef = useRef<WebSocket | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")
        wsRef.current = ws
        ws.onopen = () => {
            console.log("WebSocket connection established")
            ws.send(JSON.stringify({type: "join", payload: {roomId: "red"}}))
        }
        ws.onmessage = (event) => {
            console.log("Message received from server: " + event.data)
            setMessage(m => [...m, String(event.data)])
        }
        ws.onclose = () => {
            console.log("WebSocket connection closed")
        }
    }, [])


  return (
    <div className=" h-screen bg-black flex flex-col">
        <div className="h-16 bg-gray-800 text-white flex items-center justify-center">
            Chat App
        </div>
        <div className="flex-1  items-center justify-center flex flex-col">
            <div className="text-4xl text-white">Welcome to the Chat App</div>
            <div className="text-2xl text-gray-400 mt-4">Please join a room to start chatting</div>
            <div className="text-2xl text-gray-400 mt-4">Or create a new room</div>
            <div className="mt-4">
                <input type="text" placeholder="Room Name" className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" />
                <button className="ml-4 px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700">Create Room</button>
            </div>
            <div className="mt-4">
                <input type="text" placeholder="Room Name" className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" />
                <button className="ml-4 px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700">Join Room</button>    
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            {message.map((msg, index) => (
                <div key={index} className="text-white mb-2">{msg}</div>
            ))}
        </div>
        <div className="h-16 bg-gray-800 text-white flex items-center justify-center px-4">
            <input ref={inputRef} type="text" placeholder="Type your message..." className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" />
            <button className="ml-4 px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700" onClick={() => {
                wsRef.current?.send(
                    JSON.stringify({
                        type: "chat", 
                        payload: {
                            message: inputRef.current?.value
                        }
                    })
                )
            }}>Send</button>
        </div>
    </div>
  )
}

export default App
