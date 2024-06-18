import './keyboard-view.scss'
import { useEffect } from 'react';

export const KeyboardView = ({ sendDataToKV }) => {
  const keysRow1 = ['Q','W','E','R','T','Y','U','I','O','P']
  const keysRow2 = ['A','S','D','F','G','H','J','K','L']
  const keysRow3 = ['Z','X','C','V','B','N','M','⌫']

  useEffect(() => {
    keysRow1.forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
    keysRow2.forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
    keysRow3.forEach((element) => {
      document.getElementById(element).addEventListener("click", event => handleClick(event));
    })
  },[])

  const handleClick = (event) => {
    sendDataToKV([event.target.textContent, Math.random()]);
  }

  return (
    <div className='user-keyboard'>
      <div className='letters-row'>
        {keysRow1.map((element) => (
          <div key={element} id={element} className='letter'>{element}</div>
        ))}
      </div>
      <div className='letters-row'>
        {keysRow2.map((element) => (
          <div key={element} id={element} className='letter'>{element}</div>
        ))}
      </div>
      <div className='letters-row'>
        {keysRow3.map((element) => (
          <div key={element} id={element} className='letter'>{element}</div>
        ))}
      </div>
    </div>
  )
}