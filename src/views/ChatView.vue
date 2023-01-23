<template>
    <q-scroll-area style="height: calc(100%)" ref="container">
        <div class="q-pt-lg q-pl-lg q-pr-lg q-pb-sm">
            <div v-for="(chats, index) in groupMessage" :key="index">
                <q-chat-message
                    :label="'' + new Date(chats.date).getDate() + ' ' + monthNames[new Date(chats.date).getMonth()] + ' ' + new Date(chats.date).getFullYear()"></q-chat-message>
                <q-chat-message v-for="(chat, index) in chats.messages" :key="index"
                    :name="chat.SenderName === user.user.username ? 'Me' : chat.SenderName"
                    :avatar="chat.SenderName === user.user.username ? user.user.photoURL : receiver.Receiver.photoURL"
                    :text="[chat.message]" :sent="chat.SenderName === user.user.username"
                    :stamp="new Date(chat.sent_time).getHours() + ':' + new Date(chat.sent_time).getMinutes()"></q-chat-message>
            </div>
        </div>
    </q-scroll-area>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, toRefs, ref, computed, watch } from 'vue';
import axiosInstance from '../axios';
import { useAuthentication } from '../stores/authentication';

const props = defineProps({
    receiver: Object,
    newMessage: Object
});

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const { receiver, newMessage } = toRefs(props)
const auth = useAuthentication()
const { user } = storeToRefs(auth)
const messages = ref([])
const container = ref(null)

const getMessage = async () => {
    try {
        const result = await axiosInstance.get("/api/activechat?name=" + receiver.value.ReceiveName
            , {
                headers: {
                    'Authorization': `Bearer ${user.value.token}`,
                },
            })
        messages.value = result.data.chats
    } catch (err) {
        console.log(err)
    }
}

const groupMessage = computed(() => {
    if (messages.value.length > 0) {
        const groups = messages.value.reduce((groups, chat) => {
            const date = chat.sent_time.split('T')[0];
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
                messages: groups[date]
            };
        });

        return groupArrays
    }

    return []
})

watch(newMessage, () => {
    if (newMessage.value !== null) {
        const coba = messages.value
        coba.push(newMessage.value)
        messages.value = coba
    }
})

watch(groupMessage, () => {
    const scrollArea = container.value;
    const scrollTarget = scrollArea.getScrollTarget();
    const duration = 300; // ms - use 0 to instant scroll
    scrollArea.setScrollPosition("vertical", scrollTarget.scrollHeight + 50, duration);
})

onMounted(() => {
    getMessage()
})
</script>
<style>

</style>