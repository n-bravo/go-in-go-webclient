<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useRoomStore } from '@/stores/useRoomStore';
    import WebSocketService from "@/lib/ws";
    import * as createjs from 'createjs-module';

    const roomStore = useRoomStore();

    var stage: createjs.Stage;
    var points: Map<string, {style: string}> = new Map<string, {style: string}>();

    onMounted(() => {
        draw();
        WebSocketService.addListener((data) => {
            const payload = JSON.parse(data);
            if (payload.bStatus && payload.bStatus.length > 0) {
                roomStore.bStatus = payload.bStatus;
                updatePoints();
            }
        })
    })

    function draw(){
        stage = new createjs.Stage("boardCanvas");
        const h = (stage.canvas as HTMLCanvasElement).height;
        const w = (stage.canvas as HTMLCanvasElement).width;
        let background = new createjs.Shape();
        background.graphics.beginFill("#CEB170").drawRect(0, 0, h, w);
        stage.addChild(background);
        let lines = new createjs.Graphics();
        lines.setStrokeStyle(2, "square").beginStroke("black")
        let point, clickPoint;
        const gsp1 = roomStore.boardSize + 1;
        const gsp1f = roomStore.boardSize/gsp1;
        for (let i = 0; i < roomStore.boardSize; i++) {
            lines.moveTo(w/gsp1*(i+1), h/gsp1)
            lines.lineTo(w/gsp1*(i+1), h*gsp1f)
            lines.moveTo(w/gsp1, w/gsp1*(i+1))
            lines.lineTo(w*gsp1f, h/gsp1*(i+1))
        }
        stage.addChild(new createjs.Shape(lines))
        const stoneSize = 0.4*w/roomStore.boardSize;
        for (let i = 0; i < roomStore.boardSize; i++) {
            for (let j = 0; j < roomStore.boardSize; j++) {
                point = new createjs.Shape()
                points.set('' + i + j, point.graphics.beginFill("rgb(0, 0, 0, 0%)").command as {style: string});
                point.graphics.drawCircle(w/gsp1*(i+1), h/gsp1*(j+1), stoneSize);
                clickPoint = new createjs.Shape();
                clickPoint.graphics.beginFill("#000").drawCircle(w/gsp1*(i+1), h/gsp1*(j+1), stoneSize);
                point.hitArea = clickPoint;
                point.addEventListener("click", (_) => play(i, j));
                stage.addChild(point);
            }
        }
        if (roomStore.bStatus.length > 0) {
            updatePoints();
        } else {
            stage.update()
        }
    }

    function play(x: number, y: number) {
        WebSocketService.sendMessage({x: x, y: y, closeConn: false});
    }

    function updatePoints() {
        const status = roomStore.bStatus;
        for (let row = 0; row < roomStore.boardSize; row++) {
            for (let col = 0; col < roomStore.boardSize; col++) {
                setPointStatus(row, col, status.charAt(roomStore.boardSize * row + col))
            }
        }
        stage.update()
    }

    function setPointStatus(x: number, y: number, status: String) {
        if (points.has('' + x + y)) {
            if (status == "B") {
                points.get('' + x + y)!.style = "black";
            } else if (status == "W") {
                points.get('' + x + y)!.style = "white";
            } else {
                points.get('' + x + y)!.style = "rgb(0, 0, 0, 0%)";
            }
        }
    }

    function clear() {
        points.clear()
        if (stage != null) {
            stage.clear();
        }
    }

    defineExpose({
        clear
    })
</script>

<template>
    <div class="self-center">
        <canvas id="boardCanvas" width="700" height="700"></canvas>
    </div>
</template>
