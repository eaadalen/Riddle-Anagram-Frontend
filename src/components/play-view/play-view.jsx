import "./play-view.scss"
import { useState, useEffect } from "react";
import loading from '../../../media/loading-animation.gif';
import { ShortPromptView } from '../short-prompt-view/short-prompt-view'
import { LongPromptView } from '../long-prompt-view/long-prompt-view'
import { KeyboardView } from '../keyboard-view/keyboard-view'
import { GameOverView } from '../game-over-view/game-over-view'
import { Modal } from 'react-bootstrap'; 

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState({})
  const [longPrompt, setLongPrompt] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [dataFromSP, setDataFromSP] = useState('');
  const [dataFromKV, setDataFromKV] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [gameOverData, setGameOverData] = useState()

  useEffect(() => {
    fetch(
      "https://riddle-unscramble-game-f456ae714e99.herokuapp.com/random",
      {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
      }
    )
    .then((response) => response.json())
    .then((LP) => {
      setLongPrompt(LP[0])
      fetch(
        "https://riddle-unscramble-game-f456ae714e99.herokuapp.com/spL/" + String(LP[0].Answer),
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
        }
      )
      .then((response) => response.json())
      .then((SP) => {
        setShortPrompts(SP)
        setLoaded(true)
      })
    })
  }, []) 

  function handleDataFromSP(data) {
    setDataFromSP(data);
  }

  function handleDataFromLP(data) {
    Object.keys(shortPrompts).forEach((element) => {
      shortPrompts[element]['locked'] = true
    })
    setGameOverData(data)
    setShowModal(true)
  }

  function handleDataFromKV(data) {
    setDataFromKV(data);
  }

  const toggleModal = () => {  
    if (showModal == true) {
      setShowModal(false)
      //location.reload()
    }
    else {
      setShowModal(true)
    }
  }  
    
  return (
    <div>
      {!loaded && 
        <div className="container-eka">
          <img src={loading}/>
        </div>
      }
      {loaded &&
        <div className="container-eka">
          <div className="long-prompt">
            <LongPromptView prompt={longPrompt} lettersSolved={dataFromSP} sendDataToLP={handleDataFromLP}/>
          </div>
          <div className="transition-div-top"></div>
          <div className="short-prompt-container">
            <ShortPromptView prompts={shortPrompts} sendDataToSP={handleDataFromSP} dataFromKV={dataFromKV}/>
          </div>
          <div className="transition-div-bottom"></div>
          <div className="user-keyboard">
            <KeyboardView sendDataToKV={handleDataFromKV}/>
          </div>
        </div>
      }
      {showModal &&
        <Modal show={true} onHide={toggleModal} className="modal-container">  
          <Modal.Body>
            <GameOverView answer={longPrompt.Answer} data={gameOverData}/>
          </Modal.Body>  
        </Modal> 
      }
    </div>
  )
}