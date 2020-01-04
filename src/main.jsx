// Polyfill for advanced javascript transformation via Babel
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// Basic react includes
import ReactDOM from 'react-dom'
import React from 'react'

// App-wide cookie support
import { CookiesProvider } from 'react-cookie'

// Game grid which will load game pages dynamically
import GameBuildsPage from './Components/GameBuildsPage.jsx'

// Function to mount our react app
window.mountApp = () => {
  ReactDOM.render(
    <CookiesProvider>
      <GameBuildsPage />
    </CookiesProvider>,
    document.getElementById('app')
  )
}

// Render the game grid for the first time
window.mountApp()
