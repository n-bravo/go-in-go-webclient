<script setup lang="ts">

    import { ref } from 'vue';
    import ControlPanel from './ControlPanel.vue';
    import Board from './Board.vue';
    import {ws_endpoint} from './constants.ts';
    
    var socket: WebSocket;
    var socketReady = false;

    const gameboard = ref<null | InstanceType<typeof Board>>(null);

    const playing = ref(false);
    const sessionId = ref('');
    const online = ref(true);
    const blackSide = ref(false);
    const gameSize = 5;

    function checkSocket() {
        if (socket == null || socket.CLOSED) {
            socket = new WebSocket(ws_endpoint);

            socket.addEventListener("open", (_) => {
                socketReady = true;
            });
            
            socket.addEventListener("close", () => {
                socketReady = false
                playing.value = false;
                sessionId.value = '';
                gameboard.value!.clear();
            });
            
            socket.addEventListener("message", (event) => {
                parseServerMessage(event.data);
            });

            socket.addEventListener("pong", () => {console.log("Socket alive")})
        }
    }

    function parseServerMessage(data: string) {
        let payload = JSON.parse(data);
        if (payload.code) {
            checkResponseCode(payload.code, payload.message, payload.bStatus);
        }
        if (payload.sessionId && payload.sessionId.length > 0) {
            online.value = payload.online; 
            blackSide.value = payload.blackSide;
            sessionId.value = payload.sessionId;
            playing.value = true;
            console.log(`Joined ${payload.online ? 'online' : 'offline'} session ${sessionId.value}`);
            gameboard.value!.draw();
            if (payload.bStatus && payload.bStatus.length > 0) {
                gameboard.value!.update(payload.bStatus);
            }
            return;
        }
    }
    
    function checkResponseCode(code: number, message: string, board_status: string | null) {
        switch (code) {
            case 200:
                console.log('success');
                if (board_status != null && board_status.length > 0) {
                    gameboard.value!.update(board_status);
                }
                break;
            case 401:
                console.error(message);
                break;
        }
    }

    function login() {
        checkSocket();
        if (sessionId.value === null || sessionId.value.length === 0) {
            console.log("Creating new session");
            send({sessionId: "", size: gameSize, online: online.value});
        } else {
            console.log("Joining session", sessionId.value.trim());
            send({sessionId: sessionId.value.trim()});
        }
    }

    function logout() {
        console.log(`Logging out of session ${sessionId.value}`);
        send({closeConn: true});
        socket.close();
    }

    function play(x: number, y: number) {
        send({x: x, y: y, closeConn: false})
    }

    function send(json_payload: object) {
        if (socketReady) {
            socket.send(JSON.stringify(json_payload));
        } else {
            setTimeout(() => {
                send(json_payload);
            }, 5);
        }
    }
</script>


<template>
    <div class="top-2 flex flex-col">
        <ControlPanel v-model:session-id="sessionId" v-model:online="online" v-model:playing="playing" v-model:black-side="blackSide" @login="login" @logout="logout"></ControlPanel>
        <Board ref="gameboard" v-model:game-size="gameSize" @play="play"></Board>
    </div>
</template>
