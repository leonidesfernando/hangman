
//import localDataBase from './database.json'
//import {getDatabase as database } from './scripts/database.js'

//var database = require('getDatabase')

//console.log(JSON.stringify(localDataBase))

const data =  JSON.parse(getDatabaseNew())
const word = generateWord(data)
const TOTAL = 7
const LAST_IMAGE = 'img/7.png'

function start(){
    console.log('no start')
    console.log(word)

    generateTables(word)
    var input = document.getElementById('inputLetterOrWord')
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
    
    checkLetterOrWord(inputedLetters, letter);
    input.focus();
    input.value = '';

    checkIfWinOrLose();
}

function checkIfWinOrLose(){
    const allWords = document.getElementById('allWords');
    const hasChance = parseInt(getCurrentImageStatus()) < TOTAL;
    if(allWords.checked){
        //TODO: criar um metodo para verificar se todas as palavras foram preenchidas e nao apenas uma olhar a funcao: ifWin()
    }else{
        checkWinOrLoseOnlyOneWordIsEnough(hasChance);
    }
}

function checkWinOrLoseOnlyOneWordIsEnough(hasChance){
    
    if (!hasChance) {
        document.getElementById('sendData').style = 'display: none';
        document.getElementById('restart').style = '';
        youLose();
    }

    else if (ifWin()) {
        document.getElementById('sendData').style = 'display: none';
        document.getElementById('restart').style = '';
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
    let label = document.createElement('label')
    label.innerHTML = letter.toUpperCase()
    label.setAttribute('style', 'color:' + (hasTheLetter ? 'lightblue' : 'red'))
    inputedLetters.appendChild(label)
    inputedLetters.innerHTML = inputedLetters.innerHTML + ', '
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
    
    for (w in word) {
        langs += `<td><a href='#'> <img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/> </a></td>`
        hint += `<li><img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/>: ${word[w].original}</li>`;
    }
    hint += '</ul>';
    table += langs + "</tr></table>";
    showFinalMessage( hint + '<label class="fw-bold">Não foi dessa vez! Tente outra novamente, a prática te leva à perfeição!</label>',
    	   document.getElementById('resultLose'));
}

function showFinalMessage(msg, result){
    var div  = document.createElement('div')
    div.setAttribute('style', 'margin: 10px')
    result.appendChild(div)
    div.innerHTML = msg;
    result.style=""
}

function generateWord(){
    //TODO: criar cookie com local data, hora  milisegundo e armezenar os indices gerados e desconsiderar esses indices para pegar uma nova palavra
    var len = data.words.length
    console.log('len: ' +len)
    var index = Math.floor(Math.random() * len);
    console.log('index: ' + index)
    return data.words[index].word
}

function hasLetter(letter){
    
    var hasAnyLetter = false

    for(var w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(var i = 0; i < lengWord; i++){
            var char = word[w].canonical.charAt(i)
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
    for(w in word){
        generateTableByLanguage(word[w].lang, word[w].original, colspan);
    }
    generateHints(word);
}

function getSizeLargestWord(word){
    let smallest = 0;
    let biggest = 0;
    for (w in word) {
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
    for (w in word) {
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
    for(var i = 0; i < len; i++){
        td = document.createElement('td');
        
        const input = document.createElement( orignalWord.charAt(i) == ' ' ? 'span' : 'input');
        configureInput(input, language, i);
        td.appendChild(input);
        row.appendChild(td);
    }
    td.setAttribute('colspan', colspan);
}


function configureInput(input, language, index){
    input.setAttribute('id', `${language}RowLetter${index}`)
    input.setAttribute('size', 1)
    input.setAttribute('maxlength', 1)
    input.setAttribute('class', 'text-center')
    input.setAttribute('disabled',true)
    input.setAttribute('style', 'border-bottom: 4px solid; font-weight: bold;')
}

function getNextImageName(){
    var number = parseInt(getCurrentImageStatus())
    if(number < TOTAL){
        number++;
    }
    return `img/${number}.png`

}

function getCurrentImageStatus(){
    var img = document.getElementById('playerStatus')
    return img.src.substring(img.src.lastIndexOf('/')+1).split('.')[0];
}

//


function getDatabase() {

    return `{"words":[{"word":[{"original":"carne","canonical":"carne","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"meat","canonical":"meat","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"NO_HINT_TOO_EASY","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"duck","canonical":"duck","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"NO_HINT_TOO_EASY","lang":"pl"}]}]}`;
    
    /*return `{
        "words":
        [
            {
                "word":[
                    {
                        "original": "carne",
                        "canonical": "carne",
                        "lang": "pt"
                    },
                    {
                        "original": "mięso",
                        "canonical": "mieso",
                        "lang": "pl"
                    },
                    {
                        "original": "meat",
                        "canonical": "meat",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cebola",
                        "canonical": "cebola",
                        "lang": "pt"
                    },
                    {
                        "original": "cebula",
                        "canonical": "cebula",
                        "lang": "pl"
                    },
                    {
                        "original": "onion",
                        "canonical": "onion",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "moeda",
                        "canonical": "moeda",
                        "lang": "pt"
                    },
                    {
                        "original": "moneta",
                        "canonical": "moneta",
                        "lang": "pl"
                    },
                    {
                        "original": "coin",
                        "canonical": "coin",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "preto",
                        "canonical": "preto",
                        "lang": "pt"
                    },
                    {
                        "original": "czarny",
                        "canonical": "czarny",
                        "lang": "pl"
                    },
                    {
                        "original": "black",
                        "canonical": "black",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "salsinha",
                        "canonical": "salsinha",
                        "lang": "pt"
                    },
                    {
                        "original": "pietruszka",
                        "canonical": "pietruszka",
                        "lang": "pl"
                    },
                    {
                        "original": "parsley",
                        "canonical": "parsley",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "faca",
                        "canonical": "faca",
                        "lang": "pt"
                    },
                    {
                        "original": "nóż",
                        "canonical": "noz",
                        "lang": "pl"
                    },
                    {
                        "original": "knife",
                        "canonical": "knife",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cenoura",
                        "canonical": "cenoura",
                        "lang": "pt"
                    },
                    {
                        "original": "marchew",
                        "canonical": "marchew",
                        "lang": "pl"
                    },
                    {
                        "original": "carrot",
                        "canonical": "carrot",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "grande",
                        "canonical": "grande",
                        "lang": "pt"
                    },
                    {
                        "original": "duże",
                        "canonical": "duze",
                        "lang": "pl"
                    },
                    {
                        "original": "big",
                        "canonical": "big",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "leão",
                        "canonical": "leao",
                        "lang": "pt"
                    },
                    {
                        "original": "lew",
                        "canonical": "lew",
                        "lang": "pl"
                    },
                    {
                        "original": "lion",
                        "canonical": "lion",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cachorro",
                        "canonical": "cachorro",
                        "lang": "pt"
                    },
                    {
                        "original": "pies",
                        "canonical": "pies",
                        "lang": "pl"
                    },
                    {
                        "original": "dog",
                        "canonical": "dog",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "pt"
                    },
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "pl"
                    },
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "pepino",
                        "canonical": "pepino",
                        "lang": "pt"
                    },
                    {
                        "original": "ogórek",
                        "canonical": "ogorek",
                        "lang": "pl"
                    },
                    {
                        "original": "cucumber",
                        "canonical": "cucumber",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "uva",
                        "canonical": "uva",
                        "lang": "pt"
                    },
                    {
                        "original": "winogrono",
                        "canonical": "winogrono",
                        "lang": "pl"
                    },
                    {
                        "original": "grape",
                        "canonical": "grape",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "bandeira",
                        "canonical": "bandeira",
                        "lang": "pt"
                    },
                    {
                        "original": "flag",
                        "canonical": "flag",
                        "lang": "pl"
                    },
                    {
                        "original": "flaga",
                        "canonical": "flaga",
                        "lang": "us"
                    }
                ]
            }
        ]
    }`; */
}

function getDatabaseNew() {
    return `{"words":[{"word":[{"original":"banana","canonical":"banana","hint":"É uma fruta","lang":"pt"},{"original":"banana","canonical":"banana","hint":"It\u0027s a fruit","lang":"us"},{"original":"banan","canonical":"banan","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"uva","canonical":"uva","hint":"É uma fruta","lang":"pt"},{"original":"grape","canonical":"grape","hint":"It\u0027s a fruit","lang":"us"},{"original":"winogrono","canonical":"winogrono","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"melancia","canonical":"melancia","hint":"É uma fruta","lang":"pt"},{"original":"watermelon","canonical":"watermelon","hint":"It\u0027s a fruit","lang":"us"},{"original":"arbus","canonical":"arbus","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"morango","canonical":"morango","hint":"É uma fruta","lang":"pt"},{"original":"strawberry","canonical":"strawberry","hint":"It\u0027s a fruit","lang":"us"},{"original":"truskawka","canonical":"truskawka","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"laranja","canonical":"laranja","hint":"É uma fruta","lang":"pt"},{"original":"orange","canonical":"orange","hint":"It\u0027s a fruit","lang":"us"},{"original":"pomarańcza","canonical":"pomarancza","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"pêssego","canonical":"pessego","hint":"É uma fruta","lang":"pt"},{"original":"peach","canonical":"peach","hint":"It\u0027s a fruit","lang":"us"},{"original":"brzoskwinia","canonical":"brzoskwinia","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"maçã","canonical":"maca","hint":"É uma fruta","lang":"pt"},{"original":"apple","canonical":"apple","hint":"It\u0027s a fruit","lang":"us"},{"original":"jabłko","canonical":"jablko","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"framboesa","canonical":"framboesa","hint":"É uma fruta","lang":"pt"},{"original":"raspberry","canonical":"raspberry","hint":"It\u0027s a fruit","lang":"us"},{"original":"malina","canonical":"malina","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"kiwi","canonical":"kiwi","hint":"É uma fruta","lang":"pt"},{"original":"kiwi","canonical":"kiwi","hint":"It\u0027s a fruit","lang":"us"},{"original":"kiwi","canonical":"kiwi","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"bola","canonical":"bola","hint":"É um brinquedo","lang":"pt"},{"original":"piłka","canonical":"pilka","hint":"It\u0027s a toy","lang":"us"},{"original":"ball","canonical":"ball","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"brinquedo","canonical":"brinquedo","hint":"É um brinquedo","lang":"pt"},{"original":"toy","canonical":"toy","hint":"It\u0027s a toy","lang":"us"},{"original":"zabawka","canonical":"zabawka","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"caderno","canonical":"caderno","hint":"Usado para estudar","lang":"pt"},{"original":"notebook","canonical":"notebook","hint":"Used to study","lang":"us"},{"original":"notes","canonical":"notes","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"borracha","canonical":"borracha","hint":"Usado para estudar","lang":"pt"},{"original":"rubber","canonical":"rubber","hint":"Used to study","lang":"us"},{"original":"gumka","canonical":"gumka","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"caneta","canonical":"caneta","hint":"Usado para estudar","lang":"pt"},{"original":"pen","canonical":"pen","hint":"Used to study","lang":"us"},{"original":"długopis","canonical":"dlugopis","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"lápis","canonical":"lapis","hint":"Usado para estudar","lang":"pt"},{"original":"pencil","canonical":"pencil","hint":"Used to study","lang":"us"},{"original":"ołówek","canonical":"olowek","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"régua","canonical":"regua","hint":"Usado para estudar","lang":"pt"},{"original":"ruler","canonical":"ruler","hint":"Used to study","lang":"us"},{"original":"linijka","canonical":"linijka","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"carne","canonical":"carne","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"meat","canonical":"meat","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"carne","canonical":"carne","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"meat","canonical":"meat","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"maçã","canonical":"maca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"apple","canonical":"apple","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"jabłko","canonical":"jablko","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"café","canonical":"cafe","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"coffee","canonical":"coffee","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kawa","canonical":"kawa","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cebola","canonical":"cebola","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"onion","canonical":"onion","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"cebula","canonical":"cebula","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cenoura","canonical":"cenoura","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"carrot","canonical":"carrot","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"marchew","canonical":"marchew","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"computador","canonical":"computador","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"computer","canonical":"computer","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"komputer","canonical":"komputer","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"caneca","canonical":"caneca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"mug","canonical":"mug","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kubek","canonical":"kubek","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"animal","canonical":"animal","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"animal","canonical":"animal","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"zwierzę","canonical":"zwierze","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"É um animal","lang":"pt"},{"original":"duck","canonical":"duck","hint":"It\u0027s an animal","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"leão","canonical":"leao","hint":"É um animal","lang":"pt"},{"original":"lion","canonical":"lion","hint":"It\u0027s an animal","lang":"us"},{"original":"lew","canonical":"lew","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"cachorro","canonical":"cachorro","hint":"É um animal","lang":"pt"},{"original":"dog","canonical":"dog","hint":"It\u0027s an animal","lang":"us"},{"original":"pies","canonical":"pies","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"gato","canonical":"gato","hint":"É um animal","lang":"pt"},{"original":"cat","canonical":"cat","hint":"It\u0027s an animal","lang":"us"},{"original":"kot","canonical":"kot","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"cavalo","canonical":"cavalo","hint":"É um animal","lang":"pt"},{"original":"horse","canonical":"horse","hint":"It\u0027s an animal","lang":"us"},{"original":"koń","canonical":"kon","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"pão","canonical":"pao","hint":"É de comer","lang":"pt"},{"original":"bread","canonical":"bread","hint":"It\u0027s food","lang":"us"},{"original":"chleb","canonical":"chleb","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"ovo","canonical":"ovo","hint":"É de comer","lang":"pt"},{"original":"egg","canonical":"egg","hint":"It\u0027s food","lang":"us"},{"original":"jajko","canonical":"jajko","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"queijo","canonical":"queijo","hint":"É de comer","lang":"pt"},{"original":"cheese","canonical":"cheese","hint":"It\u0027s food","lang":"us"},{"original":"ser","canonical":"ser","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"macarrão","canonical":"macarrao","hint":"É de comer","lang":"pt"},{"original":"pasta","canonical":"pasta","hint":"It\u0027s food","lang":"us"},{"original":"makaron","canonical":"makaron","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"leite","canonical":"leite","hint":"É de comer","lang":"pt"},{"original":"milk","canonical":"milk","hint":"It\u0027s food","lang":"us"},{"original":"mleko","canonical":"mleko","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"cadeira","canonical":"cadeira","hint":"É um móvel(mobilia)","lang":"pt"},{"original":"chair","canonical":"chair","hint":"It\u0027s a furniture","lang":"us"},{"original":"krzesło","canonical":"krzeslo","hint":"To jest meble","lang":"pl"}]},{"word":[{"original":"um","canonical":"um","hint":"É um número.","lang":"pt"},{"original":"one","canonical":"one","hint":"It´s a number.","lang":"us"},{"original":"jeden","canonical":"jeden","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"dois","canonical":"dois","hint":"É um número.","lang":"pt"},{"original":"two","canonical":"two","hint":"It´s a number.","lang":"us"},{"original":"dwa","canonical":"dwa","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"três","canonical":"tres","hint":"É um número.","lang":"pt"},{"original":"three","canonical":"three","hint":"It´s a number.","lang":"us"},{"original":"trzy","canonical":"trzy","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"quatro","canonical":"quatro","hint":"É um número.","lang":"pt"},{"original":"four","canonical":"four","hint":"It´s a number.","lang":"us"},{"original":"cztery","canonical":"cztery","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"cinco","canonical":"cinco","hint":"É um número.","lang":"pt"},{"original":"five","canonical":"five","hint":"It´s a number.","lang":"us"},{"original":"pięć","canonical":"piec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"seis","canonical":"seis","hint":"É um número.","lang":"pt"},{"original":"six","canonical":"six","hint":"It´s a number.","lang":"us"},{"original":"sześć","canonical":"szesc","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"sete","canonical":"sete","hint":"É um número.","lang":"pt"},{"original":"seven","canonical":"seven","hint":"It´s a number.","lang":"us"},{"original":"siedem","canonical":"siedem","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"oito","canonical":"oito","hint":"É um número.","lang":"pt"},{"original":"eight","canonical":"eight","hint":"It´s a number.","lang":"us"},{"original":"osiem","canonical":"osiem","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"nove","canonical":"nove","hint":"É um número.","lang":"pt"},{"original":"nine","canonical":"nine","hint":"It´s a number.","lang":"us"},{"original":"dziewięć","canonical":"dziewiec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"dez","canonical":"dez","hint":"É um número.","lang":"pt"},{"original":"ten","canonical":"ten","hint":"It´s a number.","lang":"us"},{"original":"dziesięć","canonical":"dziesiec","hint":"To jest numer.","lang":"pl"}]},{"word":[{"original":"repolho","canonical":"repolho","hint":"É um vegetal","lang":"pt"},{"original":"cabage","canonical":"cabage","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kapusta","canonical":"kapusta","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"salsinha","canonical":"salsinha","hint":"É um vegetal","lang":"pt"},{"original":"parsley","canonical":"parsley","hint":"It\u0027s a vegetable","lang":"us"},{"original":"pietruszka","canonical":"pietruszka","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"coentro","canonical":"coentro","hint":"É um vegetal","lang":"pt"},{"original":"cilantro","canonical":"cilantro","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kolendra","canonical":"kolendra","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"pepino","canonical":"pepino","hint":"É um vegetal","lang":"pt"},{"original":"cucumber","canonical":"cucumber","hint":"It\u0027s a vegetable","lang":"us"},{"original":"ogórek","canonical":"ogorek","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"abóbora","canonical":"abobora","hint":"É um vegetal","lang":"pt"},{"original":"pumpkin","canonical":"pumpkin","hint":"It\u0027s a vegetable","lang":"us"},{"original":"dynia","canonical":"dynia","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"abobrinha","canonical":"abobrinha","hint":"É um vegetal","lang":"pt"},{"original":"zucchini","canonical":"zucchini","hint":"It\u0027s a vegetable","lang":"us"},{"original":"cukinia","canonical":"cukinia","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"pimentão","canonical":"pimentao","hint":"É um vegetal","lang":"pt"},{"original":"bell pepper","canonical":"bell pepper","hint":"It\u0027s a vegetable","lang":"us"},{"original":"papryka","canonical":"papryka","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"milho","canonical":"milho","hint":"É um vegetal","lang":"pt"},{"original":"corn","canonical":"corn","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kukurydza","canonical":"kukurydza","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"beringela","canonical":"beringela","hint":"É um vegetal","lang":"pt"},{"original":"eggplant","canonical":"eggplant","hint":"It\u0027s a vegetable","lang":"us"},{"original":"bakłażan","canonical":"bakłażan","hint":"To jest warzywo","lang":"pl"}]}]}`;
}

