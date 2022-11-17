export interface User {
  email: string
  firstName: string
  lastName: string
}

// database response object from put request
export interface PutResponse {
  success: boolean
  errorMessage?: string
}

// database response object from get request
export interface GetResponse {
  success: boolean
  data?: any
  errorMessage?: string
}
