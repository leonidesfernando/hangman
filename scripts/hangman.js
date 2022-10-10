const data =  JSON.parse(getDatabaseNew());
const word = generateWord();
const TOTAL = 7;
const LAST_IMAGE = 'img/7.png';

function start(){
    console.log('no start: ', word);

    generateTables(word);
    setFocus();
}

function setFocus(){
    const input = document.getElementById('inputLetterOrWord');
    input.focus();
}

function restart(){
    location.reload()
}

function check(){

    const input = document.getElementById('inputLetterOrWord');
    const letter = input.value.trim().toLowerCase();
    const inputedLetters = document.getElementById('inputedLetters');
    

    if(inputedLetters.innerHTML != undefined && inputedLetters.innerHTML.lastIndexOf(letter.toUpperCase()) > -1){
        return;
    }
    
    disableHowToFinalizeTheGame();
    checkLetterOrWord(inputedLetters, letter);
    input.focus();
    input.value = '';

    checkIfWinOrLose();
}

function disableHowToFinalizeTheGame(){
    document.getElementById("allWords").disabled = true;
}

function checkIfWinOrLose(){
    const allWords = document.getElementById('allWords');
    const hasChance = parseInt(getCurrentImageStatus()) < TOTAL;
    if(allWords.checked){
        checkWinOrLoseWithAllWordsFilledOut(hasChance);
    }else{
        checkWinOrLoseOnlyOneWordIsEnough(hasChance);
    }
}

function checkWinOrLoseWithAllWordsFilledOut(hasChance){
    if(!hasChance){
        hideInputAndDisplayRestart();
        youLose();
    }
    else if(ifWinWithAllWords()){
        hideInputAndDisplayRestart();
        youWin();
    }
}

function ifWinWithAllWords(){
    for(let w in word){
        const lenByLang = parseInt(word[w].original.length)
        for(let i = 0; i < lenByLang; i++){
            if(getInputTableContent(word[w], i) == ''){
                return false;
            }
        }
    }
    return true;
}

function hideInputAndDisplayRestart(){
    document.getElementById('sendData').style = 'display: none';
    document.getElementById('restart').style = '';
}

function checkWinOrLoseOnlyOneWordIsEnough(hasChance){
    
    if (!hasChance) {
        hideInputAndDisplayRestart();
        youLose();
    }

    else if (ifWin()) {
        hideInputAndDisplayRestart();
        youWin();
    }
}

function checkLetterOrWord(inputedLetters, letter){
    let img = document.getElementById('playerStatus');
    let hasTheLetter = false;
    if (letter.length == 1 && !hasLetter(letter)) {
        console.log(getCurrentImageStatus());
        img.src = getNextImageName();
    } else if (letter.length > 1) {
        let size = letter.length;
        let matchAll = true;
        for (let i = 0; i < size; i++) {
            if (!hasLetter(letter.charAt(i))) {
                matchAll = false;
            }
        }

        if (!matchAll) {
            img.src = LAST_IMAGE;
        }

        hasTheLetter = matchAll;

    } else if (hasLetter(letter.toLowerCase())) {
        hasTheLetter = true;
    }
    chooseColor(hasTheLetter, inputedLetters, letter);
}

function chooseColor(hasTheLetter, inputedLetters, letter){
    let label = document.createElement('label');
    label.innerHTML = letter.toUpperCase();
    label.setAttribute('style', 'color:' + (hasTheLetter ? 'lightblue' : 'red'));
    inputedLetters.appendChild(label)
    inputedLetters.innerHTML = inputedLetters.innerHTML + ', ';
}

function ifWin(){
    let filedOutAnyWord = true;
    for(let w in word){
        filedOutAnyWord = true;
        
        const lenByLang = parseInt(word[w].original.length)
        for(let i = 0; i < lenByLang; i++){
            if(getInputTableContent(word[w], i) == ''){
                filedOutAnyWord = false;
                break;
            }
        }
        if(filedOutAnyWord){
            break
        }
    }
    return filedOutAnyWord;
}

function youWin(){

    for(let w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(let i = 0; i < lengWord; i++){
            updateTableWithLetter(word[w], i)
        }
    }
    showFinalMessage('Parabéns!! Você conseguiu! Vamos mais uma rodada?', document.getElementById('resultWin'))
}

function youLose(){

    let table = "<table><tr>";
    let langs = ""
    let hint = '<label>A palavara era:</label> <ul>';
    
    for (let w in word) {
        langs += `<td><a href='#'> <img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/> </a></td>`
        hint += `<li><img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/>: ${word[w].original}</li>`;
    }
    hint += '</ul>';
    table += langs + "</tr></table>";
    showFinalMessage( hint + '<label class="fw-bold">Não foi dessa vez! Tente outra novamente, a prática te leva à perfeição!</label>',
    	   document.getElementById('resultLose'));
}

function showFinalMessage(msg, result){
    const div  = document.createElement('div')
    div.setAttribute('style', 'margin: 10px')
    result.appendChild(div)
    div.innerHTML = msg;
    result.style=""
}

function generateWord(){
    //TODO: criar cookie com local data, hora  milisegundo e armezenar os indices gerados e desconsiderar esses indices para pegar uma nova palavra
    const len = data.words.length
    console.log('len:', len)
    const index = Math.floor(Math.random() * len);
    console.log('index:', index)
    return data.words[index].word
}

function hasLetter(letter){
    
    let hasAnyLetter = false

    for(let w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(let i = 0; i < lengWord; i++){
            const char = word[w].canonical.charAt(i)
            if(char == letter){
                updateTableWithLetter(word[w], i)
                hasAnyLetter = true
            }
        }
    }
    return hasAnyLetter
}

function getInputTableContent(wordLang, index){
    return document.getElementById(`${wordLang.lang}RowLetter${index}`).value
}

function updateTableWithLetter(wordLang, index){
    const item = document.getElementById(`${wordLang.lang}RowLetter${index}`);
    item.value = wordLang.original.charAt(index).toUpperCase();
    item.style['background'] = 'lightcyan';
}

function generateTables(word){
    
    const colspan = getSizeLargestWord(word)
    for(let w in word){
        generateTableByLanguage(word[w].lang, word[w].original, colspan);
    }
    generateHints(word);
}

function getSizeLargestWord(word){
    let smallest = 0;
    let biggest = 0;
    for (let w in word) {
        if (biggest < word[w].canonical.length){
            biggest = word[w].canonical.length;
        }
        if (smallest > word[w].canonical.length){
            smallest = word[w].canonical.length;
        }
    }
    return biggest - smallest;
}

function generateHints(word) {
    let hint = '<ul>';
    const img = document.getElementById('hint');
    for (const w in word) {
        hint += `<li><img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/>: ${word[w].hint}</li>`;
    }
    hint += '</ul>';
    img.setAttribute('data-bs-content', hint);
}

function getImageByLanguage(lang){
    switch(lang){
        case 'pt':
            return 'img/brazil.png';
        case 'pl':
            return 'img/poland.png';
        case 'us':
            return 'img/usa.png'
    }
}


function generateTableByLanguage(language, orignalWord, colspan){
    let len = orignalWord.length

    const row = document.getElementById(`${language}Row`);
    let td;
    for(let i = 0; i < len; i++){
        td = document.createElement('td');
        
        const input = document.createElement( orignalWord.charAt(i) == ' ' ? 'span' : 'input');
        configureInput(input, language, i);
        td.appendChild(input);
        row.appendChild(td);
    }
    td.setAttribute('colspan', colspan);
}


function configureInput(input, language, index){
    input.setAttribute('id', `${language}RowLetter${index}`);
    input.setAttribute('size', 1);
    input.setAttribute('maxlength', 1);
    input.setAttribute('class', 'text-center');
    input.setAttribute('disabled',true);
    input.setAttribute('style', 'border-bottom: 4px solid; font-weight: bold;');
}

function getNextImageName(){
    let number = parseInt(getCurrentImageStatus());
    if(number < TOTAL){
        number++;
    }
    return `img/${number}.png`

}

function getCurrentImageStatus(){
    const img = document.getElementById('playerStatus')
    return img.src.substring(img.src.lastIndexOf('/')+1).split('.')[0];
}

//


function getDatabase() {

    return `{"words":[{"word":[{"original":"carne","canonical":"carne","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"meat","canonical":"meat","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"NO_HINT_TOO_EASY","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"duck","canonical":"duck","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"NO_HINT_TOO_EASY","lang":"pl"}]}]}`;
}

function getDatabaseNew() {
    return `{"words":[{"word":[{"original":"banana","canonical":"banana","hint":"É uma fruta","lang":"pt"},{"original":"banana","canonical":"banana","hint":"It\u0027s a fruit","lang":"us"},{"original":"banan","canonical":"banan","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"uva","canonical":"uva","hint":"É uma fruta","lang":"pt"},{"original":"grape","canonical":"grape","hint":"It\u0027s a fruit","lang":"us"},{"original":"winogrono","canonical":"winogrono","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"melancia","canonical":"melancia","hint":"É uma fruta","lang":"pt"},{"original":"watermelon","canonical":"watermelon","hint":"It\u0027s a fruit","lang":"us"},{"original":"arbus","canonical":"arbus","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"morango","canonical":"morango","hint":"É uma fruta","lang":"pt"},{"original":"strawberry","canonical":"strawberry","hint":"It\u0027s a fruit","lang":"us"},{"original":"truskawka","canonical":"truskawka","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"laranja","canonical":"laranja","hint":"É uma fruta","lang":"pt"},{"original":"orange","canonical":"orange","hint":"It\u0027s a fruit","lang":"us"},{"original":"pomarańcza","canonical":"pomarancza","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"pêssego","canonical":"pessego","hint":"É uma fruta","lang":"pt"},{"original":"peach","canonical":"peach","hint":"It\u0027s a fruit","lang":"us"},{"original":"brzoskwinia","canonical":"brzoskwinia","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"maçã","canonical":"maca","hint":"É uma fruta","lang":"pt"},{"original":"apple","canonical":"apple","hint":"It\u0027s a fruit","lang":"us"},{"original":"jabłko","canonical":"jablko","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"framboesa","canonical":"framboesa","hint":"É uma fruta","lang":"pt"},{"original":"raspberry","canonical":"raspberry","hint":"It\u0027s a fruit","lang":"us"},{"original":"malina","canonical":"malina","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"kiwi","canonical":"kiwi","hint":"É uma fruta","lang":"pt"},{"original":"kiwi","canonical":"kiwi","hint":"It\u0027s a fruit","lang":"us"},{"original":"kiwi","canonical":"kiwi","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"abacaxi","canonical":"abacaxi","hint":"É uma fruta","lang":"pt"},{"original":"pineappe","canonical":"pineapple","hint":"It\u0027s a fruit","lang":"us"},{"original":"ananas","canonical":"ananas","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"pêra","canonical":"pera","hint":"É uma fruta","lang":"pt"},{"original":"pear","canonical":"pear","hint":"It\u0027s a fruit","lang":"us"},{"original":"gruszka","canonical":"gruszka","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"bola","canonical":"bola","hint":"É um brinquedo","lang":"pt"},{"original":"piłka","canonical":"pilka","hint":"It\u0027s a toy","lang":"us"},{"original":"ball","canonical":"ball","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"brinquedo","canonical":"brinquedo","hint":"É um brinquedo","lang":"pt"},{"original":"toy","canonical":"toy","hint":"It\u0027s a toy","lang":"us"},{"original":"zabawka","canonical":"zabawka","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"caderno","canonical":"caderno","hint":"Usado para estudar","lang":"pt"},{"original":"notebook","canonical":"notebook","hint":"Used to study","lang":"us"},{"original":"notes","canonical":"notes","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"borracha","canonical":"borracha","hint":"Usado para estudar","lang":"pt"},{"original":"rubber","canonical":"rubber","hint":"Used to study","lang":"us"},{"original":"gumka","canonical":"gumka","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"caneta","canonical":"caneta","hint":"Usado para estudar","lang":"pt"},{"original":"pen","canonical":"pen","hint":"Used to study","lang":"us"},{"original":"długopis","canonical":"dlugopis","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"lápis","canonical":"lapis","hint":"Usado para estudar","lang":"pt"},{"original":"pencil","canonical":"pencil","hint":"Used to study","lang":"us"},{"original":"ołówek","canonical":"olowek","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"régua","canonical":"regua","hint":"Usado para estudar","lang":"pt"},{"original":"ruler","canonical":"ruler","hint":"Used to study","lang":"us"},{"original":"linijka","canonical":"linijka","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"quadro branco","canonical":"quadro branco","hint":"Usado para estudar","lang":"pt"},{"original":"whiteboard","canonical":"whiteboard","hint":"Used to study","lang":"us"},{"original":"tablica","canonical":"tablica","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"clip","canonical":"","hint":"Usado para estudar","lang":"pt"},{"original":"paper clip","canonical":"paperclip","hint":"Used to study","lang":"us"},{"original":"spinacz","canonical":"spinacz","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"calculadora","canonical":"calculadora","hint":"Usado para estudar","lang":"pt"},{"original":"calculator","canonical":"calculator","hint":"Used to study","lang":"us"},{"original":"kalkulator","canonical":"kalkulator","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"diploma","canonical":"diploma","hint":"Usado para estudar","lang":"pt"},{"original":"diploma","canonical":"diploma","hint":"Used to study","lang":"us"},{"original":"dyplom","canonical":"dyplom","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"carne","canonical":"carne","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"meat","canonical":"meat","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"carne","canonical":"carne","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"meat","canonical":"meat","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"maçã","canonical":"maca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"apple","canonical":"apple","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"jabłko","canonical":"jablko","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"café","canonical":"cafe","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"coffee","canonical":"coffee","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kawa","canonical":"kawa","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cebola","canonical":"cebola","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"onion","canonical":"onion","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"cebula","canonical":"cebula","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cenoura","canonical":"cenoura","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"carrot","canonical":"carrot","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"marchew","canonical":"marchew","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"computador","canonical":"computador","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"computer","canonical":"computer","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"komputer","canonical":"komputer","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"caneca","canonical":"caneca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"mug","canonical":"mug","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kubek","canonical":"kubek","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"animal","canonical":"animal","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"animal","canonical":"animal","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"zwierzę","canonical":"zwierze","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"mãe","canonical":"mae","hint":"Minha família","lang":"pt"},{"original":"mother","canonical":"mother","hint":"My family","lang":"us"},{"original":"matka","canonical":"matka","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"pai","canonical":"pai","hint":"Minha família","lang":"pt"},{"original":"father","canonical":"father","hint":"My family","lang":"us"},{"original":"ojciec","canonical":"ojciec","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"filho","canonical":"filho","hint":"Minha família","lang":"pt"},{"original":"son","canonical":"son","hint":"My family","lang":"us"},{"original":"syn","canonical":"syn","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"filha","canonical":"filha","hint":"Minha família","lang":"pt"},{"original":"daughter","canonical":"daughter","hint":"My family","lang":"us"},{"original":"córka","canonical":"corka","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"irmã","canonical":"irma","hint":"Minha família","lang":"pt"},{"original":"sister","canonical":"sister","hint":"My family","lang":"us"},{"original":"siostra","canonical":"siostra","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"irmão","canonical":"irmao","hint":"Minha família","lang":"pt"},{"original":"brother","canonical":"brother","hint":"My family","lang":"us"},{"original":"brat","canonical":"brat","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"avô","canonical":"avo","hint":"Minha família","lang":"pt"},{"original":"grandfather","canonical":"grandfather","hint":"My family","lang":"us"},{"original":"dziadek","canonical":"dziadek","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"avó","canonical":"avo","hint":"Minha família","lang":"pt"},{"original":"grandmother","canonical":"grandmother","hint":"My family","lang":"us"},{"original":"babcia","canonical":"babcia","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"marido","canonical":"marido","hint":"Minha família","lang":"pt"},{"original":"husband","canonical":"husband","hint":"My family","lang":"us"},{"original":"mąż","canonical":"maz","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"esposa","canonical":"esposa","hint":"Minha família","lang":"pt"},{"original":"wife","canonical":"wife","hint":"My family","lang":"us"},{"original":"żona","canonical":"zona","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"pais","canonical":"pais","hint":"Minha família","lang":"pt"},{"original":"parents","canonical":"parents","hint":"My family","lang":"us"},{"original":"rodzice","canonical":"rodzice","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"primo","canonical":"primo","hint":"Minha família","lang":"pt"},{"original":"cousin","canonical":"cousin","hint":"My family","lang":"us"},{"original":"kuzyn","canonical":"kuzyn","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"sobrinho","canonical":"sobrinho","hint":"Minha família","lang":"pt"},{"original":"nephew","canonical":"nephew","hint":"My family","lang":"us"},{"original":"siostrzeniec","canonical":"siostrzeniec","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"tio","canonical":"tio","hint":"Minha família","lang":"pt"},{"original":"uncle","canonical":"uncle","hint":"My family","lang":"us"},{"original":"wujek","canonical":"wujek","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"tia","canonical":"tia","hint":"Minha família","lang":"pt"},{"original":"aunt","canonical":"aunt","hint":"My family","lang":"us"},{"original":"ciocia","canonical":"ciocia","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"padrinho","canonical":"padrinho","hint":"Minha família","lang":"pt"},{"original":"godfather","canonical":"godfather","hint":"My family","lang":"us"},{"original":"ojciec chrzestny","canonical":"ojciec chrzestny","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"madrinha","canonical":"madrinha","hint":"Minha família","lang":"pt"},{"original":"godmother","canonical":"godmother","hint":"My family","lang":"us"},{"original":"matka chrzestna","canonical":"matka chrzestna","hint":"Moja rodzina","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"É um animal","lang":"pt"},{"original":"duck","canonical":"duck","hint":"It\u0027s an animal","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"leão","canonical":"leao","hint":"É um animal","lang":"pt"},{"original":"lion","canonical":"lion","hint":"It\u0027s an animal","lang":"us"},{"original":"lew","canonical":"lew","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"cachorro","canonical":"cachorro","hint":"É um animal","lang":"pt"},{"original":"dog","canonical":"dog","hint":"It\u0027s an animal","lang":"us"},{"original":"pies","canonical":"pies","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"gato","canonical":"gato","hint":"É um animal","lang":"pt"},{"original":"cat","canonical":"cat","hint":"It\u0027s an animal","lang":"us"},{"original":"kot","canonical":"kot","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"cavalo","canonical":"cavalo","hint":"É um animal","lang":"pt"},{"original":"horse","canonical":"horse","hint":"It\u0027s an animal","lang":"us"},{"original":"koń","canonical":"kon","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"peixe","canonical":"peixe","hint":"É um animal","lang":"pt"},{"original":"fish","canonical":"fish","hint":"It\u0027s an animal","lang":"us"},{"original":"ryba","canonical":"ryba","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"pássaro","canonical":"passaro","hint":"É um animal","lang":"pt"},{"original":"brid","canonical":"bird","hint":"It\u0027s an animal","lang":"us"},{"original":"ptak","canonical":"ptak","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"rato","canonical":"rato","hint":"É um animal","lang":"pt"},{"original":"mouse","canonical":"mouse","hint":"It\u0027s an animal","lang":"us"},{"original":"mysz","canonical":"mysz","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"coelho","canonical":"coelho","hint":"É um animal","lang":"pt"},{"original":"rabbit","canonical":"rabbit","hint":"It\u0027s an animal","lang":"us"},{"original":"królik","canonical":"krolik","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"porco","canonical":"porco","hint":"É um animal","lang":"pt"},{"original":"pig","canonical":"pig","hint":"It\u0027s an animal","lang":"us"},{"original":"świnia","canonical":"swinia","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"vaca","canonical":"vaca","hint":"É um animal","lang":"pt"},{"original":"cow","canonical":"cow","hint":"It\u0027s an animal","lang":"us"},{"original":"krowa","canonical":"krowa","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"É um animal","lang":"pt"},{"original":"duck","canonical":"duck","hint":"It\u0027s an animal","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"peru","canonical":"peru","hint":"É um animal","lang":"pt"},{"original":"turkey","canonical":"turkey","hint":"It\u0027s an animal","lang":"us"},{"original":"indyk","canonical":"indyk","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"ovelha","canonical":"ovelha","hint":"É um animal","lang":"pt"},{"original":"sheep","canonical":"sheep","hint":"It\u0027s an animal","lang":"us"},{"original":"owca","canonical":"owca","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"pão","canonical":"pao","hint":"É de comer","lang":"pt"},{"original":"bread","canonical":"bread","hint":"It\u0027s food","lang":"us"},{"original":"chleb","canonical":"chleb","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"ovo","canonical":"ovo","hint":"É de comer","lang":"pt"},{"original":"egg","canonical":"egg","hint":"It\u0027s food","lang":"us"},{"original":"jajko","canonical":"jajko","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"queijo","canonical":"queijo","hint":"É de comer","lang":"pt"},{"original":"cheese","canonical":"cheese","hint":"It\u0027s food","lang":"us"},{"original":"ser","canonical":"ser","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"macarrão","canonical":"macarrao","hint":"É de comer","lang":"pt"},{"original":"pasta","canonical":"pasta","hint":"It\u0027s food","lang":"us"},{"original":"makaron","canonical":"makaron","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"leite","canonical":"leite","hint":"É de comer","lang":"pt"},{"original":"milk","canonical":"milk","hint":"It\u0027s food","lang":"us"},{"original":"mleko","canonical":"mleko","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"peixe","canonical":"peixe","hint":"É de comer","lang":"pt"},{"original":"fish","canonical":"fish","hint":"It\u0027s food","lang":"us"},{"original":"ryba","canonical":"ryba","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"sopa","canonical":"sopa","hint":"É de comer","lang":"pt"},{"original":"soup","canonical":"soup","hint":"It\u0027s food","lang":"us"},{"original":"zupa","canonical":"zupa","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"cogumelo","canonical":"cogumelo","hint":"É de comer","lang":"pt"},{"original":"mushroom","canonical":"mushroom","hint":"It\u0027s food","lang":"us"},{"original":"grzyb","canonical":"grzyb","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"manteiga","canonical":"manteiga","hint":"É de comer","lang":"pt"},{"original":"butter","canonical":"butter","hint":"It\u0027s food","lang":"us"},{"original":"masło","canonical":"maslo","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"presunto","canonical":"presunto","hint":"É de comer","lang":"pt"},{"original":"ham","canonical":"ham","hint":"It\u0027s food","lang":"us"},{"original":"szynka","canonical":"szynka","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"salmão","canonical":"salmao","hint":"É de comer","lang":"pt"},{"original":"salmon","canonical":"salmon","hint":"It\u0027s food","lang":"us"},{"original":"łosoś","canonical":"losos","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"arroz","canonical":"arroz","hint":"É de comer","lang":"pt"},{"original":"rice","canonical":"rice","hint":"It\u0027s food","lang":"us"},{"original":"ryż","canonical":"ryz","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"feijão","canonical":"feijao","hint":"É de comer","lang":"pt"},{"original":"beans","canonical":"beans","hint":"It\u0027s food","lang":"us"},{"original":"fasola","canonical":"fasola","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"cadeira","canonical":"cadeira","hint":"É um móvel(mobilia)","lang":"pt"},{"original":"chair","canonical":"chair","hint":"It\u0027s a furniture","lang":"us"},{"original":"krzesło","canonical":"krzeslo","hint":"To jest meble","lang":"pl"}]},{"word":[{"original":"um","canonical":"um","hint":"É um número.","lang":"pt"},{"original":"one","canonical":"one","hint":"It´s a number.","lang":"us"},{"original":"jeden","canonical":"jeden","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"dois","canonical":"dois","hint":"É um número.","lang":"pt"},{"original":"two","canonical":"two","hint":"It´s a number.","lang":"us"},{"original":"dwa","canonical":"dwa","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"três","canonical":"tres","hint":"É um número.","lang":"pt"},{"original":"three","canonical":"three","hint":"It´s a number.","lang":"us"},{"original":"trzy","canonical":"trzy","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"quatro","canonical":"quatro","hint":"É um número.","lang":"pt"},{"original":"four","canonical":"four","hint":"It´s a number.","lang":"us"},{"original":"cztery","canonical":"cztery","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"cinco","canonical":"cinco","hint":"É um número.","lang":"pt"},{"original":"five","canonical":"five","hint":"It´s a number.","lang":"us"},{"original":"pięć","canonical":"piec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"seis","canonical":"seis","hint":"É um número.","lang":"pt"},{"original":"six","canonical":"six","hint":"It´s a number.","lang":"us"},{"original":"sześć","canonical":"szesc","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"sete","canonical":"sete","hint":"É um número.","lang":"pt"},{"original":"seven","canonical":"seven","hint":"It´s a number.","lang":"us"},{"original":"siedem","canonical":"siedem","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"oito","canonical":"oito","hint":"É um número.","lang":"pt"},{"original":"eight","canonical":"eight","hint":"It´s a number.","lang":"us"},{"original":"osiem","canonical":"osiem","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"nove","canonical":"nove","hint":"É um número.","lang":"pt"},{"original":"nine","canonical":"nine","hint":"It´s a number.","lang":"us"},{"original":"dziewięć","canonical":"dziewiec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"dez","canonical":"dez","hint":"É um número.","lang":"pt"},{"original":"ten","canonical":"ten","hint":"It´s a number.","lang":"us"},{"original":"dziesięć","canonical":"dziesiec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"repolho","canonical":"repolho","hint":"É um vegetal","lang":"pt"},{"original":"cabage","canonical":"cabage","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kapusta","canonical":"kapusta","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"salsinha","canonical":"salsinha","hint":"É um vegetal","lang":"pt"},{"original":"parsley","canonical":"parsley","hint":"It\u0027s a vegetable","lang":"us"},{"original":"pietruszka","canonical":"pietruszka","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"coentro","canonical":"coentro","hint":"É um vegetal","lang":"pt"},{"original":"cilantro","canonical":"cilantro","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kolendra","canonical":"kolendra","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"pepino","canonical":"pepino","hint":"É um vegetal","lang":"pt"},{"original":"cucumber","canonical":"cucumber","hint":"It\u0027s a vegetable","lang":"us"},{"original":"ogórek","canonical":"ogorek","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"abóbora","canonical":"abobora","hint":"É um vegetal","lang":"pt"},{"original":"pumpkin","canonical":"pumpkin","hint":"It\u0027s a vegetable","lang":"us"},{"original":"dynia","canonical":"dynia","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"abobrinha","canonical":"abobrinha","hint":"É um vegetal","lang":"pt"},{"original":"zucchini","canonical":"zucchini","hint":"It\u0027s a vegetable","lang":"us"},{"original":"cukinia","canonical":"cukinia","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"pimentão","canonical":"pimentao","hint":"É um vegetal","lang":"pt"},{"original":"bell pepper","canonical":"bell pepper","hint":"It\u0027s a vegetable","lang":"us"},{"original":"papryka","canonical":"papryka","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"milho","canonical":"milho","hint":"É um vegetal","lang":"pt"},{"original":"corn","canonical":"corn","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kukurydza","canonical":"kukurydza","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"beringela","canonical":"beringela","hint":"É um vegetal","lang":"pt"},{"original":"eggplant","canonical":"eggplant","hint":"It\u0027s a vegetable","lang":"us"},{"original":"bakłażan","canonical":"bakłażan","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"batata","canonical":"batata","hint":"É um vegetal","lang":"pt"},{"original":"potato","canonical":"potato","hint":"It\u0027s a vegetable","lang":"us"},{"original":"ziemniak","canonical":"ziemniak","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"beterraba","canonical":"beterraba","hint":"É um vegetal","lang":"pt"},{"original":"beetroot","canonical":"beetroot","hint":"It\u0027s a vegetable","lang":"us"},{"original":"burak czerwony","canonical":"burak czerwony","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"faca","canonical":"faca","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"knife","canonical":"knife","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"nóż","canonical":"noz","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"garfo","canonical":"garfo","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"fork","canonical":"fork","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"widelec","canonical":"widelec","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"colher","canonical":"colher","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"spoon","canonical":"spoon","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"łyżka","canonical":"lyzka","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"forno","canonical":"forno","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"oven","canonical":"oven","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"piekarnik","canonical":"piekarnik","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"geladeira","canonical":"geladeira","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"fridge","canonical":"fridge","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"lodówka","canonical":"lodówka","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"chaleira","canonical":"chaleira","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"kettle","canonical":"kettle","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"czajnik","canonical":"czajnik","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"prato","canonical":"prato","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"plate","canonical":"plate","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"talerz","canonical":"talerz","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"fogão","canonical":"fogao","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"sotve","canonical":"stove","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"kuchenka","canonical":"kuchenka","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"freezer","canonical":"freezer","hint":"Pode ser um utensílio de cozinha ou eletrodroméstico","lang":"pt"},{"original":"freezer","canonical":"freezer","hint":"Can be a kitchen utensils or a home appliances","lang":"us"},{"original":"zamrażarka","canonical":"zamrazarka","hint":"Może być przyborami kuchennymi lub sprzętem AGD","lang":"pl"}]},{"word":[{"original":"branco","canonical":"branco","hint":"É uma cor.","lang":"pt"},{"original":"white","canonical":"white","hint":"It´s a color.","lang":"us"},{"original":"biały","canonical":"bialy","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"preto","canonical":"preto","hint":"É uma cor.","lang":"pt"},{"original":"black","canonical":"black","hint":"It´s a color.","lang":"us"},{"original":"czarny","canonical":"czarny","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"amarelo","canonical":"amarelo","hint":"É uma cor.","lang":"pt"},{"original":"yellow","canonical":"yellow","hint":"It´s a color.","lang":"us"},{"original":"żółty","canonical":"zolty","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"azul","canonical":"azul","hint":"É uma cor.","lang":"pt"},{"original":"blue","canonical":"blue","hint":"It´s a color.","lang":"us"},{"original":"niebieski","canonical":"niebieski","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"verde","canonical":"verde","hint":"É uma cor.","lang":"pt"},{"original":"green","canonical":"green","hint":"It´s a color.","lang":"us"},{"original":"zielony","canonical":"zielony","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"vermelho","canonical":"vermelho","hint":"É uma cor.","lang":"pt"},{"original":"red","canonical":"red","hint":"It´s a color.","lang":"us"},{"original":"czerwony","canonical":"czerwony","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"laranja","canonical":"laranja","hint":"É uma cor.","lang":"pt"},{"original":"orange","canonical":"orange","hint":"It´s a color.","lang":"us"},{"original":"pomarańczowy","canonical":"pomaranczowy","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"marron","canonical":"marron","hint":"É uma cor.","lang":"pt"},{"original":"brown","canonical":"brown","hint":"It´s a color.","lang":"us"},{"original":"brązowy","canonical":"brazowy","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"rosa","canonical":"rosa","hint":"É uma cor.","lang":"pt"},{"original":"pink","canonical":"pink","hint":"It´s a color.","lang":"us"},{"original":"fioletowy","canonical":"fioletowy","hint":"To jest kolor.","lang":"pl"}]},{"word":[{"original":"cinza","canonical":"cinza","hint":"É uma cor.","lang":"pt"},{"original":"gray","canonical":"gray","hint":"It´s a color.","lang":"us"},{"original":"szary","canonical":"szary","hint":"To jest kolor.","lang":"pl"}]}]}`;
}


