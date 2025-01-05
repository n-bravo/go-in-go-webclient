<script setup lang="ts">
    import * as createjs from 'createjs-module';

    const gameSize = defineModel<number>('gameSize', {type: Number, required: true})
    const emit = defineEmits(['play'])

    var stage: createjs.Stage;
    var points: Map<string, {style: string}> = new Map<string, {style: string}>();

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
        for (let i = 0; i < gameSize.value; i++) {
            lines.moveTo(w/20*(i+1), h/20)
            lines.lineTo(w/20*(i+1), h*19/20)
            lines.moveTo(w/20, w/20*(i+1))
            lines.lineTo(w*19/20, h/20*(i+1))
        }
        stage.addChild(new createjs.Shape(lines))
        for (let i = 0; i < gameSize.value; i++) {
            for (let j = 0; j < gameSize.value; j++) {
                point = new createjs.Shape()
                points.set('' + i + j, point.graphics.beginFill("rgb(0, 0, 0, 0%)").command as {style: string});
                point.graphics.drawCircle(w/20*(i+1), h/20*(j+1), 15)
                clickPoint = new createjs.Shape()
                clickPoint.graphics.beginFill("#000").drawCircle(w/20*(i+1), h/20*(j+1), 15)
                point.hitArea = clickPoint
                point.addEventListener("click", (_) => play(i, j))
                stage.addChild(point)
            }
        }
        stage.update()
    }

    function play(x: number, y: number) {
        emit('play', x, y)
    }

    function update(status: String) {
        for (let row = 0; row < gameSize.value; row++) {
            for (let col = 0; col < gameSize.value; col++) {
                setPointStatus(row, col, status.charAt(gameSize.value * row + col))
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
        clear,
        update,
        draw
    })
</script>

<template>
    <div class="self-center">
        <canvas id="boardCanvas" width="700" height="700"></canvas>
    </div>
</template>
