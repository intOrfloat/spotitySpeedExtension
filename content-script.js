/* 
 The problem: the video/audio element is hidden and only referenced in spotify's encapsulated code
 
 1. The code main part of the code is written in a template literal string with back quotes ``
 	- This allows a multilined string with double quotes and single quotes without breaking the string variable
 	
 2. This string named code is injected into the top of the html dom as a script element when the page loads
 	- It loads before spotify's scripts and can pre-append the browser's code of document.createElement before it's used
 	- Whenever spotify's scripts execute document.createElement('video') a reference to the element created is stored in VideoElementsMade
 		- document.createElement('video') used to be an audio element until spotify started supporting videos and now it's randomly either
 3. The timeout is just an added assurance that the playbackspeed input element is created and that the speed is changed to the stored speed from previous sessions
*/
/* ======== Start of code string literal ======== */
var code = `
	var base = document.createElement; /* A backup reference to the browser's original document.createElement */
	var VideoElementsMade = []; /* Array of video/audio elements made by spotify's scripts */
	
	/* Replacing the DOM's original reference to the browser's createElement function */
	document.createElement = function(message) {
		/* base.apply is calling the backup reference of createElement with the arguments sent to our function and assigning it to our variable named element */
		var element = base.apply(this, arguments); 
		
		/* we check the first argument sent to us Examp. document.createElement('video') would have message = 'video' */
		/* ignores the many document.createElement('div'), document.createElement('nav'), ect... */
		if(message == 'video' || message == 'audio'){ /* Checking if spotify scripts are making a video or audio element */
			VideoElementsMade.push(element); /* Add a reference to the element in our array. Arrays hold references not copies by default in javascript. */
		}
		return element /* return the element and complete the loop so the page is allowed to be made */
	};
	
	/* When the page is loaded completely... */
	window.onload = function() {
		function getStoredSpeed(){ /* Gets stored speed between refreshes*/
			return localStorage.getItem('speed');
		}
		var lastSpeed = getStoredSpeed() || 1.0; /* if stored speed is null make lastSpeed 1.0 */
	
		function setStoredSpeed(value){ /* Sets variable in the site's cookie along-side spotify's stuff */
			localStorage.setItem('speed',value);
		}

		/* Building our playback speed input element */
		var input = document.createElement('input');
		input.type = 'number';
		input.id = 'speed-extension-input';
		input.style = 'background-color: #08080859;'
			+ 'border: #823333;'
			+ 'width: 45px;'
			+ 'margin: 5px;';
		input.value = lastSpeed * 100;
		input.oninput = function(e){ /* What happens when we change the number in our input box element */
			validateAndChangeSpeed();  /* We call our function */
		};
		
		function validateAndChangeSpeed(value){ 
			var val = parseFloat( value || (input.value / 100)); /* val must be in format 0.0625 - 16.0 https://stackoverflow.com/a/32320020 */
			if(!isNaN(val)){ /* check if val is a number */
				changeSpeed(val);
			}
		}
		
		function changeSpeed(val) {
			for(var i = 0; i < VideoElementsMade.length; i++){ /* change speed for all elements found (i havent seen this be more than 1 but you never know) */
				VideoElementsMade[i].playbackRate = val; /* set the playback rate here */
				if(val != lastSpeed){ /* update the lastSpeed if the speed actually changed */
					lastSpeed = val;
					setStoredSpeed(val);
				}
			}
		}
		
		function timeout() { /* This function is called by itself over and over */
			if(document.getElementById('speed-extension-input') == null) /* check if our input element doesnt exist */
			{
				try {
					document.getElementsByClassName('now-playing-bar__right')[0].appendChild (input); /* make our input exist on page */
				}catch{
					setTimeout(timeout, 100);/*now-playing-bar__right doesnt exist yet so lets try again in 100ms*/
					return;
				}
			}
			setTimeout(function () { /* setTimeout is a delayed call(500 milliseconds) to the code below */
				try {
					validateAndChangeSpeed(lastSpeed); /* this is in a try/catch because if an error happens timeout wouldnt be called again. */
				}catch{
					
				}
				timeout(); /* call timeout again which starts the loop and eventually it will come back here */
			}, 500); /* 500ms */
		}
		
		timeout(); /* starts the loop to check and create our inputbox and to set the playback speed without having to mess with input box(by refreshing and having it load from cookie) */
		/* sometimes playbackRate is set back to 1.0 by spotify's code so timeout just ensures it goes the speed the user desires */
	};`; 
/* ======== End of code string literal ======== */
var script = document.createElement('script'); /* Create our dummy script to be inserted with our code variable  */
script.textContent = code; /* insert our code as the contents of the script */
document.body.appendChild(script); /* make our script exist on the page as, hopefully, the first script to execute. */
(document.head||document.documentElement).appendChild(script); /* appends script again(not good practice) as close to top as possible */
script.remove(); /* idk why i do this */
