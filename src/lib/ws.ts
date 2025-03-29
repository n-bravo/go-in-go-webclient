import {ws_endpoint} from "./constants";

class WebSocketService {
    static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private listeners: {(data: string):  void;}[] = [];

    constructor() {
        if (!WebSocketService.instance) {
            this.connect();
        }
        WebSocketService.instance = this; 
    }

    private connect() {
        this.listeners = [];
        this.socket = new WebSocket(ws_endpoint);
        this.socket.onmessage = (event) => {
            this.listeners.forEach((callback) => {
                callback(event.data);
            });
        }
    }

    sendMessage(message: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    addListener(callback: (event: any) => void) {
        this.listeners.push(callback);
    }

    setCloseListener(callback: () => void) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.onclose = () => {
                callback();
                this.connect()
            }
        }
    }

    //TODO: remove listener by ID?
}

export default new WebSocketService();
