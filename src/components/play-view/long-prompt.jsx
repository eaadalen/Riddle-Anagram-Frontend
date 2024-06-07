import "./long-prompt.scss"
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

export default LongPrompt = ({ prompt, lettersSolved, sendDataToLP }) => {
  const [unscramble, setUnscramble] = useState()

  useEffect(() => {
    handleSubmit(unscramble)
  }, [unscramble]);

  const handleSubmit = (word) => {  
    if (word === prompt[0].Answer) {
      sendDataToLP(true);
    }
  }

  return (
    <div>
      {prompt[0].longPrompt}
      <br></br>
      {lettersSolved}
      <Form.Group>
        <Form.Control
            type="text"
            onChange={(e) => setUnscramble(e.target.value.replace(/\s/g, ''))}
            id="answer-form"
        />
      </Form.Group>
    </div>
  )
}