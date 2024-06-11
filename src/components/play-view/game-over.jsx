import "./game-over.css"
import { useState, useEffect } from "react";

export default GameOver = ({ data }) => {
  return (
    <div>
      {(data === 'correct') &&
        <div>
          Correct!
          <br></br>
          Come back tomorrow for the next riddle
        </div>
      }
      {!(data === 'correct') &&
        <div>
          Correct Answer: {data}
          <br></br>
          Come back tomorrow for the next riddle
        </div>
      }
    </div> 
  )
}