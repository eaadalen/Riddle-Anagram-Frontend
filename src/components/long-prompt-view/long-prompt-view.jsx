import './long-prompt-view.scss'
import { useState, useEffect } from 'react';
import { Sortable, Swap } from 'sortablejs';

export const LongPromptView = ({ prompt, p_strikes_LP, lettersSolved, sendDataToLP }) => {
  const [finalAnswer, setFinalAnswer] = useState('')
  const [locked, setLocked] = useState(false)
  const [guessesRemaining, setGuessesRemaining] = useState(5)
  const [guessRecord, setGuessRecord] = useState([])

  useEffect(() => {
    if (finalAnswer === prompt.Answer) {
      guessRecord.push(finalAnswer)
      sendDataToLP(guessRecord)
      setLocked(true)
    }
    else if (finalAnswer.length > 0) {
      setGuessesRemaining(prev => prev - 1)
      if (finalAnswer != '') {
        guessRecord.push(finalAnswer)
      }
      if (guessesRemaining === 1) {
        sendDataToLP(guessRecord)
      }
    }
  }, [finalAnswer])

  useEffect(() => {
    Sortable.mount(new Swap());
    Sortable.create(longPromptAnswer, {swap: true, swapClass: 'highlight', animation: 150});
    window.addEventListener('keyup', event => handleSubmit(event))  // Handle regular typing submission
    document.getElementById('Enter').addEventListener('click', event => handleSubmit(event))  // Handle mobile keyboard submission
  }, [])

  useEffect(() => {
    setGuessesRemaining(5+p_strikes_LP)
    if (guessesRemaining === 1) {
      sendDataToLP(guessRecord)
    }
  }, [p_strikes_LP])

  const handleSubmit = (event) => {
    if (event.key === 'Enter' || event.srcElement.id === 'Enter') {
      let letters = ''
      document.getElementById('longPromptAnswer').childNodes.forEach((item) => {
        letters = letters + item.textContent
      })
      if (letters.length === prompt.Answer.length) {
        setFinalAnswer(letters)
      }
    }
  }

  const longPromptArray = (guess, answer) => {  
    let returnValue = []
    if (finalAnswer.length > 0) {
      for (let i = 0; i < answer.length; i++) {
        if (guess.charAt(i) === answer.charAt(i)) {
          returnValue.push([guess.charAt(i), i, 'correct-letter'])
        }
        else {
          returnValue.push([guess.charAt(i), i, 'incorrect-letter'])
        }
      }
    }
    else {
      for (let i = 0; i < answer.length; i++) {
        if (guess.charAt(i) === '') {
          returnValue.push(['', i, 'long-prompt-letter'])
        }
        else {
          returnValue.push([guess.charAt(i), i, 'long-prompt-letter'])
        }
      }
    }
    return returnValue
  }

  const strikesArray = (strikes) => {  
    let returnValue = []
    for (let i = 0; i < strikes; i++) {
      returnValue.push('⬤')
    }
    return returnValue
  }

  return (
    <div>
      <div className='prompt'>
        {prompt.longPrompt}
      </div>
      {!locked &&
        <div id='longPromptAnswer' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} id={prompt.Answer + String(letter[1])} className={letter[2]}>{letter[0]}</div>
          ))}
        </div>
      }
      {locked &&
        <div id='none' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} id={prompt.Answer + String(letter[1])} className={letter[2]}>{letter[0]}</div>
          ))}
        </div>
      }
      <div className='unscramble'>
        Unscramble to answer the riddle
      </div>
      <div className='unscramble-bottom'>
        Guesses Remaining
        <div className='guessesRemaining'>
          {strikesArray(guessesRemaining).map((strike) => (
            <div key={Math.random()} className='guess'>{strike}</div>
          ))}
        </div>
      </div>
    </div>
  )
}