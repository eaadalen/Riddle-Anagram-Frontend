import "./play-view.scss"
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap'; 
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from 'react-bootstrap/Container';
import { Card } from "react-bootstrap";
import loading from '../../../media/loading-animation.gif';
import ShortPrompt from './short-prompt.jsx'
import LongPrompt from './long-prompt.jsx'

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState([])
  const [longPrompt, setLongPrompt] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [activePrompt, setActivePrompt] = useState(false)

  useEffect(() => {
    async function startup() {  
      var LPs = []
      var SPs = []

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
        LPs.push(data1[0])
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
            SPs.push(data2[0])
          })
        )
      })
      return [LPs, SPs]
    }
      
    async function asyncCall() {
      const values = await startup()
      setLongPrompt(values[0])
      setShortPrompts(values[1])
      await sleep(1000)
      setLoaded(true)
    }

    asyncCall()

  }, []) 

  useEffect(() => {

  }, [activePrompt])

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
          <ShortPrompt prompts={shortPrompts}/>
          <LongPrompt prompt={longPrompt}/>
        </div>
      }
    </div>
  )
}