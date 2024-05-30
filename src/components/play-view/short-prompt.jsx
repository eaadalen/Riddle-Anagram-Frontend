import "./short-prompt.scss"
import { useState, useEffect } from "react";

export default ShortPrompt = ({ prompts }) => {
  const [currentGuess, setCurrentGuess] = useState('')
  const [activeDiv, setActiveDiv] = useState(prompts[0]._id)

  useEffect(() => {
    prompts.forEach((element) => 
      document.getElementById(element._id).classList.add('short-prompt-container-inactive')
    )
    document.getElementById(prompts[0]._id).classList.remove('short-prompt-container-inactive')
    document.getElementById(prompts[0]._id).classList.add('short-prompt-container-active')
    document.body.addEventListener('click', (event) => {
      if (event.target.className == 'short-prompt-container-inactive') {
        updateActiveDiv(activeDiv, event.target.id)
        setActiveDiv(event.target.id)
      }
    })
  }, []) 

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
  }

  const test = () => {
    
  }

  const updateActiveDiv = (oldActive, newActive) => {  
    console.log('Old: ' + String(oldActive))
    console.log('New: ' + String(newActive))
    document.getElementById(oldActive).classList.remove('short-prompt-container-active');
    document.getElementById(oldActive).classList.add('short-prompt-container-inactive');
    document.getElementById(newActive).classList.remove('short-prompt-container-inactive');
    document.getElementById(newActive).classList.add('short-prompt-container-active');
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} id={prompt._id}>
          {prompt.shortPrompt}
          <br></br>
          {prompt.Answer}
          <br></br>
          {shortPromptArray(prompt.Answer).map(() => (
            <div key={Math.random()} className="answer-letter">
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