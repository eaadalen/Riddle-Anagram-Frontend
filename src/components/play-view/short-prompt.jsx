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

function updateLetters(state, action) {
  switch (action.type) {
    case 'addLetter':
      return {value: state.value + action.update}
    default:
      return state
  }
}

export default ShortPrompt = ({ prompts, sendDataToSP }) => {
  var activeDiv = Object.keys(prompts)[0]
  const [guess, dispatch1] = useReducer(updateGuess, { value: '' })
  const [active, dispatch2] = useReducer(updateActive, { value: '' })
  const [solvedLetters, dispatch3] = useReducer(updateLetters, { value: '' })

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event));
    dispatch2({ type: 'updateDiv', newDiv: activeDiv})
    document.getElementById(activeDiv).className = 'short-prompt-container-active'
    Object.keys(prompts).forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
  }, []);

  useEffect(() => {
    sendDataToSP(solvedLetters.value);
  }, [solvedLetters.value]);

  const handleTyping = (e) => {  
    if (e.target.id != 'answer-form') {
      if (prompts[activeDiv].locked != true) {
        if (e.key === 'Backspace') {
          dispatch1({ type: 'deleteLetter' })
          prompts[activeDiv].activeGuess = prompts[activeDiv].activeGuess.slice(0, -1)
        }
        else if ((/^[A-Z]+$/i.test(e.key)) && (e.key.length == 1)){
          dispatch1({ type: 'addLetter', update: e.key })
          if (prompts[activeDiv].activeGuess.length < prompts[activeDiv].maxLength) {
            prompts[activeDiv].activeGuess = prompts[activeDiv].activeGuess + e.key.toUpperCase()
          }
          if (prompts[activeDiv].activeGuess === prompts[activeDiv].Answer) {
            document.getElementById(activeDiv).className = 'short-prompt-container-correct'
            prompts[activeDiv].locked = true
            dispatch3({ type: 'addLetter', update: prompts[activeDiv].activeGuess.charAt(prompts[activeDiv].activeLetter)})
            var BreakException = {};
            try {
              Object.keys(prompts).forEach(function(element) {
                if (prompts[element]['locked'] != true) {
                  activeDiv = element
                  dispatch2({ type: 'updateDiv', newDiv: element})
                  document.getElementById(element).className = 'short-prompt-container-active'
                  throw BreakException
                }
              });
            } catch (e) {
              if (e !== BreakException) throw e;
            }
          }
        }
      }
    }
  }

  const handleClick = (event) => {  
    if (event.target.className === 'short-prompt-container-inactive') {
      if (document.getElementById(activeDiv).className != 'short-prompt-container-correct') {
        document.getElementById(activeDiv).className = 'short-prompt-container-inactive'
      }
      document.getElementById(event.target.id).className = 'short-prompt-container-active'
      activeDiv = event.target.id
      dispatch2({ type: 'updateDiv', newDiv: event.target.id})
    }
  }

  const shortPromptArray = (guess, answer) => {  
    returnValue = []
    for (let i = 0; i < answer.length; i++) {
      if (guess.activeGuess.charAt(i) === '') {
        returnValue.push(['', i])
      }
      else {
        returnValue.push([guess.activeGuess.charAt(i), i])
      }
    }
    return returnValue
  }

  return (
    <div>
      {Object.keys(prompts).map((prompt) => (
        <div key={prompt} id={prompt} className={'short-prompt-container-inactive'}>
          {prompts[prompt].shortPrompt}
          <div className='short-prompt-guess'>
            {shortPromptArray(prompts[prompt], prompts[prompt].Answer).map((letter) => (
              <div key={Math.random()} className={letter[1] == prompts[prompt].activeLetter ? 'active-letter' : 'guess-letter'}>{letter[0]}</div>
            ))}
          </div>
        </div>
        ))
      }
    </div>
  )
}