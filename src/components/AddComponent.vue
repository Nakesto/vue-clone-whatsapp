<template>
    <div class="transisi" style="height: calc(100%);" ref="drawer">
        <q-toolbar class="bg-teal"></q-toolbar>
        <q-toolbar class="bg-teal" style="padding-bottom: 23px;">
            <q-btn flat round dense icon="arrow_back" class="q-mr-sm text-white" @click="handleClose(drawer)"></q-btn>
            <q-toolbar-title class="text-white text-weight-bold text-h6">New Chat</q-toolbar-title>
        </q-toolbar>
        <q-toolbar class="bg-grey-2">
            <q-input rounded outlined dense class="WAL__field full-width" bg-color="white" v-model="search"
                placeholder="Search or start a new conversation">
                <template v-slot:prepend>
                    <q-icon name="search" />
                </template>
            </q-input>
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px); ">
            <q-list v-if="people.length > 0">
                <q-item v-for="(conversation, index) in people" :key="conversation.id" clickable v-ripple
                    @click="setCurrentConversation(index)">
                    <q-item-section avatar>
                        <q-avatar>
                            <img :src="conversation.photoURL">
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label lines="1">
                            {{ conversation.username }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-list v-else>
                <div class="flex flex-center" style="height: calc(100vh - 250px);">
                    Empty Chat
                </div>
            </q-list>
        </q-scroll-area>
    </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import axiosInstance from '../axios';
import { useAuthentication } from '../stores/authentication';

const props = defineProps(['handleClose'])

const drawer = ref(null)
const search = ref('')
const people = ref([])
const auth = useAuthentication()
const { user } = storeToRefs(auth)
// eslint-disable-next-line vue/no-setup-props-destructure
const { handleClose } = props
let searchTimeout

watch(search, () => {
    clearTimeout(searchTimeout);

    if (search.value !== '') {
        searchTimeout = setTimeout(async () => {

            try {
                const result = await axiosInstance.get("/api/friends?name=" + search.value, {
                    headers: {
                        'Authorization': `Bearer ${user.value.token}`,
                    },
                })
                console.log(result.data)
                people.value = result.data.users
            } catch (err) {
                console.log(err)
            }

        }, 1000)
    } else {
        people.value = []
    }
})

</script>
<style lang="">
    
</style>