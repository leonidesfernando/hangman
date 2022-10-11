class Messages{
    constructor(language, hintGame, informedLetters, allWordsMessage, 
            inputPlaceHolder, sendButton, newGame, letterAlreadyInformed,
            wordWas, winMessage, defeatMessage,
            restart){
        this.language = language;
        this.hintGame = hintGame;
        this.informedLetters = informedLetters;
        this.allWordsMessage = allWordsMessage;
        this.inputPlaceHolder = inputPlaceHolder;
        this.sendButton = sendButton;
        this.newGame = newGame;
        this.letterAlreadyInformed = letterAlreadyInformed;
        this.wordWas = wordWas;
        this.winMessage = winMessage;
        this.defeatMessage = defeatMessage;
        this.restart = restart;
    }
}

const lettetInformed = "#letter#";

const portuguese = new Messages("Clique na bandeira para mudar o idioma", 
    "Caso informe uma palavra e ela estiver errada você perde o jogo.",
    "Letras informadas",
    "Finalizar o jogo somente quando acertar em todos o idiomas",
    "Informe uma letra ou a palavra SEM acento",
    "Enviar",
    "Novo",
    `A letra <i>${lettetInformed}</i> foi já informada`,
    "A palavra era:",
    "Parabéns!! Você conseguiu! Vamos mais uma rodada?",
    "Não foi dessa vez! Tente outra novamente, a prática te leva à perfeição!",
    "Jogar novamente");

const polish = new Messages("Kliknij flagę, aby zmienić język",
    "Jeśli wpiszesz słowo, które jest błędne, przegrywasz grę.",
    "Poinformowane listy", 
    "Zakończ grę tylko wtedy, gdy zrozumiesz ją poprawnie we wszystkich językach",
    "Wpisz literę lub słowo BEZ akcentu",
    "Wysłać",
    "Nowy",
    `Litera <i>${lettetInformed}</i> została już poinformowana`,
    "Słowo było:",
    "Gratulacje!! Masz to! Pojedziemy jeszcze jedną rundę?",
    "To nie było tym razem! Spróbuj jeszcze raz, praktyka czyni mistrza!",
    "Zagraj ponownie");

const usa = new Messages("Click on the flag to change the language", 
    "In case you inform the wrong word, you lose the game.",
    "Informed letters", 
    "Finish the game only when you get it right in all languages",
    "Inform a letter or a word WITHOUT an accent", 
    "Send", 
    "New",
    `The letter <i>${lettetInformed}</i> has already been informed`,
    "The word was:",
    "Congratulations!! You got it! Shall we go one more round?",
    "It was not this time! Try again, practice makes perfect!",
    "Play again");


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
    setInputedLetters(lang);
    setInputPlaceHolder(lang);
    setBtnSend(lang);
    setBtnNew(lang);
    setBtnRestart(lang);

    //TODO: always the last one
    setFocus();
}

function setBtnRestart(lang){
    set("restart", lang.restart);
}

function getWinMessage(choosedLang){
    const lang = getLangMessages(choosedLang);
    return lang.winMessage;
}

function getDefeatMessage(choosedLang){
    const lang = getLangMessages(choosedLang);
    return lang.defeatMessage;
}

function getWordWas(choosedLang){
    const lang = getLangMessages(choosedLang);
    return lang.wordWas;
}


function hideLetterAlreadyDisplayed() {
    document.getElementById("letterAlreadyInformedDiv").style.display = "none";
}


function displayLetterAlreadyInformedMessage(choosedLang, letter) {
    const lang = getLangMessages(choosedLang);
    const myTimeout = setTimeout(hideLetterAlreadyDisplayed, 4000);
    document.getElementById("letterAlreadyInformedDiv").style.display = "block";
    document.getElementById("letterAlreadyInformedText").innerHTML = lang.letterAlreadyInformed.replace("#letter#", letter.toUpperCase());

    return myTimeout;
    
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
    const hint = `<ul><li>${lang.hintGame}</li></ul>`;
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
