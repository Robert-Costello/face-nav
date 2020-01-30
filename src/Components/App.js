// import React from 'react'
// import logo from '../logo.svg'
// import '../App.css'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save sleep.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   )
// }

// export default App

import React, { Component } from 'react'
import { Route, Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import '../App.css'

import Home from './Home'
import ImageInput from './ImageInput'
import VideoInput from './VideoInput'
import LFIT from './LFIT'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createHistory()}>
          <div className="route">
            <Route exact path="/" component={Home} />
            <Route exact path="/photo" component={ImageInput} />
            <Route exact path="/camera" component={VideoInput} />
            <Route exact path="/lfit" component={LFIT} />
          </div>
        </Router>
      </div>
    )
  }
}

export default App
