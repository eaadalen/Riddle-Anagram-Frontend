import './short-prompt.scss'
import { useState, useEffect, useRef } from 'react';

export default ShortPrompt = ({ prompts }) => {
  const [activeDiv, setActiveDiv] = useState(prompts[0]._id)
  const [prevDiv, setPrevDiv] = useState(prompts[prompts.length-1]._id)

  document.body.addEventListener('click', (event) => {
    if (event.target.className === 'short-prompt-container-inactive') {
      document.getElementById(activeDiv).classList.remove('short-prompt-container-inactive')
      document.getElementById(activeDiv).classList.add('short-prompt-container-active')
      document.getElementById(prevDiv).classList.remove('short-prompt-container-active')
      document.getElementById(prevDiv).classList.add('short-prompt-container-inactive')
      console.log(`state in prev   div handler: ${prevDiv}`)
      console.log(`state in active div handler: ${activeDiv}`)
    }
  })

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} id={prompt._id} className='short-prompt-container-inactive'>
          {prompt.shortPrompt}
          <br></br>
          {prompt.Answer}
          <br></br>
          {shortPromptArray(prompt.Answer).map(() => (
            <div key={Math.random()} className='answer-letter'>
              __
            </div>
            ))
          }
        </div>
        ))
      }
    </div>
  )
}