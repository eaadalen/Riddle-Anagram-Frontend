import "./play-view.scss"
import { useState, useEffect } from "react";
import loading from '../../../media/loading-animation.gif';
import ShortPrompt from './short-prompt.jsx'
import LongPrompt from './long-prompt.jsx'
import { Modal } from 'react-bootstrap'; 

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState({})
  const [longPrompt, setLongPrompt] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [dataFromSP, setDataFromSP] = useState("");
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function startup() {  
      fetch(
        "https://riddle-anagram-game-01434420d487.herokuapp.com/random",
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
        }
      )
      .then((response) => response.json())
      .then((data1) => {
        setLongPrompt(data1[0])
        data1[0].Answer.split("").forEach(character => 
          fetch(
            "https://riddle-anagram-game-01434420d487.herokuapp.com/spL/" + String(character),
            {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                }
            }
          )
          .then((response) => response.json())
          .then((data2) => {
            shortPrompts[data2[0]._id] = {
              'shortPrompt': data2[0].shortPrompt,
              'Answer': data2[0].Answer,
              'activeLetter': data2[0].Answer.indexOf(String(character)),
              'activeGuess': '',
              'maxLength': data2[0].Answer.length,
              'locked': false
            }
          })
        )
      })
    }
      
    async function asyncCall() {
      await startup()
      await sleep(1000)
      setLoaded(true)
    }

    asyncCall()

  }, []) 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function handleDataFromSP(data) {
    setDataFromSP(data);
  }

  function handleDataFromLP() {
    setShowModal(true)
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
          <ShortPrompt prompts={shortPrompts} sendDataToSP={handleDataFromSP}/>
          <LongPrompt prompt={longPrompt} lettersSolved={dataFromSP} sendDataToLP={handleDataFromLP}/>
        </div>
      }
      {showModal &&
        <Modal show={true} onHide={toggleModal} className="modal">  
          <Modal.Body className="modalContainer">
            <div className="gameOver">
              <div>
                *insert score chart, like wordle*
              </div> 
            </div>
          </Modal.Body>  
        </Modal> 
      }
    </div>
  )
}