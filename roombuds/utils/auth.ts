import { createContext } from 'react'

export const UserContext = createContext<{ user: any; setUser: any }>({
  user: null,
  setUser: () => {},
})
