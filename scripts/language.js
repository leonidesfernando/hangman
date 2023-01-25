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

    getLetterAlreadyInformed(){
        return this.letterAlreadyInformed;
    }

    getDefeatMessage(){
        return this.defeatMessage;
    }

    getWinMessage() {
        return this.winMessage;
    }

    getWordWas(){
        return this.wordWas;
    }

    setMessages(){
        this.#setLanguage();
        this.#setLabelAllWords();
        this.#setHintGame();
        this.#setInputedLetters();
        this.#setInputPlaceHolder();
        this.#setBtnSend();
        this.#setBtnNew();
        this.#setBtnRestart();
    }
    
    #setBtnRestart() {
        this.#set("restart", this.restart);
    }

    #setBtnNew() {
        this.#set("btnNew", this.newGame)
    }

    #setBtnSend() {
        this.#set("btnSend", this.sendButton);
    }

    #setHintGame() {
        const hint = `<ul><li>${this.hintGame}</li></ul>`;
        this.#setAttr("hintGameImg", "data-bs-content", hint);
    }

    #setInputedLetters() {
        this.#set("inputedLettersTitle", this.informedLetters);
    }

    #setLanguage() {
        this.#set("language", this.language);
    }

    #setLabelAllWords() {
        this.#set("labelAllWords", this.allWordsMessage);
    }

    #setInputPlaceHolder() {
        this.#setAttr("inputLetterOrWord", "placeholder", this.inputPlaceHolder);
    }    

    #set(id, val) {
        document.getElementById(id).innerText = val;
    }

    #setAttr(id, attrName, val) {
        document.getElementById(id).attributes[attrName].value = val;
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

const langs = new Map();
langs.set("langBR", portuguese);
langs.set("langUS", usa);
langs.set("langPL", polish);


class LanguageManager{
    constructor(){}

    static getSelectedLanguage(){
        return document.querySelector('input[name="langOptions"]:checked').attributes["id"].value;
    }

    getLetterAlreadyInformed(){
        return this.#getLangMessages().getLetterAlreadyInformed();
    }

    getDefeatMessage(){
        return this.#getLangMessages().getDefeatMessage();
    }

    getWinMessage(){
        return this.#getLangMessages().getWinMessage();
    }

    getWordWas(){
        return this.#getLangMessages().getWordWas();
    }

    #getLangMessages() {
        const lang = LanguageManager.getSelectedLanguage();
        return langs.get(lang);
    }

    setTextsByLanguage() {
        const lang = this.#getLangMessages();
        lang.setMessages();

        //TODO: always the last one
        this.#setFocus();
    }

    #setFocus() {
        const input = document.getElementById('inputLetterOrWord');
        input.focus();
    }

}
