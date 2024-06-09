import "./long-prompt.scss"
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

export default LongPrompt = ({ prompt, lettersSolved, sendDataToLP }) => {
  const [unscramble, setUnscramble] = useState()

  useEffect(() => {
    if (unscramble === prompt.Answer) {
      sendDataToLP(true);
    }
  }, [unscramble]);

  return (
    <div>
      <div className="prompt">
        {prompt.longPrompt}
      </div>
      <div className="answer-form">
        <Form.Group >
          <Form.Control
              type="text"
              onChange={(e) => setUnscramble(e.target.value.replace(/\s/g, '').toUpperCase())}
              id="answer-form"
              className="answer-form"
          />
        </Form.Group>
      </div>
      <div>
        {lettersSolved ? lettersSolved : '?'}
      </div>
      <div className="unscramble">
        Unscramble the letters above to answer the riddle
      </div>
    </div>
  )
}