<template>
    <q-page-container class="bg-grey-2 flex flex-center column" style="padding: 0;" :style="style">
        <div class="flex flex-center column no-wrap" style="width: 90%;" :style="style">
            <h2 class="text-weight-bold ijo">Whatsapp</h2>
            <img class="gambar q-mb-xl" src="../assets/begin.svg" alt="whatsapp">
            <q-form @submit.prevent="signIn" class="flex column responsive-box">
                <q-input color="teal" class="q-mb-lg" type="text" outlined v-model="username"
                    label="Username"></q-input>
                <q-input color="teal" class="q-mb-lg" type="password" outlined v-model="pass" label="Password"
                    autocomplete></q-input>
                <q-btn :loading="isLoading" type="submit" class="bg-hijau text-white text-weight-bold" push
                    label="Sign In"></q-btn>
                <div class="flex justify-between q-mt-md" style="width: 100%;">
                    <router-link class="text-overline ijo text-weight-bold" to="/register"
                        style="text-decoration: none;">Forgot
                        password?</router-link>
                    <router-link class="text-overline ijo text-weight-bold" to="/register"
                        style="text-decoration: none;">Sign
                        Up</router-link>
                </div>
            </q-form>
        </div>
    </q-page-container>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthentication } from '../stores/authentication';
import { useQuasar } from 'quasar'

const username = ref('')
const pass = ref('')
const auth = useAuthentication()
const { isLoading } = storeToRefs(auth)
const { login } = auth

const $q = useQuasar()

const style = computed(() => ({
    height: $q.screen.width <= 850 ? "100vh" : $q.screen.height - 40 + 'px'
}))

const signIn = () => {
    if (username.value == "" || pass.value == "") {
        return
    }

    login(username.value, pass.value)
}
</script>

<style scoped>
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

