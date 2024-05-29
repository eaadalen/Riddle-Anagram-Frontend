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

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState([])
  const [longPrompt, setLongPrompt] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function startup() {  
      var LP = []
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
        LP.push(data1[0].Answer)
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
      return [LP, SPs]
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

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
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
          <div className="short-prompt-container">
            {shortPrompts.map((prompt) => (
              <div key={prompt._id} className="short-prompt">
                {prompt.shortPrompt}
                <br></br>
                <div className="short-prompt-answer">
                  {shortPromptArray(prompt.Answer).map(() => (
                    <div className="answer-letter">
                      __
                    </div>
                    ))
                  }
                </div>
              </div>
              ))
            }
          </div>
          <div className="sub-container">
            <div className="sub-container">
              _ _ _ _
            </div>
            <div className="sub-container">
              _ _ _ _
            </div>
          </div>
        </div>
      }
    </div>
  )
}