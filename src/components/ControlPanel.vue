<script setup lang="ts">
    const emit = defineEmits(['login', 'logout']);

    const sessionId = defineModel('sessionId', {type: String, required: true});
    const online = defineModel('online', {type: Boolean, required: true});
    const playing = defineModel('playing', {type: Boolean, required: true});
    const blackSide = defineModel('blackSide', {type: Boolean, required: true});

    function copyIdToClipboard() {
        navigator.clipboard.writeText(sessionId.value);
    }

</script>

<template>
    <div class="flex flex-row justify-center">
        <div v-if="!playing">
            <input type="text" placeholder="Match ID" size="40" v-model="sessionId">
            <input type="checkbox" name="Online" v-model="online"/>
            <button @click="$emit('login')">Play!</button>
        </div>
        <div v-else class="self-center">
            <div v-if="online">
                <span>Session {{sessionId}}</span>
                <button @click="copyIdToClipboard">Copy</button>
                <span class="font-bold">{{ blackSide ? "Black" : "White"}} side</span>
            </div>
            <div v-else>
                <span>Offline Session</span>
            </div>
            <button @click="$emit('logout')">Logout</button>
        </div>
    </div>
</template>
