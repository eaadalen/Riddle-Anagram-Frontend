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
  const [longPrompt, setLongPrompt] = useState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
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
      setLongPrompt(data1[0].Answer)
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
          setShortPrompts(shortPrompts.push(data2[0]))
        })
      )
      return 0
    })
    .then((result) => {
      console.log(longPrompt)
      console.log(shortPrompts)
      setLoaded(true)
    })
  }, []) 

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
  } 

  const selectShortPrompts = (prompt) => {    // Select short prompts based on letters of long prompt
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