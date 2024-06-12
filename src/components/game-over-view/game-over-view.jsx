import "./game-over-view.css"

export const GameOverView = ({ answer, data }) => {

  const guessesArray = (guesses, answer) => {  
    let returnValue = []
    for (let i = 0; i < guesses.length; i++) {
      let emojis = ''
      for (let j = 0; j < answer.length; j++) {
        if (guesses[i].charAt(j) === answer.charAt(j)) {
          emojis = emojis + '🟩'
        }
        else {
          emojis = emojis + '🟥'
        }
      }
      returnValue.push(emojis)
    }
    return returnValue
  }

  return (
    <div>
      <div className='guess-array'>
        {guessesArray(data, answer).map((element) => 
          <div key={Math.random()}>
            {element}
          </div>
        )}
      </div>
      {(data[data.length - 1] === answer) &&
        <div>
          Correct!
          <br></br>
          Come back tomorrow for the next riddle
        </div>
      }
      {!(data[data.length - 1] === answer) &&
        <div>
          Correct Answer: {answer}
          <br></br>
          Come back tomorrow for the next riddle
        </div>
      }
    </div> 
  )
}