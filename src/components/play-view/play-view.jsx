import "./play-view.scss"
import { useState, useEffect } from "react";
import loading from '../../../media/loading-animation.gif';
import ShortPrompt from './short-prompt.jsx'
import LongPrompt from './long-prompt.jsx'
import GameOver from './game-over.jsx'
import { Modal } from 'react-bootstrap'; 

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState({})
  const [longPrompt, setLongPrompt] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [dataFromSP, setDataFromSP] = useState("");
  const [showModal, setShowModal] = useState(false)

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

  function handleDataFromLP() {
    Object.keys(shortPrompts).forEach((element) => {
      shortPrompts[element]['locked'] = true
    })
    setShowModal(true)
  }

  const toggleModal = () => {  
    if (showModal == true) {
      setShowModal(false)
      location.reload()
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
            <LongPrompt prompt={longPrompt} lettersSolved={dataFromSP} sendDataToLP={handleDataFromLP}/>
          </div>
          <div className="transition-div"></div>
          <div className="short-prompt">
            <ShortPrompt prompts={shortPrompts} sendDataToSP={handleDataFromSP}/>
          </div>
        </div>
      }
      {showModal &&
        <Modal show={true} onHide={toggleModal} className="modal-container">  
          <Modal.Body>
            <GameOver/>
          </Modal.Body>  
        </Modal> 
      }
    </div>
  )
}