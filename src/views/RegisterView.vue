<template>
  <q-page-container
    class="bg-grey-2 flex flex-center column"
    style="padding: 0"
    :style="style"
  >
    <div
      class="flex flex-center column no-wrap"
      style="width: 90%"
      :style="style"
    >
      <p class="text-weight-bold text-h2 ijo q-mb-xl test text-center">
        Whatsapp
      </p>
      <p class="text-weight-bold text-h5 ijo q-mb-lg text-center">
        Welcome, Create your whatsapp Account
      </p>
      <q-form @submit.prevent="signUp" class="flex column responsive-box">
        <q-input
          color="teal"
          class="q-mb-lg"
          type="text"
          outlined
          v-model="username"
          label="Username"
        ></q-input>
        <p class="text-red" v-if="!validation.isUsername">
          Username must be longer than 8 character and less than 16
        </p>
        <q-input
          color="teal"
          class="q-mb-lg"
          type="password"
          outlined
          v-model="pass"
          label="Password"
          autocomplete
        ></q-input>
        <p class="text-red" v-if="!validation.isPassword">
          Password must be longer than 8 character and less than 16
        </p>
        <div class="flex column flex-center">
          <div
            class="flex flex-center q-mb-md"
            style="
              width: 200px;
              height: 200px;
              border-style: solid;
              border-color: #009688;
            "
          >
            <img
              v-if="preview"
              style="object-fit: cover; width: 100%; height: 100%"
              :src="preview"
              alt="gambar"
            />
            <h5 class="q-pa-lg" v-else>No Picture</h5>
          </div>
          <q-file
            v-model="photo"
            label="Pick files"
            filled
            max-files="1"
            multiple
            style="max-width: 500px"
            color="teal"
            class="q-mb-lg"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <p class="text-red" v-if="!validation.isPhoto">
            Your extension or size file is not correct
          </p>
        </div>
        <q-btn
          :loading="isLoading"
          type="submit"
          class="bg-hijau text-white text-weight-bold"
          push
          label="Sign Up"
        ></q-btn>
        <div class="flex flex-center q-mt-md" style="width: 100%">
          <router-link
            class="text-overline ijo text-weight-bold"
            to="/login"
            style="text-decoration: none"
            >Already Have an Account?</router-link
          >
        </div>
      </q-form>
    </div>
  </q-page-container>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, ref, watch } from "vue";
import { useAuthentication } from "../stores/authentication";

const username = ref("");
const pass = ref("");
const validation = ref({
  isUsername: true,
  isPassword: true,
  isPhoto: true,
});
const photo = ref(null);
const preview = ref(null);
const auth = useAuthentication();
const { register } = auth;
const { isLoading } = storeToRefs(auth);

const $q = useQuasar();

const style = computed(() => ({
  height: $q.screen.width <= 850 ? "100vh" : $q.screen.height - 40 + "px",
}));

const signUp = () => {
  if (!username.value || !pass.value || !photo.value) {
    return;
  }

  register(username.value, pass.value, photo.value[0]);
};

watch(username, () => {
  if (username.value.length >= 8) {
    if (username.value.length > 16) {
      validation.value = { ...validation.value, isUsername: false };
    } else {
      validation.value = { ...validation.value, isUsername: true };
    }
  } else {
    validation.value = { ...validation.value, isUsername: false };
  }
});

watch(pass, () => {
  if (pass.value.length >= 8) {
    if (pass.value.length > 16) {
      validation.value = { ...validation.value, isPassword: false };
    } else {
      validation.value = { ...validation.value, isPassword: true };
    }
  } else {
    validation.value = { ...validation.value, isPassword: false };
  }
});

watch(photo, () => {
  let file = photo.value;
  if (file && file[0]) {
    if (file[0]["type"] !== "image/jpeg" && file[0]["type"] !== "image/png") {
      photo.value = null;
      validation.value = { ...validation.value, isPhoto: false };
      return;
    } else {
      validation.value = { ...validation.value, isPhoto: true };
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file[0]);
  }
});
</script>
<style scoped>
.test::before {
  background-image: url("/favicon.ico");
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  content: "";
}
.putih {
  width: 100%;
  height: 100%;
  background-color: white;
}

.gambar {
  width: 320px;
  height: 320px;
}

.responsive-box {
  width: 55%;
}

.ijo {
  color: #009688;
}

.bg-hijau {
  background-color: #009688;
}

@media (max-width: 850px) {
  .responsive-box {
    width: 65%;
  }
}

@media (max-width: 530px) {
  .responsive-box {
    width: 90%;
  }
}

@media (max-width: 400px) {
  .responsive-box {
    width: 100%;
  }
}

@media (max-height: 750px) {
  .gambar {
    width: 200px;
    height: 200px;
  }
}

@media (max-height: 650px) {
  .gambar {
    width: 150px;
    height: 150px;
  }
}
</style>
