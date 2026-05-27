import { defineStore } from 'pinia'
import type {
  LoginResponse,
  AuthUser
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {

  state: () => ({

    accessToken: '',

    refreshToken: '',

    user: null as AuthUser | null,

    isAuthenticated: false
  }),

  actions: {

    setAuth(data: LoginResponse) {

      this.accessToken = data.accessToken

      this.refreshToken = data.refreshToken

      this.user = {
        userId: data.userId,
        role: data.role,
        panelUrl: data.panelUrl
      }

      this.isAuthenticated = true

      localStorage.setItem(
        'access_token',
        data.accessToken
      )

      localStorage.setItem(
        'refresh_token',
        data.refreshToken
      )

      localStorage.setItem(
        'auth_user',
        JSON.stringify(this.user)
      )
    },

    loadAuth() {

      const accessToken =
        localStorage.getItem('access_token')

      const refreshToken =
        localStorage.getItem('refresh_token')

      const user =
        localStorage.getItem('auth_user')

      if (
        accessToken &&
        refreshToken &&
        user
      ) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken

        this.user = JSON.parse(user)

        this.isAuthenticated = true
      }
    },

    clearAuth() {

      this.accessToken = ''

      this.refreshToken = ''

      this.user = null

      this.isAuthenticated = false

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_user')
    }
  }
})