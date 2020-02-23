import { SpinText } from "./src/SpinText";

const ua = window.navigator.userAgent.toLowerCase();
const isIE: boolean = !!ua.match(/msie|trident\/7|edge/);
const isWinPhone: boolean = ua.indexOf('windows phone') !== -1;
const isIOS: boolean = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);

const elementContainerEditor: HTMLElement = document.querySelector('.container-editor');
const elementBackdrop: HTMLElement = document.querySelector('.backdrop');
const elementHighlights: HTMLElement = document.querySelector('.highlights');
const elementInput: HTMLInputElement = <HTMLInputElement>document.getElementById('input');
const elementOutput: HTMLElement = document.getElementById('output');
const elementMinWords: HTMLElement = document.getElementById('minwords');
const elementMaxWords: HTMLElement = document.getElementById('maxwords');
const elementVariations: HTMLElement = <HTMLElement>document.getElementById('variations');
const elementSentences: HTMLElement = document.getElementById('sentences');
const elementWords: HTMLElement = document.getElementById('words');
const elementChars: HTMLElement = document.getElementById('chars');
const elementCaret: HTMLElement = document.getElementById('caret');

let errorState: string = '';
let text: string = '';


const countSentences = function(s: string): number {
  //var m = s.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
  var m = s.match(/\b((?!=|\.).)+(.)\b/g);
  if(m !== null)
    return m.length;
  return 0;
}

const countWords = (s: string): number => {
  const m = s.match(/[\S]+/g);
  if(m !== null)
    return m.length;
  return 0;
}

const countChars = (s: string): number => s.length; 

const getCaretPosition = (): number => {
  if (elementInput.selectionStart)  return elementInput.selectionStart;
  return 0;
}

const setCaretPosition = (pos: number) => {
  elementInput.focus();        
  elementInput.setSelectionRange(pos, pos + 1);
  elementInput.focus();        
}

const readCaretPositionFromError = (s:string) => {
  const m = s.match(/\d{1,6}/g);
  if(m !== null) return m;
  return -1;
}





const format =  (s: string): string => {
  s = s.replace(/\n/g, '</p><p>');
  s = '<p>' + s + '</p>';
  s = s.replace('<p></p>', '');
  return s;
}

const preventHtml = ()=> {
  setTimeout(function() {
    var a = elementInput.innerText.replace(/\n/g,'');
    var b = elementInput.innerHTML.replace(/<br>/g,'');          
    if (a !== b) {
      elementInput.innerText = elementInput.innerText;
    }
  }, 0);
}

// text editor

const renderHighlights = (text: string): string => {
  text = text
    .replace(/\n$/g, '\n\n')
    .replace(/\{/g, '<mark>{')
    .replace(/\}/g, '}</mark>');
  text = fixIEText(text);
  return text;
}

const renderErrorHighlight = (text: string, index: number): string => {
  const textAsArray = text.split('');
  const char = textAsArray.splice(index, 1);
  const insertText = '<mark class="error">' + char + '</mark>';
  textAsArray.splice(index, 0, insertText)
  text = textAsArray.join('');
  text = fixIEText(text);
  return text;
}

const fixIEText = (text: string): string => {
  // IE wraps whitespace differently in a div vs textarea, this fixes it
  if (isIE) 
    text = text.replace(/ /g, ' <wbr>'); 
  return text;
}

const handleInput = (event) => { 
  if('undefined' !== typeof(event) && event.inputType === 'insertText' && errorState !== '') {
    if(event.data === errorState) {
      errorState = '';
    }
  }  
  if(errorState === '') {
    var text = elementInput.value;
    var highlightedText = renderHighlights(text);
    elementHighlights.innerHTML = highlightedText;
  }
}

const fixIOSStyle = () => {
  // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
  elementHighlights.style.paddingLeft = (+elementHighlights.style.paddingLeft.replace(/px/,'') + 3) + 'px'; 
  elementHighlights.style.paddingRight = (+elementHighlights.style.paddingRight.replace(/px/,'') + 3) + 'px'; 
}

// main

const execute = () => {
  text = elementInput.value;
  if(text.trim().length === 0)
    return;
  var outputText = '';
  try {
    const engine = new SpinText(text);
    // var seed = 1000;
    // engine = new SpinText.Engine(text, new SpinText.ParserConfig(seed));
    outputText = engine.toString();
    elementOutput.innerHTML = format(outputText);
    var v = engine.countVariants();
    elementVariations.innerText = v > 99999 ? '+' + v.toString() : v.toString();
    elementMinWords.innerText = engine.countMinWords().toString();
    elementMaxWords.innerText = engine.countMaxWords().toString();
    elementSentences.innerText = countSentences(outputText).toString();
    elementWords.innerText = countWords(outputText).toString();
    elementChars.innerText = countChars(outputText).toString();      

  } catch(ex) {
    var event = new CustomEvent('error', {
      detail: ex            
    });
    elementInput.dispatchEvent(event);          
    elementCaret.innerText = getCaretPosition().toString();
  }
  elementInput.focus();
}

// event handlers


elementInput.addEventListener('keyup', (event) =>  {
  elementCaret.innerText = getCaretPosition().toString();
}, true);

elementInput.addEventListener('mouseup', (event) => {
  elementCaret.innerText = getCaretPosition().toString();
}, true);

elementInput.addEventListener('focus', (event) => {
  // execute();
  elementCaret.innerText = getCaretPosition().toString();
}, true);


document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.keyCode === 13) {
    execute();
  }  
}, true);



elementInput.addEventListener('error', function (event: CustomEvent) {
  var text = elementInput.value;
  var index = +(event.detail.match(/\d+/g));
  var m = event.detail.match(/{|}/g)[0];
  if(m === '{') 
    errorState === '}'; 
  else 
    errorState === '{';  
  var highlightedText = renderErrorHighlight(text, index);
  elementHighlights.innerHTML = highlightedText;
} , true)


elementInput.addEventListener('input', (event) => { 
  handleInput(event); 
  execute(); 
}, true);

elementInput.addEventListener('scroll', (event) => {
  var scrollTop = elementInput.scrollTop;
  elementBackdrop.scrollTop = scrollTop;
  
  var scrollLeft = elementInput.scrollLeft;
  elementBackdrop.scrollLeft = scrollLeft;  
}, true)

if(isIOS)
  fixIOSStyle();

handleInput(undefined);
execute();



