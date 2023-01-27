import { defineStore } from "pinia";
import { ref } from "vue";

export const useChat = defineStore("chat", () => {
  const socket = ref(null);

  const setSocket = (token) => {
    socket.value = new WebSocket("ws://localhost:8080/api/ws?token=" + token);
  };

  return { socket, setSocket };
});
