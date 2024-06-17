import './short-prompt-view.scss'
import { useState, useEffect, useReducer, useRef } from 'react';

function updateLetters(state, action) {
  switch (action.type) {
    case 'addLetter':
      return {value: state.value + action.update}
    default:
      return state
  }
}

export const ShortPromptView = ({ prompts, sendDataToSP, dataFromKV }) => {
  const [activeDiv, setActiveDiv] = useState(Object.keys(prompts)[0])
  const activeDivRef = useRef();
  activeDivRef.current = activeDiv
  const [solvedLetters, solvedLettersDispatch] = useReducer(updateLetters, { value: '' })
  const [render, triggerRender] = useState()

  useEffect(() => {
    window.addEventListener("keyup", event => handleTyping(event));
    document.getElementById(activeDivRef.current).className = 'short-prompt-container-active'
    Object.keys(prompts).forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
  }, []);

  useEffect(() => {
    sendDataToSP(solvedLetters.value);
  }, [solvedLetters.value]);

  useEffect(() => {
    if (dataFromKV[0] != undefined) {
      handleMobileTyping(dataFromKV[0])
    }
  }, [dataFromKV]);

  const setNewActiveDiv = () => {
    var BreakException = {};
    try {
      Object.keys(prompts).forEach(function(element) {
        if (prompts[element].locked != true) {
          setActiveDiv(element)
          document.getElementById(element).className = 'short-prompt-container-active'
          throw BreakException
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
  }

  const handleTyping = (e) => {  
    console.log(prompts[activeDivRef.current].Answer)
    if (e.key === 'Backspace') {
      prompts[activeDivRef.current].activeGuess = prompts[activeDivRef.current].activeGuess.slice(0, -1)
      document.getElementById(activeDivRef.current).classList.remove('horizontal-shake')
    }
    else if ((/^[A-Z]+$/i.test(e.key)) && (e.key.length == 1)){  // Regex for testing if key is between A-Z and not a specialty key (caps lock, shift, etc)
      if (prompts[activeDivRef.current].activeGuess.length < prompts[activeDivRef.current].maxLength) {  // Only add letter if guess length is less than answer length
        prompts[activeDivRef.current].activeGuess = prompts[activeDivRef.current].activeGuess + e.key.toUpperCase() // Add letter
        if (prompts[activeDivRef.current].activeGuess.length === prompts[activeDivRef.current].Answer.length) {  // Check if active guess and answer are the same length
          if (prompts[activeDivRef.current].activeGuess === prompts[activeDivRef.current].Answer) { // Check if active guess matches answer
            document.getElementById(activeDivRef.current).className = 'short-prompt-container-correct'
            prompts[activeDivRef.current].locked = true
            solvedLettersDispatch({ type: 'addLetter', update: prompts[activeDivRef.current].activeGuess.charAt(prompts[activeDivRef.current].activeLetter)})
            setNewActiveDiv()
          }
          else {  // If active guess doesn't match answer, display incorrect animation
            document.getElementById(activeDivRef.current).classList.add('horizontal-shake');
            prompts[activeDivRef.current].guessesSubmitted = prompts[activeDivRef.current].guessesSubmitted + 1
          }
        }
      }
    }
    triggerRender(Math.random())
  }

  const handleMobileTyping = (e) => {  
    if (e === '⌫') {
      prompts[activeDivRef.current].activeGuess = prompts[activeDivRef.current].activeGuess.slice(0, -1)
      document.getElementById(activeDivRef.current).classList.remove('horizontal-shake')
    }
    else {
      if (prompts[activeDivRef.current].activeGuess.length < prompts[activeDivRef.current].maxLength) {  // Only add letter if guess length is less than answer length
        prompts[activeDivRef.current].activeGuess = prompts[activeDivRef.current].activeGuess + e.toUpperCase() // Add letter
        if (prompts[activeDivRef.current].activeGuess.length === prompts[activeDivRef.current].Answer.length) {  // Check if active guess and answer are the same length
          if (prompts[activeDivRef.current].activeGuess === prompts[activeDivRef.current].Answer) { // Check if active guess matches answer
  
            document.getElementById(activeDivRef.current).className = 'short-prompt-container-correct'
            prompts[activeDivRef.current].locked = true
            solvedLettersDispatch({ type: 'addLetter', update: prompts[activeDivRef.current].activeGuess.charAt(prompts[activeDivRef.current].activeLetter)})
            setNewActiveDiv()
          }
          else {  // If active guess doesn't match answer, display incorrect animation
            document.getElementById(activeDivRef.current).classList.add('horizontal-shake');
            prompts[activeDivRef.current].guessesSubmitted = prompts[activeDivRef.current].guessesSubmitted + 1
          }
        }
      }
    }
    triggerRender(Math.random())
  }

  const handleClick = (event) => { 
    console.log(prompts[activeDivRef.current].Answer)
    if (event.target.textContent != 'Reveal Answer?') {
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
        if (document.getElementById(activeDivRef.current).className != 'short-prompt-container-correct' && document.getElementById(activeDivRef.current).className != 'short-prompt-container-revealed') {
          document.getElementById(activeDivRef.current).className = 'short-prompt-container-inactive'
        }
        document.getElementById(node.id).className = 'short-prompt-container-active'
        setActiveDiv(node.id)
      }
    }
  }

  const showAnswer = (id) => {  
    prompts[id].locked = true
    prompts[id].activeGuess = prompts[id].Answer
    document.getElementById(id).className = 'short-prompt-container-revealed'
    solvedLettersDispatch({ type: 'addLetter', update: prompts[id].activeGuess.charAt(prompts[id].activeLetter)})
    setNewActiveDiv()
    triggerRender(Math.random())
  }

  const shortPromptArray = (guess, answer) => {  
    let returnValue = []
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
          <div>
            {prompts[prompt].shortPrompt}
          </div>
          {(prompts[prompt].guessesSubmitted > 0) && (prompts[prompt].locked != true) &&
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