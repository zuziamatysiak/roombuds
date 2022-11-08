import Head from 'next/head'
import { Navbar } from '../pages/Navbar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>ROOMB(ud)S 🌱</title>
        </Head>
        <main className={styles.main}>
        <div className="column-container">
          <div className="column">
          <h1 className={styles.title}>
            Find your next roommate on roombuds. 🌱
          </h1>
          <h1 className ={styles.description}> roombuds matches students and new grads with roommates you can trust who work at your company or go to the same school as you!</h1>
          </div>
          <div className="column">
            
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
