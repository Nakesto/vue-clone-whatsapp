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
        >Profile</q-toolbar-title
      >
    </q-toolbar>
    <div class="flex flex-center q-pa-lg">
      <div
        class="container"
        @click="pickFile"
        @mouseenter="active = !active"
        @mouseleave="active = !active"
      >
        <img
          :src="user.user.photoURL"
          :alt="user.user.username"
          style="
            width: 100%;
            height: 100%;
            border-radius: 100%;
            object-fit: cover;
            object-position: center;
          "
        />
        <div
          class="overlay flex column flex-center"
          :style="[active ? { display: 'flex' } : { display: 'none' }]"
        >
          <q-icon name="image" color="white" size="25px"></q-icon>
          <p class="text-white text-subtitle1 text-center">
            Add or change photo
          </p>
          <p class="text-white text-subtitle2 text-center">Click here</p>
        </div>
      </div>
    </div>
    <div class="q-px-lg">
      <p class="text-teal text-subtitle1 text-weight-medium">Your Name</p>
      <q-input
        :readonly="!userInput"
        :borderless="!userInput"
        v-model="username"
      >
        <template v-if="userInput" v-slot:append>
          <q-icon
            name="check"
            @click="userInput = false"
            class="cursor-pointer"
          />
        </template>
        <template v-else v-slot:after>
          <q-btn round dense flat icon="edit" @click="userInput = true" />
        </template>
      </q-input>
      <p class="text-grey text-subtitle1 text-weight-medium">
        This is your username. This name will be visible to your WhatsApp
        contacts.
      </p>

      <p class="text-teal text-subtitle1 text-weight-medium">Status</p>
      <q-input
        :readonly="!statusInput"
        :borderless="!statusInput"
        v-model="status"
      >
        <template v-if="statusInput" v-slot:append>
          <q-icon
            name="check"
            @click="statusInput = false"
            class="cursor-pointer"
          />
        </template>
        <template v-else v-slot:after>
          <q-btn round dense flat icon="edit" @click="statusInput = true" />
        </template>
      </q-input>
    </div>
    <q-file
      ref="fileRef"
      v-model="file"
      style="display: none"
      v-bind:max-files="1"
      accept="image/*"
      v-on:update:model-value="fileOnUpdate"
    />
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios";
import { useAuthentication } from "../stores/authentication";
const props = defineProps(["handleClose"]);
const drawer = ref(null);
const fileRef = ref();
const file = ref(null);
const userInput = ref(false);
const statusInput = ref(false);
const auth = useAuthentication();
const { user } = storeToRefs(auth);
const { changeProfile, logout } = auth;
const username = ref(user.value.user.username);
const status = ref();
const active = ref(false);

const pickFile = () => {
  fileRef.value.pickFiles();
};

const fileOnUpdate = async (selectedFile) => {
  const form = new FormData();
  form.append("photo", selectedFile);

  try {
    const result = await axiosInstance.put("/api/photoProfile", form, {
      headers: {
        Authorization: `Bearer ${user.value.token}`,
      },
    });
    changeProfile("photoURL", result.data.photoURL);
  } catch (err) {
    if (err.response.status === 401) {
      logout();
    }
    console.log(err);
  }
};
</script>
<style scoped>
.container {
  position: relative;
  width: 200px;
  height: 200px;
}
.overlay {
  background-color: rgb(0, 0, 0, 0.4);
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 100%;
  border-radius: 100%;
  cursor: pointer;
}

.hidden {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: none;
}
</style>
