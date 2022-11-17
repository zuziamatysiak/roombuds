import React from 'react'
import Head from 'next/head'

const Header = () => (
  <>
    <Head>
      <title>ROOMB(ud)S 🌱</title>
      <meta
        name="description"
        content="A web app to find your next roommate."
      />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>"
      />
      {/* import font QuickSand from google */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@300;400;600&display=swap"
        rel="stylesheet"
      />
    </Head>
  </>
)

export default Header
