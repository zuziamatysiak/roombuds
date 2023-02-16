import { useEffect, useState } from 'react'

import type { User } from './types'
import { initialUser } from './types'

export const EMAIL_KEY = 'email'
export const FIRST_NAME_KEY = 'firstName'
export const LAST_NAME_KEY = 'lastName'
export const VERIFIED_KEY = 'verified'
export const VERIFIED_EMAIL_KEY = 'verifiedEmail'

/**
 * hook to set and get data from localStorage
 * @param key name of item to fetch
 * @param initialValue default value of item
 * @returns [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // get from local storage by key
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // defaults to initialValue
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }
  return [storedValue, setValue] as const
}

/**
 * hook to set and get user data from localStorage
 * @param user user object to set in localStorage
 * @returns [user, setUser] user object and function to set user
 */
export const useUser = (user?: User): [User, (user: User) => void] => {
  const [hasMounted, setHasMounted] = useState(false)
  // prevent hydration error
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const [email, setEmail] = useLocalStorage<string>(EMAIL_KEY, '')
  const [firstName, setFirstName] = useLocalStorage<string>(FIRST_NAME_KEY, '')
  const [lastName, setLastName] = useLocalStorage<string>(LAST_NAME_KEY, '')
  const [verified, setVerified] = useLocalStorage<boolean>(VERIFIED_KEY, false)
  const [verifiedEmail, setVerifiedEmail] = useLocalStorage<string>(
    VERIFIED_EMAIL_KEY,
    ''
  )

  const setUser = (user: User) => {
    setEmail(user.email)
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setVerified(user.verified)
    setVerifiedEmail(user.verifiedEmail || '')
  }
  if (!hasMounted) {
    return [initialUser, setUser]
  }

  // if user is passed in, set cookie and return user
  if (user) {
    setUser(user)
    return [user, setUser]
  } else if (email) {
    // if user is not passed in, but there is an email in localStorage, return user
    return [{ email, firstName, lastName, verified, verifiedEmail }, setUser]
  }

  return [user || initialUser, setUser]
}
