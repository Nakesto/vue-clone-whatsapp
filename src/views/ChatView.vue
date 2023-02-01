<template>
  <q-scroll-area style="height: calc(100%)" ref="container">
    <div class="q-pt-lg q-pl-lg q-pr-lg q-pb-sm">
      <div v-for="(chats, index) in groupMessage" :key="index">
        <q-chat-message
          :label="
            '' +
            new Date(chats.date).getDate() +
            ' ' +
            monthNames[new Date(chats.date).getMonth()] +
            ' ' +
            new Date(chats.date).getFullYear()
          "
        ></q-chat-message>
        <q-chat-message
          :id="chats.date + 'chat' + index"
          v-for="(chat, index) in chats.messages"
          :key="index"
          :name="
            chat.SenderName === user.user.username ? 'Me' : chat.SenderName
          "
          :avatar="
            chat.SenderName === user.user.username
              ? user.user.photoURL
              : receiver.Receiver.photoURL
          "
          :text="[chat.message]"
          :sent="chat.SenderName === user.user.username"
          :stamp="
            new Date(chat.sent_time).toLocaleTimeString('en-US', {
              hour12: false,
              hour: 'numeric',
              minute: 'numeric',
            })
          "
        ></q-chat-message>
      </div>
    </div>
  </q-scroll-area>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { watchEffect, toRefs, ref, computed, watch } from "vue";
import axiosInstance from "../axios";
import { useAuthentication } from "../stores/authentication";
import { useChat } from "../stores/chat";

const props = defineProps({
  receiver: Object,
  newMessage: Object,
});

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const { receiver, newMessage } = toRefs(props);
const auth = useAuthentication();
const chat = useChat();

const { user } = storeToRefs(auth);
const { setMessages } = chat;
const { groupMessage, messages } = storeToRefs(chat);
const container = ref(null);

const getMessage = async () => {
  try {
    const result = await axiosInstance.get(
      "/api/activechat?name=" + receiver.value.ReceiveName,
      {
        headers: {
          Authorization: `Bearer ${user.value.token}`,
        },
      }
    );
    setMessages(result.data.chats);
  } catch (err) {
    if (err.response.status === 401) {
      logout();
    }
  }
};

watch(newMessage, () => {
  if (newMessage.value !== null) {
    const coba = messages.value;
    coba.push(newMessage.value);
    setMessages(coba);
  }
});

watch(groupMessage, () => {
  const scrollArea = container.value;
  const scrollTarget = scrollArea.getScrollTarget();
  const duration = 300; // ms - use 0 to instant scroll
  scrollArea.setScrollPosition(
    "vertical",
    scrollTarget.scrollHeight + 50,
    duration
  );
});

watchEffect(() => {
  if (receiver.value) {
    getMessage();
  }
});
</script>
<style></style>
