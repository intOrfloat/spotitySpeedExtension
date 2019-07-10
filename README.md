# Spotity Speed Chrome Extension
Change the speed of spotify song playback rate. slow or fast.
---
![preview img](https://raw.githubusercontent.com/intOrfloat/spotitySpeedExtension/master/promo%20444%20280.png)

Get it here: [Chrome extension link](https://chrome.google.com/webstore/detail/spotify-playback-speed-ac/cgbihpjbhpdfbdckcabcniojdhcgblhd)


### Version 1.5:
 - Added redundancy to ensure the extension loads

 - Spotify started randomly using <audio> and <video> interchangeably like absolute madmen so it checks for both now 

 - added comments to the code 

---
## Install from github..
+ download project as zip ![preview img](https://i.stack.imgur.com/PrvYK.png)
+ unzip and load the folder as [unpacked extension](https://developer.chrome.com/extensions/getstarted#manifest)
+ remember to click that little refresh button on the extension page for the extension if you make code changes.
---
#### ℹ️ The code is in `content-script.js` and is heavily commented 
---
## The problem this solves: 
>  The video/audio element is hidden and only referenced in spotify's encapsulated code
## This solution: 
+ The code main part of the code is written in a template literal string with back quotes ---> `
	- This allows a multilined string with double quotes and single quotes without breaking the string variable
	
+ This string named code is injected into the top of the html dom as a script element when the page loads
	- It loads before spotify's scripts and can pre-append the browser's code of `document.createElement` before it's used
	- Whenever spotify's scripts execute `document.createElement('video')` a reference to the element created is stored in VideoElementsMade
		- `document.createElement('video')` used to be an audio element until spotify started supporting videos  and now it's randomly either
+ The `timeout()` loop is just an added assurance that the playbackspeed input element is created and that the speed is changed to the stored speed from previous sessions

## __[My previous solution(bad)](https://github.com/intOrfloat/SpotifyPlaybackRate)__ 
+ made a full copy of spotify's code 
     - forced having to block spotify's script with a firewall extension
     - slow to open with editor and prone to crashing when debugging
     - firewall made things inconsistent
     - doesnt ever update when spotify updates :(
+ added `window.spotifyContext = this;` when you click play
     - this allowed `window.spotifyContext._getTrackPlayer()` from anywhere

