import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Webcam from 'react-webcam'
import { loadModels, getFullFaceDescription } from './face'

const WIDTH = 420
const HEIGHT = 420
const inputSize = 160

const catNav = require('../img/catNav.png')
const dogNav = require('../img/dogNav.png')

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.webcam = React.createRef()
    this.state = {
      fullDesc: null,
      facingMode: null,
      surprised: 0,
      happy: 0,
    }
  }
  componentWillMount = async () => {
    await loadModels()
    this.setInputDevice()
  }

  //===================CAMERA SETUP=================================
  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      )
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user',
        })
      } else {
        await this.setState({
          facingMode: { exact: 'environment' },
        })
      }
      this.startCapture()
    })
  }

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture()
    }, 150)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  capture = async () => {
    try {
      if (!!this.webcam.current) {
        await getFullFaceDescription(
          this.webcam.current.getScreenshot(),
          inputSize
        ).then(fullDesc => {
          if (!!fullDesc) {
            this.setState({
              detections: fullDesc.map(fd => fd.detection),
              descriptors: fullDesc.map(fd => fd.descriptor),
            })
            this.setState({
              surprised: fullDesc[0].expressions.surprised + 0.05,
              happy: fullDesc[0].expressions.happy + 0.05,
            })
          }
        })
      }
    } catch (error) {
      console.error('womp, womp', error)
    }
  }

  render() {
    const { detections, facingMode } = this.state
    let videoConstraints = null
    let camera = ''
    let detected = ''

    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      }
      if (facingMode === 'user') {
        camera = 'Front'
      } else {
        camera = 'Back'
      }
    }

    //===================GOT DETECTIONS=================================
    let drawBox = null
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height
        let _W = detection.box.width
        let _X = detection.box._x
        let _Y = detection.box._y
        detected = 'detected'

        //==============NEW PAGE LOGIC====================
        if (this.state.surprised < 1.2 && this.state.surprised > 0.7) {
          window.location.assign('https://face-nav.firebaseapp.com/camera')
          // window.history.pushState(
          //   'home',
          //   '',
          //   'https://face-nav.firebaseapp.com'
          // )
        } else if (this.state.happy < 1.2 && this.state.happy > 0.7) {
          window.location.assign('https://face-nav.firebaseapp.com/lfit')
          // window.history.pushState(
          //   'home',
          //   '',
          //   'https://face-nav.firebaseapp.com'
          // )
        }
        return (
          <div key={i}>
            <div className={detected}></div>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            ></div>
          </div>
        )
      })
    }

    return (
      <div>
        <div className={detected}></div>
        <h2 align="center">Face Navigator</h2>
        <div className="nav">
          <li>
            <Link to="/camera">
              <img className={'navPet'} src={catNav} alt=""></img>
            </Link>
          </li>
          <li>
            <Link to="/lfit">
              <img className={'navPet'} src={dogNav} alt=""></img>
            </Link>
          </li>
        </div>
        <div
          className="Camera"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#282c34',
            marginTop: 0,
            borderTop: 0,
          }}
        >
          <div
            style={{
              width: WIDTH,
              height: HEIGHT,
              opacity: 0,
            }}
          >
            <div style={{ position: 'relative', width: WIDTH }}>
              {!!videoConstraints ? (
                <div>
                  <div
                    style={{
                      position: 'absolute',
                    }}
                  >
                    <Webcam
                      audio={false}
                      width={WIDTH}
                      height={HEIGHT}
                      ref={this.webcam}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                  </div>
                </div>
              ) : null}
              {!!drawBox ? drawBox : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
