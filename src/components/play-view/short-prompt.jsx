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
  var activeDiv = prompts[0]._id
  const [guess, dispatch1] = useReducer(updateGuess, { value: '' })
  const [active, dispatch2] = useReducer(updateActive, { value: '' })
  const [guessStorage, setGuessStorage] = useState({})

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event));
    dispatch2({ type: 'updateDiv', newDiv: activeDiv})
    document.getElementById(activeDiv).className = 'short-prompt-container-active'
    prompts.forEach((element) => {
      var newStorage = guessStorage
      newStorage[String(element._id)] = ''
      setGuessStorage(newStorage)
      document.getElementById(element._id).addEventListener("click", event => handleClick(event));
    })
  }, []);

  const handleTyping = (e) => {  
    if (e.key === 'Backspace') {
      dispatch1({ type: 'deleteLetter' })
      var newStorage = guessStorage
      newStorage[String(activeDiv)] = newStorage[String(activeDiv)].slice(0, -1)
      setGuessStorage(newStorage)
    }
    else if (/[a-zA-Z]/.test(e.key)) {
      dispatch1({ type: 'addLetter', update: e.key })
      var newStorage = guessStorage
      newStorage[String(activeDiv)] = newStorage[String(activeDiv)] + e.key.toUpperCase()
      setGuessStorage(newStorage)
    }
  }

  const handleClick = (event) => {  
    if (event.target.className === 'short-prompt-container-inactive') {
      document.getElementById(activeDiv).className = 'short-prompt-container-inactive'
      document.getElementById(event.target.id).className = 'short-prompt-container-active'
      activeDiv = event.target.id
      dispatch2({ type: 'updateDiv', newDiv: event.target.id})
    }
  }

  const shortPromptArray = (guess, answer) => {  
    if (guess === undefined) {
      return ['h','i']
    }
    returnValue = []
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === undefined) {
        returnValue.push(['_',i])
      }
      else {
        returnValue.push([guess[i],i])
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
            {shortPromptArray(guessStorage[prompt._id], prompt.Answer).map((letter) => (
              <div key={Math.random()} className={letter[1] == prompt.activeLetter ? 'active-letter' : 'guess-letter'}>{letter[0]}</div>
            ))}
          </div>
        </div>
        ))
      }
    </div>
  )
}