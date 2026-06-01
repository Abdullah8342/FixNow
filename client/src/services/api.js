const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export const API_ENDPOINTS = {
  auth: {
    register: '/account/',
    login: '/account/api/token/',
    logout: '/account/api/token/blacklist/',
    forgotPassword: '/account/api/password-forget/',
    verifyOtp: '/account/api/verify-otp/',
    resetPassword: '/account/api/password-reset/',
    contactUs: '/account/api/contact-us/',
  },
  profile: {
    root: '/profile/',
  },
}

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`

export const resolveMediaUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})

export { API_BASE_URL }

// API Client Class
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    return localStorage.getItem('access_token')
  }

  getBaseUrl() {
    return this.baseURL
  }

  async apiRequest(path, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      auth = true,
      multipart = false,
    } = options

    const url = `${this.baseURL}${path}`
    const requestHeaders = {
      ...headers,
    }

    if (auth) {
      const token = this.getToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    let bodyData = body
    if (body && !multipart) {
      requestHeaders['Content-Type'] = 'application/json'
      bodyData = JSON.stringify(body)
    } else if (multipart && body && typeof body === 'object' && !(body instanceof FormData)) {
      const formData = new FormData()
      Object.keys(body).forEach((key) => {
        formData.append(key, body[key])
      })
      bodyData = formData
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: bodyData,
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: 'An error occurred' }
      }
      const error = new Error()
      error.status = response.status
      error.payload = errorData
      throw error
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    return null
  }

  // Profile API
  profile = {
    current: () => this.apiRequest('/profile/', { method: 'GET' }),
    provider: (userId) =>
      this.apiRequest(`/profile/provider/${userId}/`, {
        method: 'GET',
        auth: false,
      }),
    update: (data) =>
      this.apiRequest('/profile/', {
        method: 'PATCH',
        body: data,
        multipart: true,
      }),
  }

  // Account/Auth API
  account = {
    token: () => undefined,
    signup: (data) =>
      this.apiRequest('/account/', {
        method: 'POST',
        body: data,
      }),
    contactUs: (data) =>
      this.apiRequest('/account/api/contact-us/', {
        method: 'POST',
        body: data,
        auth: false,
      }),
  }

  // Service API
  service = {
    list: () => this.apiRequest('/service/'),
    create: (data) =>
      this.apiRequest('/service/', {
        method: 'POST',
        body: data,
        multipart: data instanceof FormData,
      }),
    retrieve: (id) => this.apiRequest(`/service/${id}/`),
    patch: (id, data) =>
      this.apiRequest(`/service/${id}/`, {
        method: 'PATCH',
        body: data,
        multipart: data instanceof FormData,
      }),
    put: (id, data) =>
      this.apiRequest(`/service/${id}/`, {
        method: 'PUT',
        body: data,
        multipart: data instanceof FormData,
      }),
    delete: (id) =>
      this.apiRequest(`/service/${id}/`, {
        method: 'DELETE',
      }),
  }

  // Helper API (Locations and Helper Services)
  helper = {
    locationList: () => this.apiRequest('/helper/location/'),
    locationCreate: (data) =>
      this.apiRequest('/helper/location/', {
        method: 'POST',
        body: data,
      }),
    locationRetrieve: (id) => this.apiRequest(`/helper/location/${id}/`),
    locationPatch: (id, data) =>
      this.apiRequest(`/helper/location/${id}/`, {
        method: 'PATCH',
        body: data,
      }),
    locationDelete: (id) =>
      this.apiRequest(`/helper/location/${id}/`, {
        method: 'DELETE',
      }),

    helperServiceList: () => this.apiRequest('/helper/helperservice/'),
    helperServiceCreate: (data) =>
      this.apiRequest('/helper/helperservice/', {
        method: 'POST',
        body: data,
      }),
    helperServiceRetrieve: (id) =>
      this.apiRequest(`/helper/helperservice/${id}/`),
    helperServicePatch: (id, data) =>
      this.apiRequest(`/helper/helperservice/${id}/`, {
        method: 'PATCH',
        body: data,
      }),
    helperServiceDelete: (id) =>
      this.apiRequest(`/helper/helperservice/${id}/`, {
        method: 'DELETE',
      }),
  }

  // Booking API
  booking = {
    list: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      const path = queryString ? `/booking/api/?${queryString}` : '/booking/api/'
      return this.apiRequest(path)
    },
    create: (data) =>
      this.apiRequest('/booking/api/', {
        method: 'POST',
        body: data,
      }),
    retrieve: (id) => this.apiRequest(`/booking/api/${id}/`),
    patch: (id, data) =>
      this.apiRequest(`/booking/api/${id}/`, {
        method: 'PATCH',
        body: data,
      }),
  }

  // Review API
  review = {
    list: () => this.apiRequest('/review/reviews/'),
    create: (data) =>
      this.apiRequest('/review/review/', {
        method: 'POST',
        body: data,
      }),
    retrieve: (id) => this.apiRequest(`/review/review/${id}/`),
  }
}

export const api = new APIClient()
