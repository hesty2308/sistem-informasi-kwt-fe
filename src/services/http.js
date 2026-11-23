import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
})

let isRefreshingCsrf = false
let pendingCsrfQueue = []

const processCsrfQueue = (error = null) => {
  pendingCsrfQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else {
      resolve(http(config))
    }
  })
  pendingCsrfQueue = []
}

// Request Interceptor
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject({
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        originalError: error,
      })
    }

    const { status, data } = error.response

    // 401 Unauthorized: Session invalid / expired
    if (status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    // 419 CSRF Token mismatch / expired: refresh CSRF cookie and retry once
    if (status === 419 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshingCsrf) {
        return new Promise((resolve, reject) => {
          pendingCsrfQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      isRefreshingCsrf = true

      try {
        await axios.get('/sanctum/csrf-cookie', {
          withCredentials: true,
          withXSRFToken: true,
        })
        isRefreshingCsrf = false
        processCsrfQueue(null)
        return http(originalRequest)
      } catch (csrfError) {
        isRefreshingCsrf = false
        processCsrfQueue(csrfError)
        return Promise.reject(csrfError)
      }
    }

    // 422 Unprocessable Content: Validation errors
    if (status === 422) {
      return Promise.reject({
        status: 422,
        message: data?.message || 'Data yang dikirim tidak valid.',
        errors: data?.errors || {},
      })
    }

    // 429 Too Many Requests: Rate limited
    if (status === 429) {
      return Promise.reject({
        status: 429,
        message: data?.message || 'Terlalu banyak percobaan. Harap tunggu beberapa saat.',
        errors: null,
      })
    }

    return Promise.reject(error)
  }
)

export default http
