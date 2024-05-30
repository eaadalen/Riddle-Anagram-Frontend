import "./long-prompt.scss"
import { useState, useEffect } from "react";

export default LongPrompt = ({ prompt }) => {

  return (
    <div>
      {prompt[0].longPrompt}
      <br></br>
      {prompt[0].Answer}
    </div>
  )
}