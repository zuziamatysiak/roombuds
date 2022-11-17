import { useContext } from 'react'
import { Navbar } from '../components/Navbar'
import { UserContext } from '../utils/auth'

const DashboardPage = () => {
  const context = useContext(UserContext)

  return (
    <>
      <Navbar />
      <h1>
        👋 Hello {context.user?.firstName} {context.user?.lastName}!
      </h1>
    </>
  )
}

export default DashboardPage
