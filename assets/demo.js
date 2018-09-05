var ua = window.navigator.userAgent.toLowerCase();

var isIE = !!ua.match(/msie|trident\/7|edge/);
var isWinPhone = ua.indexOf('windows phone') !== -1;
var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);

var errorState = '';
var text = '';
var engine = null;

var elementContainerEditor = document.querySelector('.container-editor');
var elementBackdrop = document.querySelector('.backdrop');
var elementHighlights = document.querySelector('.highlights');
var elementInput = document.getElementById('input');
var elementOutput = document.getElementById('output');
var elementMinWords = document.getElementById('minwords');
var elementMaxWords = document.getElementById('maxwords');
var elementVariations = document.getElementById('variations');
var elementSentences = document.getElementById('sentences');
var elementWords = document.getElementById('words');
var elementChars = document.getElementById('chars');
var elementCaret = document.getElementById('caret');

var countSentences = function(s) {
  //var m = s.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
  var m = s.match(/\b((?!=|\.).)+(.)\b/g);
  if(m !== null)
    return m.length;
  return 0;
}

var countWords = function(s) {
  var m = s.match(/[\S]+/g);
  if(m !== null)
    return m.length;
  return 0;
}

var countChars = function(s) {
  return s.length; 
}

var getCaretPosition = function() {
  var pos = 0;        
  if (elementInput.selectionStart || elementInput.selectionStart === '0') 
    pos = elementInput.selectionStart;
  return pos;
}

var setCaretPosition = function(pos) {
  elementInput.focus();        
  elementInput.setSelectionRange(pos, pos + 1);
  elementInput.focus();        
}

var readCaretPositionFromError = function(s) {
  var m = s.match(/\d{1,6}/g);
  if(m !== null)
    return m;
  return -1;
}

// var showErrorToken = -1;
// var showError = function(s) {
//   if(showTokenError > -1)
//     clearTimeout(showErrorToken);
//   else
//     showErrorToken = setTimeout(function() {
//     }, 3000);
// }

var format = function (s) {
  s = s.replace(/\n/g, '</p><p>');
  s = '<p>' + s + '</p>';
  s = s.replace('<p></p>', '');
  return s;
}

var preventHtml = function () {
  setTimeout(function() {
    var a = elementInput.innerText.replace(/\n/g,'');
    var b = elementInput.innerHTML.replace(/<br>/g,'');          
    if (a !== b) {
      elementInput.innerText = elementInput.innerText;
    }
  }, 0);
}

// text editor

var renderHighlights = function(text) {
  text = text
    .replace(/\n$/g, '\n\n')
    .replace(/\{/g, '<mark>{')
    .replace(/\}/g, '}</mark>');
  text = fixIEText(text);
  return text;
}

var renderErrorHighlight = function(text, index) {
  var textAsArray = text.split('');
  var char = textAsArray.splice(index, 1);
  var insertText = '<mark class="error">' + char + '</mark>';
  textAsArray.splice(index, 0, insertText)
  text = textAsArray.join('');
  text = fixIEText(text);
  return text;
}

var fixIEText = function(text) {
  // IE wraps whitespace differently in a div vs textarea, this fixes it
  if (isIE) 
    text = text.replace(/ /g, ' <wbr>'); 
  return text;
}

var handleInput = function(e) { 
  if('undefined' !== typeof(e) && e.inputType === 'insertText' && errorState !== '') {
    if(e.data === errorState) {
      errorState = '';
    }
  }  
  if(errorState === '') {
    var text = elementInput.value;
    var highlightedText = renderHighlights(text);
    elementHighlights.innerHTML = highlightedText;
  }
}

var fixIOSStyle = function () {
  // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
  elementHighlights.style.paddingLeft = (+elementHighlights.style.paddingLeft.replace(/px/,'') + 3) + 'px'; 
  elementHighlights.style.paddingRight = (+elementHighlights.style.paddingRight.replace(/px/,'') + 3) + 'px'; 
}

// main

var execute = function() {
  text = elementInput.value;
  if(text.trim().length === 0)
    return;
  var outputText = '';
  try {
    engine = new SpinText.Engine(text);
    // var seed = 1000;
    // engine = new SpinText.Engine(text, new SpinText.ParserConfig(seed));
    outputText = engine.toString();
    elementOutput.innerHTML = format(outputText);
    var v = engine.countVariants();
    elementVariations.innerText = v > 99999 ? '+' + v : v;
    elementMinWords.innerText = engine.countMinWords();
    elementMaxWords.innerText = engine.countMaxWords();
    elementSentences.innerText = countSentences(outputText);
    elementWords.innerText = countWords(outputText);
    elementChars.innerText = countChars(outputText);      

  } catch(ex) {
    var event = new CustomEvent('error', {
      detail: ex            
    });
    elementInput.dispatchEvent(event);          
    elementCaret.innerText = getCaretPosition();
  }
  elementInput.focus();
}

// event handlers

elementInput.addEventListener('keyup', function(e) {
  elementCaret.innerText = getCaretPosition();
}, true);

elementInput.addEventListener('mouseup', function(e) {
  elementCaret.innerText = getCaretPosition();
}, true);

elementInput.addEventListener('focus', function(e) {
  // execute();
  elementCaret.innerText = getCaretPosition();
}, true);

document.addEventListener('keydown', function(e) {
  if (event.ctrlKey && event.keyCode === 13) {
    execute();
  }  
}, true);

elementInput.addEventListener('error', function (e) {
  var text = elementInput.value;
  var index = +(e.detail.match(/\d+/g));
  var m = e.detail.match(/{|}/g)[0];
  if(m === '{') 
    errorState === '}'; 
  else 
    errorState === '{';  
  var highlightedText = renderErrorHighlight(text, index);
  elementHighlights.innerHTML = highlightedText;
} , true)

elementInput.addEventListener('input', function(e) { 
  handleInput(e); 
  execute(); 
}, true);

elementInput.addEventListener('scroll', function(e) {
  var scrollTop = elementInput.scrollTop;
  elementBackdrop.scrollTop = scrollTop;
  
  var scrollLeft = elementInput.scrollLeft;
  elementBackdrop.scrollLeft = scrollLeft;  
}, true)

if(isIOS)
  fixIOSStyle();

handleInput()
execute();
