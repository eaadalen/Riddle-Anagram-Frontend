const fs = require('fs');

const generateWordBank = (validated_word) => {
    const content = String(validated_word) + ",";
    console.log(content)
    fs.appendFile('wordbank.txt', content, (err) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
    });
};

async function generateWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word")
    const response_json = await response.json()
    return response_json
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
            return String(response_json[0]["hwi"]["prs"][0]["sound"]["audio"])
        }
    } catch (error) {
    }
}

async function create_sound_URL(raw_word, soundID) {
    var sound_url = "https://media.merriam-webster.com/audio/prons/en/us/mp3/"  + raw_word[0].charAt(0) + "/" + soundID + ".mp3";
    console.log(sound_url)
    fetch(sound_url)
    .then(res => res.blob())
    .then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob);
        if (soundID != undefined) {
            generateWordBank(raw_word)
        }
    })
    .catch(err => {
        console.log(err)
        return 0
    })
}

async function getSound() {
    const random_word = await generateWord()
    const calc_soundID = await getSoundID(random_word)
    await create_sound_URL(random_word, calc_soundID)
    getSound()
};

getSound()