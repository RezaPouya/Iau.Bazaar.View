import axios from 'axios'
import type { ApiResponse } from '~/types/api'
import type { LoginResponse } from '~/types/auth'

export default defineNuxtPlugin(() => {

  const config = useRuntimeConfig()

  const auth = useAuthStore()

  const api = axios.create({
    baseURL: config.public.apiBase
  })

  // Request interceptor
  api.interceptors.request.use((config) => {

    if (auth.accessToken) {

      config.headers.Authorization =
        `Bearer ${auth.accessToken}`
    }

    return config
  })

  // Response interceptor
  api.interceptors.response.use(

    response => response,

    async (error) => {

      const originalRequest = error.config

      // Token expired
      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {

        originalRequest._retry = true

        try {

          const response = await axios.post<
            ApiResponse<LoginResponse>
          >(
            `${config.public.apiBase}/account/sign-in-refresh-token`,
            {
              refreshToken: auth.refreshToken
            }
          )

          const data = response.data.data

          auth.setAuth(data)

          originalRequest.headers.Authorization =
            `Bearer ${data.accessToken}`

          return api(originalRequest)

        } catch {

          auth.clearAuth()

          return navigateTo('/login')
        }
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api
    }
  }
})