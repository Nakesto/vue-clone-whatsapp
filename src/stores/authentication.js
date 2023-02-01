import { ref } from "vue";
import { defineStore } from "pinia";
import router from "../router";
import axiosInstance from "../axios";
import { useQuasar } from "quasar";

export const useAuthentication = defineStore("counter", () => {
  const isAuthenticate = ref(
    localStorage.getItem("token") != null ? true : false
  );
  const user = ref(
    localStorage.getItem("token") && localStorage.getItem("user")
      ? {
          token: localStorage.getItem("token"),
          user: JSON.parse(localStorage.getItem("user")),
        }
      : null
  );
  const isInitial = ref(true);
  const isLoading = ref(false);
  const error = ref();
  const $q = useQuasar();

  const login = async (username, password) => {
    isLoading.value = true;
    try {
      const result = await axiosInstance.post("/login", {
        username: username,
        password: password,
      });
      if (result.status === 200) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setTimeout(() => {
          user.value = {
            token: result.data.token,
            user: result.data.user,
          };
          isAuthenticate.value = true;
          router.replace("/");
        }, 500);
      }
    } catch (err) {
      isAuthenticate.value = false;
      $q.notify({
        type: "negative",
        message: "Username or Password not correct",
      });
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  };

  const register = async (userrname, password, photo) => {
    isLoading.value = true;
    let form = new FormData();
    form.append("username", userrname);
    form.append("password", password);
    form.append("photo", photo);
    try {
      const result = await axiosInstance.post("/register", form);
      if (result.status === 200) {
        setTimeout(() => {
          router.replace("/login");
        }, 500);
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: "Registration failed",
      });
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  };

  const cekToken = async () => {
    try {
      const result = await axiosInstance.get("/api/current", {
        headers: {
          Authorization: `Bearer ${user.value.token}`,
        },
      });

      if (result.status === 200) {
        isAuthenticate.value = true;
      }
    } catch (err) {
      isAuthenticate.value = false;
      logout();
    } finally {
      isInitial.value = false;
    }
  };

  const load = () => {
    isInitial.value = false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    isAuthenticate.value = false;
    router.replace("/login");
  };

  const changeProfile = (key, value) => {
    const temp = { ...user.value.user, [key]: value };
    user.value = {
      token: user.value.token,
      user: temp,
    };
    localStorage.setItem("user", JSON.stringify(temp));
  };

  return {
    isAuthenticate,
    error,
    isInitial,
    isLoading,
    user,
    cekToken,
    load,
    login,
    logout,
    register,
    changeProfile,
  };
});
