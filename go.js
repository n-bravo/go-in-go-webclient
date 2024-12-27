const WS_ENDPOINT = "ws://localhost:3000"
var socket = null

var context = {
    socketReady: false,
    playing: false,
    onlineSession: false,
    sessionId: null,
    blackSide: true,
    gameSize: 19,
    canvasStage: null,
    points: {}
}

function setSocketReady(val) {
    context.socketReady = val
}

function setPlaying(val) {
    context.playing = val;
}

function setOnlineSession(val) {
    context.onlineSession = val
}

function setBlackSide(val) {
    context.blackSide = val
}

function clearBoard() {
    context.points = {}
    if (context.canvasStage != null) {
        context.canvasStage.clear();
        context.canvasStage = null;
    }
}

function copySessionId() {
    navigator.clipboard.writeText(context.sessionId);
}

function setSessionId(val) {
    context.sessionId = val
    if (context.onlineSession) {
        document.getElementById("session_id_span").innerText = `Match ID: ${val}`
    } else {
        document.getElementById("session_id_span").innerText = `Offline match`
    }
    if (context.blackSide) {
        document.getElementById("session_side_span").innerText = "Black Side"
    } else {
        document.getElementById("session_side_span").innerText = "White Side"
    }
    if (val !== null) {
        document.getElementById("join_controls").classList.replace("visible", "hidden");
        document.getElementById("session_controls").classList.replace("hidden", "visible");
    } else {
        document.getElementById("session_controls").classList.replace("visible", "hidden");
        document.getElementById("join_controls").classList.replace("hidden", "visible");
    }
}

function setPointStatus(x, y, status) {
    if (status == "B") {
        context.points['' + x + y].style = "black";
    } else if (status == "W") {
        context.points['' + x + y].style = "white";
    } else {
        context.points['' + x + y].style = "rgb(0, 0, 0, 0%)";
    }
}

function updateBoard(status) {
    for (let row = 0; row < context.gameSize; row++) {
        for (let col = 0; col < context.gameSize; col++) {
            setPointStatus(row, col, status.charAt(context.gameSize * row + col))
        }
    }
    context.canvasStage.update()
}

function checkSocket() {
    if (socket == null || socket.CLOSED) {
        socket = new WebSocket(WS_ENDPOINT);

        socket.addEventListener("open", (_) => {
            setSocketReady(true)
        });
        
        socket.addEventListener("close", () => {
            setSocketReady(false)
            setPlaying(false);
            setSessionId(null)
            clearBoard()
        });
        
        socket.addEventListener("message", (event) => {
            parseServerMessage(event.data);
        });
    }
}

function parseServerMessage(payload) {
    payload = JSON.parse(payload);
    if (payload.code) {
        checkResponseCode(payload.code, payload.message, payload.bStatus);
        return
    }
    if (payload.sessionId && payload.sessionId.length > 0) {
        //new or joined session message
        setOnlineSession(payload.online);
        setBlackSide(payload.blackSide);
        setSessionId(payload.sessionId);
        console.log(`Joined ${payload.online ? 'online' : 'offline'} session ${context.sessionId}`);
        drawBoard()
        if (payload.bStatus && payload.bStatus.length > 0) {
            updateBoard(payload.bStatus)
        }
        return
    }
}

function send(json_payload) {
    if (context.socketReady) {
        socket.send(JSON.stringify(json_payload));
    } else {
        setTimeout(() => {
            send(json_payload)
        }, 5);
    }
}


function checkResponseCode(code, message, board_status) {
    switch (code) {
        case 200:
            console.log("success")
            if (board_status != null && board_status.length > 0)
                updateBoard(board_status);
            break;
        case 401:
            console.error(message)
    }
}

function logout() {
    console.log(`logging out of session ${context.sessionId}`)
    send({CloseConn: true})
    socket.close();
}

function login() {
    checkSocket();
    var id = document.getElementById("session_id").value;
    if (id === null || id.length == 0) {
        createSession();
    } else {
        joinSession(id);
    }
}

function createSession() {
    var online = document.getElementById("session_online").checked;
    send({sessionId: "", size: 19, online: online})
}

function joinSession(id) {
    console.log("joining session", id.trim());
    send({sessionId: id.trim()});
}

function play(x, y) {
    send({x: x, y: y, closeConn: false})
}

function drawBoard(){
    let s = new createjs.Stage("canvas")
    context.canvasStage = s;
    const h = s.canvas.height;
    const w = s.canvas.width;
    let background = new createjs.Shape();
    background.graphics.beginFill("#CEB170").drawRect(0, 0, h, w);
    s.addChild(background);
    let lines = new createjs.Graphics();
    lines.setStrokeStyle(2, "square").beginStroke("black")
    let point, clickPoint;
    for (let i = 0; i < context.gameSize; i++) {
        lines.moveTo(w/20*(i+1), h/20)
        lines.lineTo(w/20*(i+1), h*19/20)
        lines.moveTo(w/20, w/20*(i+1))
        lines.lineTo(w*19/20, h/20*(i+1))
    }
    s.addChild(new createjs.Shape(lines))
    for (let i = 0; i < context.gameSize; i++) {
        for (let j = 0; j < context.gameSize; j++) {
            point = new createjs.Shape()
            context.points['' + i + j] = point.graphics.beginFill("rgb(0, 0, 0, 0%)").command
            point.graphics.drawCircle(w/20*(i+1), h/20*(j+1), 15)
            clickPoint = new createjs.Shape()
            clickPoint.graphics.beginFill("#000").drawCircle(w/20*(i+1), h/20*(j+1), 15)
            point.hitArea = clickPoint
            point.addEventListener("click", (_) => play(i, j))
            s.addChild(point)
        }
    }
    s.update()
}
