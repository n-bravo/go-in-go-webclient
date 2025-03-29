<script setup lang="ts">
    import { onMounted } from "vue";
    import WebSocketService from "@/lib/ws";
    import { useRouter } from "vue-router";
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent
    } from "@/components/ui/card"
    import { Label } from "@/components/ui/label"
    import { Input } from "@/components/ui/input"
    import { Button } from "@/components/ui/button";
    import { useRoomStore } from "@/stores/useRoomStore";

    const router = useRouter()
    const roomId = defineModel('sessionId', {type: String, required: false});
    const roomStore = useRoomStore()

    onMounted(() => {
        WebSocketService.addListener((data) => {
            let payload = JSON.parse(data);
            if (payload.sessionId && payload.sessionId.length > 0) {
                roomStore.id = payload.sessionId;
                roomStore.blackSide = payload.blackSide;
                roomStore.online = payload.online;
                if (payload.bStatus && payload.bStatus.length > 0) {
                    roomStore.bStatus = payload.bStatus;
                }
                router.push("play");
            }
        })
    })

    function newMatch() {
        WebSocketService.sendMessage({sessionId: "", size: 5, online: true});
    }

    function joinMatch() {
        if (roomId.value !== undefined && roomId.value.length !== 0) {
            WebSocketService.sendMessage({sessionId: roomId.value.trim()});
        }
    }
</script>

<template>
    <div class="flex flex-row justify-center items-center h-full px-[30%] py-5">
        <Card class="w-full h-fit">
            <CardHeader>
                <CardTitle>Go in Go!</CardTitle>
            </CardHeader>
            <CardContent>
                    <div class="grid items-center w-full gap-4">
                        <div class="flex flex-row justify-center">
                            <Button class="w-full" @click="newMatch">New Match</Button>
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="room-id">Joining a match?</Label>
                            <div class="flex flex-row gap-1">
                                <Input id="room-id" placeholder="Room ID" v-model="roomId"</Input>
                                <Button @click="joinMatch">Join</Button>
                            </div>
                        </div>
                    </div>
            </CardContent>
        </Card>
    </div>
</template>
