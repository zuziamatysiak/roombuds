import Head from 'next/head'
import { Navbar } from '../pages/Navbar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ROOMB(ud)S 🌱</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to ROOMB(ud)S 🌱
        </h1>

        <p className={styles.description}>
        Have you ever found yourself in need of finding a roommate for college, the time of your internship, or when you just moved to a new city? Endless scrolling on Facebook groups, using Discord chats, or other websites felt unsafe, time-consuming, and difficult? With ROOMB(ud)S we understand the struggle and facilitate the process for you. We provide an easy to use web application where you can find a perfect roommate for your needs. We focus on safety and want to provide you with potential roommates based on your needs (same city, school, workplace, age, gender, etc.) while valuing your privacy.
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Login &rarr;</h2>
          </a>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Sign up &rarr;</h2>
          </a>
        </div>
      </main>
    </div>
  )
}
