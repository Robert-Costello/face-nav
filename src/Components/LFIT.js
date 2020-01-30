import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Webcam from 'react-webcam'
import { loadModels, getFullFaceDescription } from './face'

const WIDTH = 420
const HEIGHT = 420
const inputSize = 160

const linkedin = require('../img/linkedin.jpg')
const facebook = require('../img/facebook.jpg')
const instagram = require('../img/instagram.jpg')
const tinder = require('../img/tinder.jpg')
const angryEmoji = require('../img/Angry-Emoji.png')
const happyEmoji = require('../img/Happy-Emoji.png')
const sadEmoji = require('../img/Sad-Emoji.png')
const surprisedEmoji = require('../img/Surprised-Emoji.png')
const home = require('../img/home.png')

class LFIT extends Component {
  constructor(props) {
    super(props)
    this.webcam = React.createRef()
    this.state = {
      fullDesc: null,
      facingMode: null,
      surprised: 0,
      happy: 0,
      angry: 0,
      sad: 0,
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
    }, 300)
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
              angry: fullDesc[0].expressions.angry + 0.05,
              sad: fullDesc[0].expressions.sad + 0.05,
            })
          }
        })
      }
    } catch (error) {
      console.error('womp, womp', error)
    }
  }

  openLinkedIn() {
    window.open('https://www.linkedin.com', '_blank')
  }

  openFacebook() {
    window.open('https://www.facebook.com', '_blank')
  }

  openInstagram() {
    window.open('https://www.instagram.com', '_blank')
  }

  openTinder() {
    window.open('https://www.tinder.com', '_blank')
  }

  //======================RENDER==============================
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

        //==============SCROLL LOGIC====================
        if (this.state.surprised < 1.2 && this.state.surprised > 0.4) {
          document.querySelector('.link').scrollIntoView({
            behavior: 'smooth',
          })
        } else if (this.state.angry < 1.2 && this.state.angry > 0.4) {
          document.querySelector('.face').scrollIntoView({
            behavior: 'smooth',
          })
        } else if (this.state.happy < 1.2 && this.state.happy > 0.4) {
          document.querySelector('.insta').scrollIntoView({
            behavior: 'smooth',
          })
        } else if (this.state.sad < 1.2 && this.state.sad > 0.4) {
          document.querySelector('.tinder').scrollIntoView({
            behavior: 'smooth',
          })
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
        <div>
          <div className={detected}></div>
          <ul className="go">
            <li>
              <Link to="/">
                <img className={'emoji'} src={home} alt=""></img>
              </Link>
            </li>
            <li>
              <img className="emoji" src={surprisedEmoji} alt="" />
            </li>
            <li>
              <img className="emoji" src={angryEmoji} alt="" />
            </li>
            <li>
              <img className="emoji" src={happyEmoji} alt="" />
            </li>
            <li>
              <img className="emoji" src={sadEmoji} alt="" />
            </li>
          </ul>
        </div>
        <div></div>

        <ul className="home">
          <div>
            <li className="link">
              <img src={linkedin} alt=""></img>
            </li>
            <li className="face">
              <img src={facebook} alt=""></img>
            </li>
            <li className="insta">
              <img src={instagram} alt=""></img>
            </li>
            <li className="tinder">
              <img src={tinder} alt=""></img>
            </li>
          </div>
        </ul>
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

export default LFIT
//===================HAPPY-openInstagram=========================
// if (this.state.happy < 1.9 && this.state.happy > 1.5) {
//   // this.openInstagram()
//   document.querySelector('.insta').scrollIntoView({
//     behavior: 'smooth',
//   })
//   return (
//     <div>
//       <div>
//         <div className={detected}></div>
//         <ul className="go">
//           {/* <li className={detected}></li> */}
//           <li>
//             <img className="emoji" src={surprisedEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={angryEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={happyEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={sadEmoji} alt="" />
//           </li>
//         </ul>
//       </div>
//       <ul className="instagram">
//         <div>
//           <li className="link">
//             <img src={linkedin} alt=""></img>
//           </li>
//           <li className="face">
//             <img src={facebook} alt=""></img>
//           </li>
//           <li className="insta">
//             <img src={instagram} alt=""></img>
//           </li>
//           <li className="tinder">
//             <img src={tinder} alt=""></img>
//           </li>
//         </div>
//       </ul>
//       <div
//         className="Camera"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           backgroundColor: '#282c34',
//         }}
//       >
//         <div
//           style={{
//             width: WIDTH,
//             height: HEIGHT,
//             opacity: 0,
//           }}
//         >
//           <div style={{ position: 'relative', width: WIDTH }}>
//             {!!videoConstraints ? (
//               <div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                   }}
//                 >
//                   <Webcam
//                     audio={false}
//                     width={WIDTH}
//                     height={HEIGHT}
//                     ref={this.webcam}
//                     screenshotFormat="image/jpeg"
//                     videoConstraints={videoConstraints}
//                   />
//                 </div>
//               </div>
//             ) : null}
//             {!!drawBox ? drawBox : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// //===================SURPRISED-openLinkedIn===========================
// else if (this.state.surprised < 1.2 && this.state.surprised > 0.9) {
//   // this.openLinkedIn()
//   document.querySelector('.link').scrollIntoView({
//     behavior: 'smooth',
//   })
//   return (
//     <div>
//       <div>
//         <div className={detected}></div>
//         <ul className="go">
//           {/* <li className={detected}></li> */}
//           <li>
//             <img className="emoji" src={surprisedEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={angryEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={happyEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={sadEmoji} alt="" />
//           </li>
//         </ul>
//       </div>
//       <ul className="linkedin">
//         <div>
//           <li className="link">
//             <img src={linkedin} alt=""></img>
//           </li>
//           <li className="face">
//             <img src={facebook} alt=""></img>
//           </li>
//           <li className="insta">
//             <img src={instagram} alt=""></img>
//           </li>
//           <li className="tinder">
//             <img src={tinder} alt=""></img>
//           </li>
//         </div>
//       </ul>
//       <div
//         className="Camera"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           backgroundColor: '#282c34',
//         }}
//       >
//         <div
//           style={{
//             width: WIDTH,
//             height: HEIGHT,
//             opacity: 0,
//           }}
//         >
//           <div style={{ position: 'relative', width: WIDTH }}>
//             {!!videoConstraints ? (
//               <div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                   }}
//                 >
//                   <Webcam
//                     audio={false}
//                     width={WIDTH}
//                     height={HEIGHT}
//                     ref={this.webcam}
//                     screenshotFormat="image/jpeg"
//                     videoConstraints={videoConstraints}
//                   />
//                 </div>
//               </div>
//             ) : null}
//             {!!drawBox ? drawBox : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// //===================ANGRY-openFacebook==========================
// else if (this.state.angry < 1.2 && this.state.angry > 0.4) {
//   document.querySelector('.face').scrollIntoView({
//     behavior: 'smooth',
//   })
//   return (
//     <div>
//       <div>
//         <div className={detected}></div>
//         <ul className="go">
//           {/* <li className={detected}></li> */}
//           <li>
//             <img className="emoji" src={surprisedEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={angryEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={happyEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={sadEmoji} alt="" />
//           </li>
//         </ul>
//       </div>
//       <ul className="social">
//         <div>
//           <li className="link">
//             <img src={linkedin} alt=""></img>
//           </li>
//           <li className="face">
//             <img src={facebook} alt=""></img>
//           </li>
//           <li className="insta">
//             <img src={instagram} alt=""></img>
//           </li>
//           <li className="tinder">
//             <img src={tinder} alt=""></img>
//           </li>
//         </div>
//       </ul>
//       <div
//         className="facebook"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           backgroundColor: '#282c34',
//         }}
//       >
//         <div
//           style={{
//             width: WIDTH,
//             height: HEIGHT,
//             opacity: 0,
//           }}
//         >
//           <div style={{ position: 'relative', width: WIDTH }}>
//             {!!videoConstraints ? (
//               <div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                   }}
//                 >
//                   <Webcam
//                     audio={false}
//                     width={WIDTH}
//                     height={HEIGHT}
//                     ref={this.webcam}
//                     screenshotFormat="image/jpeg"
//                     videoConstraints={videoConstraints}
//                   />
//                 </div>
//               </div>
//             ) : null}
//             {!!drawBox ? drawBox : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// //===================SAD-openTinder===========================
// else if (this.state.sad < 1.2 && this.state.sad > 0.7) {
//   document.querySelector('.tinder').scrollIntoView({
//     behavior: 'smooth',
//   })
//   return (
//     <div>
//       <div>
//         <div className={detected}></div>
//         <ul className="go">
//           {/* <li className={detected}></li> */}
//           <li>
//             <img className="emoji" src={surprisedEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={angryEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={happyEmoji} alt="" />
//           </li>
//           <li>
//             <img className="emoji" src={sadEmoji} alt="" />
//           </li>
//         </ul>
//       </div>
//       <ul className="tinder">
//         <div>
//           <li className="link">
//             <img src={linkedin} alt=""></img>
//           </li>
//           <li className="face">
//             <img src={facebook} alt=""></img>
//           </li>
//           <li className="insta">
//             <img src={instagram} alt=""></img>
//           </li>
//           <li className="tinder">
//             <img src={tinder} alt=""></img>
//           </li>
//         </div>
//       </ul>
//       <div
//         className="Camera"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           backgroundColor: '#282c34',
//         }}
//       >
//         <div
//           style={{
//             width: WIDTH,
//             height: HEIGHT,
//             opacity: 0,
//           }}
//         >
//           <div style={{ position: 'relative', width: WIDTH }}>
//             {!!videoConstraints ? (
//               <div>
//                 <div
//                   style={{
//                     position: 'absolute',
//                   }}
//                 >
//                   <Webcam
//                     audio={false}
//                     width={WIDTH}
//                     height={HEIGHT}
//                     ref={this.webcam}
//                     screenshotFormat="image/jpeg"
//                     videoConstraints={videoConstraints}
//                   />
//                 </div>
//               </div>
//             ) : null}
//             {!!drawBox ? drawBox : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//===================Home=================================
