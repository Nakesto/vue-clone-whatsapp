import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from "../router"
import axiosInstance from '../axios'

export const useAuthentication = defineStore('counter', () => {
    const isAuthenticate = ref(localStorage.getItem('token') != null ? true : false)
    const user = ref(localStorage.getItem('token') && localStorage.getItem('user') ? {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
    } : null
    )
    const isInitial = ref(true)
    const isLoading = ref(false)
    const error = ref()

    const login = async (username, password) => {
        isLoading.value = true
        try {
            const result = await axiosInstance.post("http://localhost:8080/login", {
                username: username,
                password: password
            })
            if (result.status === 200) {
                localStorage.setItem('token', result.data.token)
                localStorage.setItem('user', JSON.stringify(result.data.user))
                setTimeout(() => {
                    user.value = {
                        token: result.data.token,
                        user: result.data.user
                    }
                    isAuthenticate.value = true
                    router.push('/')
                }, 500)
            }
        } catch (err) {
            isAuthenticate.value = false
        } finally {
            setTimeout(() => {
                isLoading.value = false
            }, 500)
        }
    }

    const cekToken = async () => {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/current", {
                headers: {
                    'Authorization': `Bearer ${user.value.token}`,
                },
            })

            if (result.status === 200) {
                isAuthenticate.value = true
            }
        } catch (err) {
            isAuthenticate.value = false
            logout()
        } finally {
            isInitial.value = false
        }
    }

    const load = () => {
        isInitial.value = false
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        isAuthenticate.value = false
        router.push('/login')
    }

    return { isAuthenticate, error, isInitial, isLoading, user, cekToken, load, login, logout }
})

