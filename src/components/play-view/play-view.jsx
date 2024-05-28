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
  const [shortPrompts, setShortPrompts] = useState();
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(
      "https://riddle-anagram-game-01434420d487.herokuapp.com/shortprompts",
      {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
      }
    )
    .then((response) => response.json())
    .then((data) => {
      setShortPrompts(data.slice(0, 10))
      setLoaded(true)
    })
  }, []) 
    
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