import { ref } from "vue";
import { defineStore } from "pinia";

export const useRoomStore = defineStore("room", () => {
    const id = ref("")
    const online = ref(false)
    const blackSide = ref(false)
    const boardSize = ref(5)
    const bStatus = ref("")

    function $reset() {
        id.value = ""
        online.value = false
        blackSide.value = false
        boardSize.value = 5 
        bStatus.value = ""
    }

    return {id, online, blackSide, boardSize, bStatus, $reset}
})
