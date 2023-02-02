<template>
  <div class="transisi" style="height: calc(100%)" ref="drawer">
    <q-toolbar class="bg-teal"></q-toolbar>
    <q-toolbar class="bg-teal" style="padding-bottom: 23px">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        class="q-mr-sm text-white"
        @click="handleClose(drawer)"
      ></q-btn>
      <q-toolbar-title class="text-white text-weight-bold text-h6"
        >New Chat</q-toolbar-title
      >
    </q-toolbar>
    <q-toolbar class="bg-grey-2">
      <q-input
        rounded
        outlined
        dense
        class="WAL__field full-width"
        bg-color="white"
        v-model="search"
        placeholder="Search or start a new conversation"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <q-scroll-area style="height: calc(100% - 157px)">
      <q-list v-if="people.length > 0">
        <div
          v-for="(conversation, index) in people"
          :key="conversation.id"
          class="flex column flex-center"
          style="height: calc(100vh - 250px)"
        >
          <q-avatar>
            <img :src="conversation.photoURL" />
          </q-avatar>

          <p class="text-h5">{{ conversation.username }}</p>

          <q-btn
            v-if="isFriends"
            color="teal"
            @click="handleChat(conversation.username, drawer)"
            >Chat</q-btn
          >
          <q-btn
            v-else-if="conversation.username === user.user.username"
            color="teal"
            @click="handleToProfile"
            >Profile</q-btn
          >
          <q-btn v-else color="teal" @click="handleAdd">Add</q-btn>
        </div>
      </q-list>
      <q-list v-else>
        <div
          class="flex flex-center text-h5"
          style="height: calc(100vh - 250px)"
        >
          User Not Found
        </div>
      </q-list>
    </q-scroll-area>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref, watch, computed, toRefs } from "vue";
import axiosInstance from "../axios";
import { useAuthentication } from "../stores/authentication";

const props = defineProps([
  "handleClose",
  "chatroom",
  "handleChat",
  "addRoom",
  "toProfile",
]);
const { chatroom } = toRefs(props);
const drawer = ref(null);
const search = ref("");
const people = ref([]);
const isFriends = computed(() => {
  let friend = people.value;
  if (friend.length > 0) {
    let flag = false;
    chatroom.value.forEach((e) => {
      if (e.ReceiveName == friend[0].username) {
        flag = true;
      }
    });
    return flag;
  } else {
    return false;
  }
});

const auth = useAuthentication();
const { user } = storeToRefs(auth);
const { logout } = auth;

// eslint-disable-next-line vue/no-setup-props-destructure
const { handleClose } = props;
let searchTimeout;

const handleAdd = async () => {
  try {
    const result = await axiosInstance.post(
      "/api/addchatroom",
      {
        sender: user.value.user.username,
        receiver: people.value[0].username,
      },
      {
        headers: {
          Authorization: `Bearer ${user.value.token}`,
        },
      }
    );

    props.addRoom({
      ...result.data.chatroom,
      Receiver: {
        username: people.value[0].username,
        photoURL: people.value[0].photoURL,
      },
    });
    handleClose(drawer.value);
  } catch (err) {
    if (err.response.status === 401) {
      logout();
    }
  }
};

const handleToProfile = () => {
  props.toProfile(drawer.value);
};

watch(search, () => {
  clearTimeout(searchTimeout);

  if (search.value !== "") {
    searchTimeout = setTimeout(async () => {
      try {
        const result = await axiosInstance.get(
          "/api/friends?name=" + search.value,
          {
            headers: {
              Authorization: `Bearer ${user.value.token}`,
            },
          }
        );
        people.value = [result.data.users];
      } catch (err) {
        people.value = [];
        if (err.response.status === 401) {
          logout();
        }
      }
    }, 1000);
  } else {
    people.value = [];
  }
});
</script>
<style lang=""></style>
