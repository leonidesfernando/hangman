const data =  JSON.parse(getDatabase())
const word = generateWord(data)
const TOTAL = 7

function start(){
    console.log('no start')
    console.log(word)
    //document.getElementById('resultLose').style = 'display: none'
    //document.getElementById('resultWin').style = 'display: none'

    generateTables(word)
    var input = document.getElementById('inputLetterOrWord')
    input.focus();
}

function restart(){
    location.reload()
}

function send(){

    const input = document.getElementById('inputLetterOrWord')
    const letter = input.value.trim()
    var inputedLetters = document.getElementById('inputedLetters')

    if(inputedLetters.innerHTML != undefined && inputedLetters.innerHTML.lastIndexOf(letter.toUpperCase()) > -1){
        return
    }

    if(input.value != '' && !hasLetter(letter.toLowerCase())){
        var img = document.getElementById('playerStatus')
        console.log(getCurrentImageStatus())
        img.src = getNextImageName()
    }

    if(ifWin()){
        document.getElementById('sendData').style = 'display: none'
        document.getElementById('restart').style = ''
        youWin()
    }
    
    const hasChance = parseInt(getCurrentImageStatus()) < TOTAL
    if(!hasChance){
        document.getElementById('sendData').style = 'display: none'
        document.getElementById('restart').style = ''
        youLose()
    }
    
    inputedLetters.innerHTML = inputedLetters.innerHTML + letter.toUpperCase() + ", "
    
    input.focus()
    input.value = ''
}

function ifWin(){
    filedOutAnyWord = true;
    for(var w in word){
        filedOutAnyWord = true;
        
        const lenByLang = parseInt(word[w].original.length)
        for(var i = 0; i < lenByLang; i++){
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

    for(var w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(var i = 0; i < lengWord; i++){
            var char = word[w].canonical.charAt(i)
            updateTableWithLetter(word[w], i)
        }
    }
    showFinalMessage('Parabéns!! Você conseguiu! Vamos mais uma rodada?', document.getElementById('resultWin'))
}

function youLose(){
    showFinalMessage('Não foi dessa vez! Tente outra novamente a prática te leva à perfeição!',
    	   document.getElementById('resultLose'))
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
    document.getElementById(`${wordLang.lang}RowLetter${index}`).value = wordLang.original.charAt(index).toUpperCase()
}

function generateTables(word){
    
    for(w in word){
        generateTableByLanguage(word[w].lang, word[w].original)
    }
}

function generateTableByLanguage(language, orignalWord){
    var len = orignalWord.length

    const row = document.getElementById(`${language}Row`);
    for(var i = 0; i < len; i++){
        const td = document.createElement('td')
        
        const input = document.createElement('input')
        configureInput(input, language, i)
        td.appendChild(input)
        row.appendChild(td)
    }
}


function configureInput(input, language, index){
    input.setAttribute('id', `${language}RowLetter${index}`)
    input.setAttribute('size', 1)
    input.setAttribute('maxlength', 1)
    input.setAttribute('class', 'text-center')
    input.setAttribute('disabled',true)
    input.setAttribute('style', 'border-bottom: 4px solid;')
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

    return `{
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
    }`;
}