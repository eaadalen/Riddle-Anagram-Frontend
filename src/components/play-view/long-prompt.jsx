import './long-prompt.scss'
import { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

export default LongPrompt = ({ prompt, lettersSolved, sendDataToLP }) => {
  const [finalAnswer, setFinalAnswer] = useState('')
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (finalAnswer === prompt.Answer) {
      sendDataToLP(true)
      setLocked(true)
    }
    else {
      // add a strike
    }
  }, [finalAnswer])

  useEffect(() => {
    Sortable.create(longPromptAnswer, { direction: 'horizontal', });
  }, [])

  const handleSubmit = () => {
    let letters = ''
    document.getElementById('longPromptAnswer').childNodes.forEach((item) => {
      letters = letters + item.textContent
    })
    console.log(letters)
    setFinalAnswer(letters)
  }

  const longPromptArray = (guess, answer) => {  
    returnValue = []
    for (let i = 0; i < answer.length; i++) {
      if (guess.charAt(i) === '') {
        returnValue.push(['', i])
      }
      else {
        returnValue.push([guess.charAt(i), i])
      }
    }
    return returnValue
  }

  return (
    <div>
      <button onClick={handleSubmit}>Click me</button>
      <div className='prompt'>
        {prompt.longPrompt}
      </div>
      {!locked &&
        <div id='longPromptAnswer' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} className='long-prompt-letter'>{letter[0]}</div>
          ))}
        </div>
      }
      {locked &&
        <div id='none' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} className='long-prompt-letter'>{letter[0]}</div>
          ))}
        </div>
      }
      <div className='unscramble'>
        Unscramble the letters above to answer the riddle
        <br></br>
        Answer clues to reveal letters
      </div>
    </div>
  )
}