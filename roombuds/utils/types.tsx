export interface User {
  email: string
  firstName: string
  lastName: string
  verified: boolean
  verifiedEmail?: string
}

export const initialUser: User = {
  email: '',
  firstName: '',
  lastName: '',
  verified: false,
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

// response object from send email request
export interface SendResponse {
  success: boolean
  errorMessage?: string
}