import './short-prompt.scss'
import { useState, useEffect, useRef } from 'react';

export default ShortPrompt = ({ prompts }) => {
  var activeDiv = null

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
  }

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event));
    prompts.forEach((element) => {
      document.getElementById(element._id).addEventListener("click", event => handleClick(event));
    })
  }, []);

  const handleClick = (event) => {  
    if (event.target.className === 'short-prompt-container-inactive') {
      prompts.forEach((element) => {
        document.getElementById(element._id).className = 'short-prompt-container-inactive'
      })
      document.getElementById(event.target.id).className = 'short-prompt-container-active'
      activeDiv = event.target.id
      console.log(activeDiv)
    }
  }

  const handleTyping = (event) => {  
    console.log(activeDiv)
    document.getElementById("A").innerHTML = event.key
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} id={prompt._id} className='short-prompt-container-inactive'>
          {prompt.shortPrompt}
          <br></br>
          {prompt.Answer}
          <br></br>
          {shortPromptArray(prompt.Answer).map((answer) => (
            <div key={Math.random()} className='answer-letter'>
              <span id={answer}>_</span>
            </div>
            ))
          }
        </div>
        ))
      }
    </div>
  )
}