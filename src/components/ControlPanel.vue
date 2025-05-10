<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useRoomStore } from '@/stores/useRoomStore';
    import { storeToRefs } from 'pinia';
    import WebSocketService from "@/lib/ws"
    import { onMounted } from 'vue';
    import { Copy, Circle } from 'lucide-vue-next';
    import { Button } from '@/components/ui/button';

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
    <div class="flex flex-col w-full gap-3 py-4 pr-2">
            <div v-if="online">
                <div class="flex flex-col">
                    <span><b>Session ID</b></span>
                    <div class="flex flex-row align-middle">
                        <span class="text-xs">{{id}}</span>
                        <button @click="copyIdToClipboard"><Copy :size="20"></Copy></button>
                    </div>
                </div>
                <div class="flex flex-row gap-1">
                    <Circle v-if="blackSide" fill='black'></Circle>
                    <Circle v-else fill='white'></Circle>
                    <span class="font-bold">{{ blackSide ? "Black" : "White"}} side</span>
                </div>
            </div>
            <div v-else>
                <span>Offline Session</span>
            </div>
            <Button @click="logout">Logout</button>
    </div>
</template>
