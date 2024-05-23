import { useState, useEffect } from "react";

export const TestView = () => {

    async function generateWord() {
        const response = await fetch("https://random-word-api.herokuapp.com/word")
        const response_json = await response.json()
        return response_json[0]
    }
    
    async function generateValidatedWord() {
      const response = await fetch("https://spelling-game-ef1de28a171a.herokuapp.com/random")
      const response_json = await response.json()
      return response_json[0]["Spelling"]
    }
    
    async function getAudioID(random) {
      var dict_url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + random + "?key=aede8a6f-61af-4667-bd27-95b2786bca10";
      const response = await fetch(dict_url)
      const response_json = await response.json()
      try {
        var temp_word = response_json[0]["meta"]["id"]
        if (temp_word.includes("-") == false && 
            temp_word.includes(":") == false && 
            temp_word.includes(" ") == false && 
            /\d/.test(temp_word) == false) {
            return [String(response_json[0]["hwi"]["prs"][0]["sound"]["audio"]), String(response_json[0]["meta"]["id"]).toLowerCase()]
        }
      } catch (error) {
        return undefined
      }
      
    }

    async function generateAudioObject(raw_word, soundID) {
        var sound_url = "https://media.merriam-webster.com/audio/prons/en/us/mp3/"  + raw_word.charAt(0) + "/" + soundID + ".mp3";
        //var sound_url = "https://media.merriam-webster.com/audio/prons/en/us/mp3/"  + "f" + "/" + "fruity01" + ".mp3";
        var newAudioURL = null
        var a = null
        await fetch(sound_url)
        .then(res => res.blob())
        .then((myBlob) => {
            newAudioURL = URL.createObjectURL(myBlob)
            a = new Audio(newAudioURL)
        })
        .catch(error => {
            a = undefined
        })
        return a
    }

    async function getSound() {
      const random_word = await generateWord()
      const calc_soundID = await getAudioID(random_word)
      try {
        if (calc_soundID[0] != undefined) {
            const audioObject = await generateAudioObject(random_word, calc_soundID[0])
            return [audioObject, calc_soundID[1]]
          }
      }
      catch {
        // do nothing
      }
    }

    async function playSound() {
      var i = 0
      var audio = null
      while (i < 10000) {
        await getSound().then(response => audio = response)
        try {
            //console.log("audio[0]: " + String(audio[0]) + " audio[1]: " + String(audio[1]))
            if (audio[0] != undefined) {
                generateWordBank(audio[1])
            }
        }
        catch {
            // do nothing
        }
        i = i + 1
        audio = false
      }
    }

    const generateWordBank = (validated_word) => {

        const data = {
          Spelling: validated_word
        }

        console.log(data)
        
        fetch(
          "https://spelling-game-ef1de28a171a.herokuapp.com/words",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        )
    }

    var audio = null

    document.addEventListener("keypress", (event) => {
      getSound().then(response => audio = response)
      try {
          console.log("audio[0]: " + String(audio[0]) + " audio[1]: " + String(audio[1]))
          audio[0].play()
      }
      catch {
          // do nothing
      }
    });
    
    return (
      <div className="container">
          <button className="button" onClick={playSound}>Play Sound</button>
      </div>
    )
}