import React from 'react'
import ReactDOM from 'react-dom/client'
import { Preview } from './pages/Preview'

// Reset CSS mínimo
const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: #0F0F1A;
  }
  #root {
    min-height: 100vh;
  }
  /* Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Updock&display=swap');
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Preview />
  </React.StrictMode>
)
