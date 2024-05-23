import "./play-view.scss"
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import checkmark from '../../../media/checkmark.svg';
import fire_0_3 from '../../../media/fire-0-3.png';
import fire_1_3 from '../../../media/fire-1-3.png';
import fire_2_3 from '../../../media/fire-2-3.png';
import fire_3_3 from '../../../media/giphy.gif';
import { Modal } from 'react-bootstrap'; 
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from 'react-bootstrap/Container';
import { Card } from "react-bootstrap";

export const PlayView = () => {
    const [spelling, setSpelling] = useState("")
    const [word, setWord] = useState("")
    const [sound, setSound] = useState()
    const [strikes, setStrikes] = useState(1)
    const [score, setScore] = useState(100)
    const [streak, setStreak] = useState(1)
    const [correctOpen, setCorrectOpen] = useState(false)
    const [incorrectOpen, setIncorrectOpen] = useState(false)
    const [fire_pic1, setfire_pic1] = useState(fire_0_3)
    const [fire_pic2, setfire_pic2] = useState(false)
    const [fire_pic3, setfire_pic3] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [localHighScore, setLocalHighScore] = useState("?");
    const [newHighScore, setNewHighScore] = useState(false);
    const [topScores, setTopScores] = useState();

    useEffect(() => {
      getSound()
      if (storedUser) {
        fetch(
          "https://spelling-game-ef1de28a171a.herokuapp.com/users/" + String(JSON.parse(storedUser).Username),
          {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
          }
        )
        .then((response) => response.json())
        .then((data) => {
          setLocalHighScore(data.highScore)
        })
      }
      fetch(
        "https://spelling-game-ef1de28a171a.herokuapp.com/users",
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
        }
      )
      .then((response) => response.json())
      .then((data) => {
        setTopScores(data.slice(0, 10))
      })
    }, [])

    async function generateValidatedWord() {
      const response = await fetch("https://spelling-game-ef1de28a171a.herokuapp.com/random")
      const response_json = await response.json()
      return response_json[0]["Spelling"]
    }
    
    async function getSoundID(random) {
      var dict_url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + random + "?key=aede8a6f-61af-4667-bd27-95b2786bca10";
      const response = await fetch(dict_url)
      const response_json = await response.json()
      try {
        var temp_word = response_json[0]["meta"]["id"]
        if (temp_word.includes("-") == false && 
            temp_word.includes(":") == false && 
            temp_word.includes(" ") == false && 
            /\d/.test(temp_word) == false) {
            setWord(String(response_json[0]["meta"]["id"]).toLowerCase())
            return String(response_json[0]["hwi"]["prs"][0]["sound"]["audio"])
        }
      } catch (error) {
        return undefined
      }
    }

    async function create_sound_URL(raw_word, soundID) {
      if (soundID != undefined) {
        var sound_url = "https://media.merriam-webster.com/audio/prons/en/us/mp3/"  + raw_word.charAt(0) + "/" + soundID + ".mp3";
        fetch(sound_url)
        .then(res => res.blob())
        .then((myBlob) => {
            const objectURL = URL.createObjectURL(myBlob);
            const newAudioURL = objectURL;
            var a = new Audio(newAudioURL);
            setSound(a);
        })
        .catch(err => {
          getSound()
        })
      }
    }

    async function getSound() {
      const random_word = await generateValidatedWord()
      const calc_soundID = await getSoundID(random_word)
      await create_sound_URL(random_word, calc_soundID)
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const playSound = () => {
      sound.play()
    }

    const setFire = (fire_streak) => {
      switch(fire_streak) {
        case 0:
          setfire_pic1(fire_0_3)
          setfire_pic2(false)
          setfire_pic3(false)
          break;
        case 1:
          setfire_pic1(fire_1_3)
          break;
        case 2:
          setfire_pic1(fire_2_3)
          break;
        case 3:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_0_3)
          break;
        case 4:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_1_3)
          break;
        case 5:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_2_3)
          break;
        case 6:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_3_3)
          setfire_pic3(fire_0_3)
          break;
        case 7:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_3_3)
          setfire_pic3(fire_1_3)
          break;
        case 8:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_3_3)
          setfire_pic3(fire_2_3)
          break;
        case 9:
          setfire_pic1(fire_3_3)
          setfire_pic2(fire_3_3)
          setfire_pic3(fire_3_3)
          break;
      }
    }

    const toggleModal = () => {  
      if (showModal == true) {
        setShowModal(false)
        location.reload()
      }
      else {
        setShowModal(true)
      }
    }  

    const playAgain = () => {
      location.reload();
    }

    const updateHighScore = () => {

      const data = {
        Username: String(JSON.parse(storedUser).Username),
        Password: String(JSON.parse(storedUser).Password),
        highScore: score - 100
      };

      fetch(
        "https://spelling-game-ef1de28a171a.herokuapp.com/users/" + String(JSON.parse(storedUser).Username),
        {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
        }
      )
      .then((response) => {
      })
    }

    async function handleSubmit(event) {
      event.preventDefault();
      if (spelling.toLowerCase() == word) {
        getSound();
        setCorrectOpen(true)
        if (streak < 4) {
          setScore(score + 100)
        }
        else if (streak >= 4 && streak < 7) {
          setScore(score + 200)
        }
        else if (streak >= 7 && streak < 10) {
          setScore(score + 300)
        }
        else {
          setScore(score + 500)
        }
        setStreak(streak + 1)
        setFire(streak)
        await sleep(1000)
        setCorrectOpen(false)
      }
      else {
        setStrikes(strikes + 1)
        setIncorrectOpen(true)
        setStreak(1)
        setFire(0)
        await sleep(1500)
        if (strikes <= 2) {
          getSound();
        }
        else {
          localStorage.setItem("localHighScore", score - 100);
          if (score - 100 > localHighScore) {
            if (user) {
              updateHighScore()
              setNewHighScore(true)
            }
          }
          toggleModal()
        }
        setIncorrectOpen(false)
      }
      setSpelling("")
    }

    document.body.onkeyup = function(e) {
      if (e.key == " " && strikes < 4) {
        sound.play()
      }
    }
    
    return (
      <div className="container">
          <div className="sub-container">
            <button className="button" onClick={playSound}>Play Sound</button>
            <div style={{fontSize: '0.75em', paddingTop: '0.25em'}}>or press space bar</div>
            <Form>
                <p></p>
                <div>
                  {correctOpen && 
                    <div className="correct">
                      <img src={checkmark} className="checkmark"/>
                    </div>
                  }
                  {incorrectOpen && 
                    <div className="incorrect">
                      <p className="checkmark">{word}</p>
                    </div>
                  }
                  {!correctOpen && !incorrectOpen &&
                    <Form.Group>
                      <Form.Control
                          autoFocus
                          type="text"
                          value={spelling}
                          onChange={(e) => setSpelling(e.target.value.replace(/\s/g, ''))}
                          placeholder="Start Typing..."
                      />
                    </Form.Group>
                  }
                </div>
                <p></p>
                <button className="button" onClick={handleSubmit}>Submit</button>
            </Form>
          </div>
          <div className="sub-container">
              <div className="counter">Score: {score-100}</div>
              <div className="counter">
                <div className="streak">Streak</div>
                <div>
                  {fire_pic1 && !fire_pic2 && !fire_pic3 &&
                    <div>
                      <img src={fire_pic1} height="30"/>
                    </div>
                  }
                  {fire_pic1 && fire_pic2 && !fire_pic3 &&
                    <div>
                      <img src={fire_pic1} height="30"/>
                      <img src={fire_pic2} height="30"/>
                    </div>
                  }
                  {fire_pic1 && fire_pic2 && fire_pic3 &&
                    <div>
                      <img src={fire_pic1} height="30"/>
                      <img src={fire_pic2} height="30"/>
                      <img src={fire_pic3} height="30"/>
                    </div>
                  }
                </div>
                </div>
              <div className="counter">Strikes: {strikes-1}</div>
          </div>
          <div>
              {showModal &&
                <Modal show={true} onHide={toggleModal} className="modal">  
                  <Modal.Body className="modalContainer">
                    <div className="modalSubContainer">
                      <div className="gameOver">
                        {newHighScore &&
                          <div className="bold">
                            New High Score!
                          </div>
                        }
                        {!newHighScore &&
                          <div className="bold">
                            Game Over!
                          </div>
                        }
                        <div>
                          Score: {score-100}
                        </div> 
                        <div>
                          High Score: {localHighScore}
                        </div>
                      </div>
                      <div className="playAgain">
                        <button className="button" onClick={playAgain}>Play Again?</button>
                      </div>
                    </div>
                    {!user &&
                        <Link to={`/login`}>
                          <div style={{fontSize: '0.75em', paddingTop: '0.75em'}}>
                            Log in to view/save high score
                          </div>
                        </Link>
                    }
                    <div className="bold">
                      Top 10 Leaderboard
                    </div>
                    <div>
                        {topScores.map((score) => (
                          <Row key={score._id}>
                            <Col>{score.Username}</Col>
                            <Col className="rightCol">{score.highScore}</Col>
                          </Row>
                          ))
                        }
                    </div>
                  </Modal.Body>  
                </Modal> 
              }
          </div> 
      </div>
    )
}