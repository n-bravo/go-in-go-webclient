<script setup lang="ts">
    import ControlPanel from './ControlPanel.vue';
    import Board from './Board.vue';
</script>


<template>
    <div class="top-2 grid grid-cols-[20%_60%_20%]">
        <div></div>
        <div class="justify-self-center">
            <Board></Board>
        </div>
        <ControlPanel></ControlPanel>
    </div>
</template>
