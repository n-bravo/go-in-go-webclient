export function useSocket(ws_endpoint: string) {
    
    var socket: WebSocket; 
    var ready = false;

    function checkSockeet() {
        if (socket == null || socket.CLOSED) {
            socket = new WebSocket(ws_endpoint);

            socket.addEventListener("open", (_) => {
                ready = true;
            });

            socket.addEventListener("close", () => {
                ready = false;
            });

            socket.addEventListener("message", (event) => {
                parseServerMessage(event.data);
            })
        }
    }
    function send(json_payload) {
        if (ready) {
            socket.send(JSON.stringify(json_payload));
        } else {
            setTimeout(() => {
                send(json_payload);
            }, 5);
        }
    }

    
    
}
