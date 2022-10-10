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

const portuguese = new Messages("Clique na bandeira para mudar o idioma", 
    "Caso informe uma palavra e ela estiver errada você perde o jogo.",
    "Letras informadas",
    "Finalizar o jogo somente quando acertar em todos o idiomas",
    "Informe uma letra ou a palavra SEM acento",
    "Enviar",
    "Novo");

const polish = new Messages("Kliknij flagę, aby zmienić język",
    "Jeśli wpiszesz słowo, które jest błędne, przegrywasz grę.",
    "Poinformowane listy", 
    "Zakończ grę tylko wtedy, gdy zrozumiesz ją poprawnie we wszystkich językach",
    "Wpisz literę lub słowo BEZ akcentu",
    "Wysłać",
    "Nowy");

const usa = new Messages("Click on the flag to change the language", 
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


async function setTexts(choosedLang) {
    const lang = getLangMessages(choosedLang);
    setLanguage(lang);
    setLabelAllWords(lang);
    setHintGame(lang);
    setInputedLetters(lang);
    setInputPlaceHolder(lang);
    setBtnSend(lang);
    setBtnNew(lang);

    //TODO: always the last one
    //document.getElementById('inputLetterOrWord').focus();
    setFocus();
}

function setBtnNew(lang){
    set("btnNew", lang.newGame)
}

function setBtnSend(lang){
    set("btnSend", lang.sendButton);
}

function setInputPlaceHolder(lang){
    setAttr("inputLetterOrWord", "placeholder", lang.inputPlaceHolder);
}

function setInputedLetters(lang){
    set("inputedLettersTitle", lang.informedLetters);
}

function setLanguage(lang){
    set("language", lang.language)
}

function setHintGame(lang) {
    const hint = `<ul><li>${lang.hintGame}.</li></ul>`;
    setAttr("hintGameImg", "data-bs-content", hint);
}


function setLabelAllWords(lang) {
    set("labelAllWords", lang.allWordsMessage);
}

function set(id, val){
    document.getElementById(id).innerText = val;
}

function setAttr(id, attrName, val){
    document.getElementById(id).attributes[attrName].value = val;
}
