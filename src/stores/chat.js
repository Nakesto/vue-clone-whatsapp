import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useChat = defineStore("chat", () => {
  const socket = ref(null);
  const messages = ref([]);
  const groupMessage = computed(() => {
    if (messages.value.length > 0) {
      const groups = messages.value.reduce((groups, chat) => {
        const date = chat.sent_time.split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(chat);
        return groups;
      }, {});

      // Edit: to add it in the array format instead
      const groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          messages: groups[date],
        };
      });

      return groupArrays;
    }

    return [];
  });

  const setSocket = (token) => {
    socket.value = new WebSocket(
      `ws://${import.meta.env.VITE_BACKEND_URL}/api/ws?token=` + token
    );
  };

  const setMessages = (chats) => {
    messages.value = chats;
  };

  return { socket, messages, groupMessage, setSocket, setMessages };
});
