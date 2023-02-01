<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout
      view="lHr lpr lFr"
      class="WAL__layout shadow-3"
      container
      v-if="!isInitial"
    >
      <router-view></router-view>
    </q-layout>
    <div
      v-else
      class="flex flex-center column"
      style="height: 100vh; background-color: rgb(0, 0, 0, 0.1)"
    >
      <q-spinner color="teal" size="3em"></q-spinner>
      <p class="q-mt-lg text-bold text-overline">Please Wait...</p>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { useAuthentication } from "./stores/authentication";
import { useQuasar } from "quasar";

const user = useAuthentication();
const { isInitial, isAuthenticate } = storeToRefs(user);
const { load, cekToken } = user;
const $q = useQuasar();

const style = computed(() => ({
  height: $q.screen.height + "px",
}));

onMounted(() => {
  if (!isAuthenticate.value) {
    load();
  } else {
    cekToken();
  }
});
</script>
<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    background-color: #009688
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 1600px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none

.full
  height: 100vh

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
