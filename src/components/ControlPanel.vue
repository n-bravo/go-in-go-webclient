<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useRoomStore } from '@/stores/useRoomStore';
    import { storeToRefs } from 'pinia';
    import WebSocketService from "@/lib/ws"
    import { onMounted } from 'vue';

    const emit = defineEmits(['logout']);
    const roomStore = useRoomStore();
    const router = useRouter()

    const { id, online, blackSide } = storeToRefs(roomStore);

    onMounted(() => {
        WebSocketService.setCloseListener(() => {
            roomStore.$reset();
            router.replace("/");
        })
    })

    function copyIdToClipboard() {
        navigator.clipboard.writeText(id.value);
    } 

    function logout() {
        WebSocketService.sendMessage({closeConn: true})
    }

</script>

<template>
    <div class="flex flex-row justify-center">
        <div class="self-center">
            <div v-if="online">
                <span>Session {{id}}</span>
                <button @click="copyIdToClipboard">Copy</button>
                <span class="font-bold">{{ blackSide ? "Black" : "White"}} side</span>
            </div>
            <div v-else>
                <span>Offline Session</span>
            </div>
            <button @click="logout">Logout</button>
        </div>
    </div>
</template>
