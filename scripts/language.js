class Messages{
    constructor(language, hintGame, informedLetters, allWordsMessage, inputPlaceHolder, sendButton, newGame){
        this.language = language;
        this.hintGame = hintGame;
        this.informedLetters = informedLetters;
        this.allWordsMessage = allWordsMessage;
        this.inputPlaceHolder = inputPlaceHolder;
        this.sendButton = sendButton;
        this.newGame = newGame;
    }
}

const portuguese = new Messages("Jogue em Português", 
    "Caso informe uma palavra e ela estiver errada você perde o jogo.",
    "Letras informadas",
    "Finalizar o jogo somente quando acertar em todos o idiomas",
    "Informe uma letra ou a palavra SEM acento",
    "Enviar",
    "Novo");

const polish = new Messages("Graj po Polsku",
    "Jeśli wpiszesz słowo, które jest błędne, przegrywasz grę.",
    "Poinformowane listy", 
    "Zakończ grę tylko wtedy, gdy zrozumiesz ją poprawnie we wszystkich językach",
    "Wpisz literę lub słowo BEZ akcentu",
    "Wysłać",
    "Nowy");

const usa = new Messages("Play in English", 
    "In case you inform the wrong word, you lose the game.",
    "Informed letters", "Finish the game only when you get it right in all languages",
    "Inform a letter or a word WITHOUT an accent", "Send", "New");


function getLangMessages(choosedLang) {
    switch(choosedLang){
        case "langBR":
            return portuguese;
        case "langUS":
            return usa;
        case "langPL":
            return polish;
    }
}



function setTexts(choosedLang) {
    const lang = getLangMessages(choosedLang);
    setLanguage(lang);
    setLabelAllWords(lang);
    setHintGame(lang);
}

function setLanguage(lang){
    set("language", lang.language)
}

function setHintGame(lang) {
    const hint = `<ul><li>${lang.hintGame}.</li></ul>`;
    document.getElementById("hintGameImg").attributes["data-bs-content"].value = hint;
}


function setLabelAllWords(lang) {
    set("labelAllWords", lang.allWordsMessage);
}

function set(id, val){
    document.getElementById(id).innerText = val;
}