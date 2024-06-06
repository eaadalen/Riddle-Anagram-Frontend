import './short-prompt.scss'
import { useState, useEffect, useReducer } from 'react';

function updateGuess(state, action) {
  switch (action.type) {
    case 'addLetter':
      return {value: state.value + action.update.toUpperCase()}
    case 'deleteLetter':
      return {value: state.value.slice(0, -1)}
    case 'clearText':
      return {value: ''}
    default:
      return state
  }
}

function updateActive(state, action) {
  switch (action.type) {
    case 'updateDiv':
      return {value: action.newDiv}
    default:
      return state
  }
}

export default ShortPrompt = ({ prompts }) => {
  var activeDiv = null
  const [guess, dispatch1] = useReducer(updateGuess, { value: ''})
  const [active, dispatch2] = useReducer(updateActive, { value: ''})

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event, activeDiv));
    prompts.forEach((element) => {
      document.getElementById(element._id).addEventListener("click", event => handleClick(event));
    })
  }, []);

  const handleTyping = (e, AD) => {  
    if (e.key === 'Backspace') {
      dispatch1({ type: 'deleteLetter'})
    }
    else if (/[a-zA-Z]/.test(e.key)) {
      dispatch1({ type: 'addLetter', update: e.key })
    }
  }

  const handleClick = (event) => {  
    if (event.target.className === 'short-prompt-container-inactive') {
      prompts.forEach((element) => {
        document.getElementById(element._id).className = 'short-prompt-container-inactive'
      })
      document.getElementById(event.target.id).className = 'short-prompt-container-active'
      activeDiv = event.target.id
      dispatch1({ type: 'clearText'})
      dispatch2({ type: 'updateDiv', newDiv: event.target.id})
    }
  }

  const shortPromptArray = (guess, answer) => {  
    returnValue = []
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === undefined) {
        returnValue.push('_')
      }
      else {
        returnValue.push(guess[i])
      }
    }
    return returnValue
  }

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} id={prompt._id} className='short-prompt-container-inactive'>
          {prompt.shortPrompt}
          <div className='short-prompt-guess'>
            {(prompt._id === active.value) && 
              shortPromptArray(guess.value, prompt.Answer).map((letter) => (
                <div key={Math.random()} className='guess-letter'>{letter}</div>
              ))
            }
          </div>
        </div>
        ))
      }
    </div>
  )
}