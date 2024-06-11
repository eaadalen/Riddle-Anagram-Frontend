import { act } from 'react';
import './short-prompt.scss'
import { useState, useEffect, useReducer } from 'react';

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
  const [solvedLetters, solvedLettersDispatch] = useReducer(updateLetters, { value: '' })
  const [render, triggerRender] = useState()

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event));
    document.getElementById(activeDiv).className = 'short-prompt-container-active'
    Object.keys(prompts).forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
  }, []);

  useEffect(() => {
    sendDataToSP(solvedLetters.value);
  }, [solvedLetters.value]);

  const setNewActiveDiv = () => {
    var BreakException = {};
    try {
      Object.keys(prompts).forEach(function(element) {
        if (prompts[element].locked != true) {
          activeDiv = element
          document.getElementById(element).className = 'short-prompt-container-active'
          throw BreakException
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    console.log('setNewActiveDiv: ' + prompts[activeDiv].Answer)
  }

  const handleTyping = (e) => {  
    if (e.key === 'Backspace') {
      prompts[activeDiv].activeGuess = prompts[activeDiv].activeGuess.slice(0, -1)
      document.getElementById(activeDiv).classList.remove('horizontal-shake')
    }
    else if ((/^[A-Z]+$/i.test(e.key)) && (e.key.length == 1)){  // Regex for testing if key is between A-Z and not a specialty key (caps lock, shift, etc)
      if (prompts[activeDiv].activeGuess.length < prompts[activeDiv].maxLength) {  // Only add letter if guess length is less than answer length
        prompts[activeDiv].activeGuess = prompts[activeDiv].activeGuess + e.key.toUpperCase() // Add letter
        if (prompts[activeDiv].activeGuess.length === prompts[activeDiv].Answer.length) {  // Check if active guess and answer are the same length
          if (prompts[activeDiv].activeGuess === prompts[activeDiv].Answer) { // Check if active guess matches answer
            document.getElementById(activeDiv).className = 'short-prompt-container-correct'
            prompts[activeDiv].locked = true
            solvedLettersDispatch({ type: 'addLetter', update: prompts[activeDiv].activeGuess.charAt(prompts[activeDiv].activeLetter)})
            setNewActiveDiv()
          }
          else {  // If active guess doesn't match answer, display incorrect animation
            document.getElementById(activeDiv).classList.add('horizontal-shake');
            prompts[activeDiv].guessesSubmitted = prompts[activeDiv].guessesSubmitted + 1
          }
        }
      }
    }
    triggerRender(Math.random())
  }

  const handleClick = (event) => { 
    console.log('prevDiv: ' + prompts[activeDiv].Answer) 
    var node = null
    if (event.target.className === 'guess-letter' || event.target.className === 'active-letter') {
      node = event.target.parentNode.parentNode
    }
    else if (event.target.className === 'short-prompt-guess' || event.target.className === 'short-prompt') {
      node = event.target.parentNode
    }
    else {
      node = event.target
    }
    if (node.className === 'short-prompt-container-inactive') {
      if (document.getElementById(activeDiv).className != 'short-prompt-container-correct' && document.getElementById(activeDiv).className != 'short-prompt-container-revealed') {
        document.getElementById(activeDiv).className = 'short-prompt-container-inactive'
      }
      document.getElementById(node.id).className = 'short-prompt-container-active'
      activeDiv = node.id
    }
    console.log('newDiv: ' + prompts[activeDiv].Answer) 
  }

  const showAnswer = (id) => {  
    prompts[id].locked = true
    prompts[id].activeGuess = prompts[id].Answer
    document.getElementById(id).className = 'short-prompt-container-revealed'
    solvedLettersDispatch({ type: 'addLetter', update: prompts[id].activeGuess.charAt(prompts[id].activeLetter)})
    triggerRender(Math.random())
    setNewActiveDiv()
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
        <div key={prompt} id={prompt} className='short-prompt-container-inactive'>
          <div className='short-prompt'>
            {prompts[prompt].shortPrompt}
          </div>
          {(prompts[prompt].guessesSubmitted > 2) && (prompts[prompt].locked != true) &&
            <div id={String(prompt)+'reveal'} className='reveal-answer' onClick={event => showAnswer(prompt)}>
              Reveal Answer?
            </div>
          }        
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