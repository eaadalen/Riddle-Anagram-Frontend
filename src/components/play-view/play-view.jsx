import "./play-view.scss"
import { useState, useEffect } from "react";
import loading from '../../../media/loading-animation.gif';
import ShortPrompt from './short-prompt.jsx'
import LongPrompt from './long-prompt.jsx'

export const PlayView = () => {
  const [shortPrompts, setShortPrompts] = useState([])
  const [longPrompt, setLongPrompt] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function startup() {  
      var LPs = []
      var SPs = []

      fetch(
        "https://riddle-anagram-game-01434420d487.herokuapp.com/random",
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
        }
      )
      .then((response) => response.json())
      .then((data1) => {
        LPs.push(data1[0])
        data1[0].Answer.split("").forEach(character => 
          fetch(
            "https://riddle-anagram-game-01434420d487.herokuapp.com/spL/" + String(character),
            {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                }
            }
          )
          .then((response) => response.json())
          .then((data2) => {
            data2[0]['activeLetter'] = data2[0].Answer.indexOf(String(character))
            data2[0]['activeGuess'] = ''
            SPs.push(data2[0])
          })
        )
      })
      return [LPs, SPs]
    }
      
    async function asyncCall() {
      const values = await startup()
      setLongPrompt(values[0])
      setShortPrompts(values[1])
      await sleep(1000)
      setLoaded(true)
    }

    asyncCall()

  }, []) 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
    
  return (
    <div>
      {!loaded && 
        <div className="container-eka">
          <img src={loading}/>
        </div>
      }
      {loaded &&
        <div className="container-eka">
          <ShortPrompt prompts={shortPrompts}/>
          <LongPrompt prompt={longPrompt}/>
        </div>
      }
    </div>
  )
}