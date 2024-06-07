import "./long-prompt.scss"
import { useState, useEffect } from "react";

export default LongPrompt = ({ prompt, lettersSolved }) => {
  const [unscramble, setUnscramble] = useState()

  const handleSubmit = (event) => {  
    event.preventDefault()
    if (unscramble === prompt[0].Answer) {
      console.log('correct!')
    }
  }

  return (
    <div>
      {prompt[0].longPrompt}
      <br></br>
      {lettersSolved}
      <form>
        <input type="text" onSubmit={handleSubmit} value={unscramble}></input>
      </form>
    </div>
  )
}