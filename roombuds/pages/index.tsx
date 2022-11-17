import Head from 'next/head'
import { Navbar } from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.column_container}>
            <div className={styles.column}>
              <h1 className={styles.title}>
                Find your next roommate on roombuds. 🌱
              </h1>
              <h1 className={styles.description}>
                {' '}
                roombuds matches students and new grads with roommates you can
                trust who work at your company or go to the same school as you!
              </h1>
            </div>
            <div className={styles.column}>
              <img src="/humans.jpg" className={styles.picture} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
