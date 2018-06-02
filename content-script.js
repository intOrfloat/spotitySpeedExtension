var code = `var base = document.createElement;
var VideoElementsMade = [];

document.createElement = function(message) {

    var element = base.apply(this, arguments);
    if(message == 'video'){
        element.playbackRate = 0.5;
        VideoElementsMade.push(element);
    }
    return element
};
window.onload = function() {

  function getStoredSpeed(){
    return localStorage.getItem('speed');
  }
  var lastSpeed = getStoredSpeed() || 1.0;

  function setStoredSpeed(value){
localStorage.setItem('speed',value);

  }

    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'speed-extension-input';
    input.style = 'background-color: #08080859;'
        + 'border: #823333;'
        + 'width: 45px;'
        + 'margin: 5px;';
    input.value = lastSpeed * 100;
    input.oninput = function(e){
        validateAndChangeSpeed();
    };
    function validateAndChangeSpeed(value){
      var val = parseFloat( value || (input.value / 100));
      if(!isNaN(val)){

          changeSpeed(val);
      }
    }
    function changeSpeed(val) {

      for(var i = 0; i < VideoElementsMade.length; i++){
       VideoElementsMade[i].playbackRate = val;
       if(val != lastSpeed){
         lastSpeed = val;
         setStoredSpeed(val);
       }
      }

    }

    function timeout() {
        setTimeout(function () {
          try {
            validateAndChangeSpeed(lastSpeed);
          }catch{}
            timeout();
        }, 500);
    }
    document.getElementsByClassName('now-playing-bar__right')[0].appendChild (input);
    timeout();
};`;
var script = document.createElement('script');
script.textContent = code;
document.body.appendChild(script);
(document.head||document.documentElement).appendChild(script);
script.remove();
