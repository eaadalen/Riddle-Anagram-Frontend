import './short-prompt.scss'
import { useState, useEffect, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'addLetter':
      return {value: state.value + action.update}
    case 'deleteLetter':
      return {value: state.value.slice(0, -1)}
    default:
      return state
  }
}

export default ShortPrompt = ({ prompts }) => {
  var activeDiv = null
  const [state, dispatch] = useReducer(reducer, { value: ''})
  const [classArray, setClassArray] = useState([])
  const [active, setActive] = useState('')

  const handleTyping = (e, AD) => {  
    if (e.key === 'Backspace') {
      dispatch({ type: 'deleteLetter'})
      console.log(AD)
    }
    else if (/[a-zA-Z]/.test(e.key)) {
      dispatch({ type: 'addLetter', update: e.key })
    }
  }

  const shortPromptArray = (word) => {  
    answer = []
    for (let i = 0; i < word.length; i++) {
      answer.push(word[i])
    }
    return answer
  }

  class _shortPrompt {
    constructor(id, active) {
      this.id = id;
      this.active = active;
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event, activeDiv));
    prompts.forEach((element) => {
      document.getElementById(element._id).addEventListener("click", event => handleClick(event));
      classArray.push(new _shortPrompt(element._id, false))
    })
  }, []);

  const handleClick = (event) => {  
    if (event.target.className === 'short-prompt-container-inactive') {
      prompts.forEach((element) => {
        document.getElementById(element._id).className = 'short-prompt-container-inactive'
      })
      document.getElementById(event.target.id).className = 'short-prompt-container-active'
      activeDiv = event.target.id
    }
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} id={prompt._id} className='short-prompt-container-inactive'>
          {prompt.shortPrompt}
          <br></br>
          {prompt.Answer}
          <br></br>
          {(prompt._id === active) && 
            <div>{state.value}</div>
          }
        </div>
        ))
      }
    </div>
  )
}