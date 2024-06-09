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
      {prompt.longPrompt}
      <br></br>
      {lettersSolved}
      <Form.Group>
        <Form.Control
            type="text"
            onChange={(e) => setUnscramble(e.target.value.replace(/\s/g, '').toUpperCase())}
            id="answer-form"
            className="answer-form"
        />
      </Form.Group>
    </div>
  )
}