<script type="text/javascript">

//String being sent:
//params='____'&access_token=6e8c919136e2a43db6f88e6e4c216661d5ac7f5c


var loadingmessage = 'Processing...';
function setAjax(){
	var xmlHttp;
	try{
		xmlHttp=new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari
		return xmlHttp;
	}
	catch (e){
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer
			return xmlHttp;
		}
		catch (e){
			try{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				return xmlHttp;
			}
			catch (e){
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
}
function myAjax(f, url, myDivToChange) {
	var poststr = getFormValues(f);
	postData(url, poststr, myDivToChange);
	//document.getElementById('testSpot').innerHTML = poststr;
}
function postData(url, parameters, myDivToChange2){
	var xmlHttp = setAjax();
	xmlHttp.onreadystatechange =  function(){
		if(xmlHttp.readyState > 0 && xmlHttp.readyState < 4){
			document.getElementById(myDivToChange2).innerHTML=loadingmessage;
		}
		if (xmlHttp.readyState == 4) {
			// this is where the magic occcurs  
			var myJsonObject = JSON.parse(xmlHttp.responseText);
			document.getElementById(myDivToChange2).innerHTML= myJsonObject.return_value;
		}
	}
	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.send(parameters);
}
function getFormValues(fobj){
	var str = "";
	var valueArr = null;
	var val = "";
	var cmd = "";
	for(var i = 0;i < fobj.elements.length;i++){
		switch(fobj.elements[i].type){
		case "text":
		case "hidden":
			str += fobj.elements[i].name +"=" + escape(fobj.elements[i].value) + "&";
			break;         
		case "password":
			str += fobj.elements[i].name +"=" + escape(fobj.elements[i].value) + "&";
			break;
		case "textarea":
			str += fobj.elements[i].name +"=" + escape(fobj.elements[i].value) + "&";
			break;
		case "select-one":
			str += fobj.elements[i].name +"=" + fobj.elements[i].options[fobj.elements[i].selectedIndex].value + "&";
			break;
		}
	}
	str = str.substr(0,(str.length - 1));
	return str;
}
function sendToSpark(myIn){
	document.all.myParameter.value = myIn;
	document.myForm.action = 'https://api.spark.io/v1/devices/55ff6f066678505540361367/my-main';
	myAjax(document.all.myCoolForm, document.myForm.action, 'myDivId'); 
}

var bar, slider;

function pageStart() {
	myStorage1 = localStorage.getItem('myStoredText1');
	if(myStorage1  != null) document.getElementById('myToken').value = myStorage1;
	myStorage2 = localStorage.getItem('myStoredText2');
	if(myStorage2  != null) document.getElementById('myDeviceId').value = myStorage2;
}

function init() {
	pageStart();
	draw();
}

var currNote = 1;
var currNoteType = 0;
var analogSend = 0;

function showNote(note, type) { 
	currNote = note;
	currNoteType = type;
	if (type == 0) document.getElementById('noteDisplay').innerHTML = document.getElementById('Rnote' + note).value;
	else document.getElementById('noteDisplay').innerHTML = document.getElementById('Snote' + note).value;
	currNoteChar = document.getElementById('noteDisplay').innerHTML;
	sendToSpark(document.getElementById('noteDisplay').innerHTML);
}

function showRegular() { 
	document.getElementById('regNotes').style.display = "block";
	document.getElementById('sharpNotes').style.display = "none";
	document.getElementById('Rnote' + currNote).checked = true;
	showNote(currNote, 0);
}

function showSharp() { 
	document.getElementById('sharpNotes').style.display = "block";
	document.getElementById('regNotes').style.display = "none";
	if (currNote == 5) { currNote = currNote - 1; }
	else if (currNote == 6) { currNote = currNote - 2; }
	document.getElementById('Snote' + currNote).checked = true;
	showNote(currNote, 1);
}

function newDuration(val) {
	var test = "durations" + val;
	currentDuration = document.getElementById(test).value;
	sendToSpark(document.getElementById(test).value);
}

function getSize() {
	var size = document.getElementById('slider3').value;
	document.getElementById('S3place').innerHTML = size;
	var toSend = "s" + size;
	sendToSpark(toSend);
}

var octave = 3;

function decrement() {
	var toSend = "o";
	if (octave > 1) {
		octave--;
		document.getElementById('currOctave').innerHTML = octave;
		toSend += octave;
		sendToSpark(toSend);
	}
}

function increment() {
	var toSend = "o";
	if (octave < 7) {
		octave++;
		document.getElementById('currOctave').innerHTML = octave;
		toSend += octave;
		sendToSpark(toSend);
	}
}

var currentDuration = "quarter";
var currNoteChar = "C";
var numNotesInLoop = 0;

function addToLoop(type) {
	if (document.getElementById('slider3').value - numNotesInLoop > 0) {
		var currentNoteString = "";
		var currentOctaveString = "";
		var currentDurationString = "";

		if (document.getElementById('currentLoop').innerHTML === "Notes") { }
		else { 
			currentNoteString = document.getElementById('currentLoop').innerHTML;
			currentOctaveString = document.getElementById('loopOctave').innerHTML;
			currentDurationString = document.getElementById('loopDurations').innerHTML;
		}

		if (type == 0) {
			currentNoteString += "__";
			currentNoteString += currNoteChar;
			currentNoteString += "__";
			currentOctaveString += "__";
			currentOctaveString += octave;
			currentOctaveString += "__";
		}
		else {
			currentNoteString += "__R__";
			currentOctaveString += "__R__";
		}


		switch (currentDuration) {
		case "eighth": currentDurationString += "_1/8_"; break;
		case "quarter": currentDurationString += "_1/4_"; break;
		case "half": currentDurationString += "_1/2_"; break;
		case "full": currentDurationString += "__1__"; break;
		case "ixth": currentDurationString += "__16_"; break;
		}	
		numNotesInLoop++;
		document.getElementById('currentLoop').innerHTML = currentNoteString;
		document.getElementById('loopOctave').innerHTML = currentOctaveString;
		document.getElementById('loopDurations').innerHTML = currentDurationString;
		document.getElementById('notesLeft').innerHTML = document.getElementById('slider3').value - numNotesInLoop;
		
		if (currNoteType) {
			var modifiedNote = 0;
			switch (currNote) {
			case 0: modifiedNote = 1; break;
			case 1: modifiedNote = 2; break;
			case 2: modifiedNote = 4; break;
			case 3: modifiedNote = 5; break;
			case 4: modifiedNote = 6; break;
			}
			drawNote(modifiedNote, octave, currentDuration, currNoteType);
		}
		else if (type == 0) { drawNote(currNote, octave, currentDuration, currNoteType); }
		else if (type == 1) { drawNote(-1, -1, currentDuration, -1); }
	}
}

function clearLoop() { 
	document.getElementById('currentLoop').innerHTML = "Notes";
	document.getElementById('loopOctave').innerHTML = "Octaves";
	document.getElementById('loopDurations').innerHTML = "Durations";
	document.getElementById('notesLeft').innerHTML = document.getElementById('slider3').value;
	currNoteInd = 0;
	numNotesInLoop = 0;
}

function checkReset() { if (numNotesInLoop >= document.getElementById('slider3').value) clearLoop(); }

function erase() { 
	if (numNotesInLoop == 1) { clearLoop(); eraseStaffNote(); }
	if (numNotesInLoop > 1) {
		eraseStaffNote();
		numNotesInLoop--;
		document.getElementById('notesLeft').innerHTML = document.getElementById('slider3').value - numNotesInLoop;
		var noteStr = document.getElementById('currentLoop').innerHTML;
		noteStr = noteStr.substring(0, noteStr.length - 5);
		var octStr = document.getElementById('loopOctave').innerHTML;
		octStr = octStr.substring(0, octStr.length - 5);
		var durStr = document.getElementById('loopDurations').innerHTML;
		durStr = durStr.substring(0, durStr.length - 5);
		document.getElementById('currentLoop').innerHTML = noteStr;
		document.getElementById('loopOctave').innerHTML = octStr;
		document.getElementById('loopDurations').innerHTML = durStr;
	}
}

</script>