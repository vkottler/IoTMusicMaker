<img id="sixteenthRest" src="sixteenthRest.png" alt="sixteenth" style="display:none" width="65" height="50">
<img id="eighthRest" src="eighthRest.png" alt="eighth" style="display:none" width="35" height="50">
<img id="quarterRest" src="quarterRest.jpg" alt="quarter" style="display:none" width="50" height="50">
<img id="halfRest" src="halfRest.gif" alt="half" style="display:none" width="30" height="50">
<script type="text/javascript">

var currX = 0;
var currY = 50;
var currNoteInd = 0;
var noteArray = new Array();
var durArray = new Array();
var octArray = new Array();
var typeArray = new Array();

function draw() { drawStaff(); }

function drawStaff() {

	var staffLength = document.getElementById('slider3').value;
	var my_canvas = document.getElementById('music');
	var c = my_canvas.getContext('2d');
	c.clearRect(0,0, 1500,300);
	c.lineWidth="2";
	c.strokeStyle="black";
	currY = 90;

	var endingX = 50 * staffLength / 2 + 50;
	// eight long lines
	for (i = 0; i < 5; i++) {
		c.beginPath();
		c.moveTo(50, currY);
		c.lineTo(endingX, currY);
		c.stroke();
		currY += 10;
		c.closePath();
	}
	currY += 20;
	for (i = 0; i < 5; i++) {
		c.beginPath();
		c.moveTo(50, currY);
		c.lineTo(endingX, currY);
		c.stroke();
		currY += 10;
		c.closePath();
	}

	// measure lines
	var numLines = staffLength / 4 + 1;
	if (staffLength % 4 >= 1) { numLines--; }
	currY = 90;
	currX = -50;
	for (i = 0; i < numLines; i++) {
		c.beginPath();
		currX += 100;
		c.moveTo(currX, currY);
		c.lineTo(currX, currY + 40);
		c.stroke();
		c.closePath();
	}
	currX = -50;
	currY = 160;
	for (i = 0; i < numLines; i++) {
		c.beginPath();
		currX += 100;
		c.moveTo(currX, currY);
		c.lineTo(currX, currY + 40);
		c.stroke();
		c.closePath();
	}
	currNoteInd = 0;
}

function drawAllNotes(limit) {
	for (i = 0; i < limit; i++) {
		drawNote(noteArray[i], octArray[i], durArray[i], typeArray[i]);
	}
}

function eraseStaffNote() {
	var limit = currNoteInd - 1;
	drawStaff();
	drawAllNotes(limit);
}

function drawNote(note, octave, duration, type) {

	noteArray[currNoteInd] = note; 
	durArray[currNoteInd] = duration;
	octArray[currNoteInd] = octave;
	typeArray[currNoteInd] = type;

	var shouldFill = 0;
	var needsLine = 0;
	var my_canvas = document.getElementById('music');
	var ctx = my_canvas.getContext('2d');
	var xPos = currNoteInd * 25 + 62.5;
	var yPos = 285 - 35 * octave - 5 * note;

	// rests
	if (note == -1 || type == -1) {
		var img = document.getElementById("halfRest");
		switch (duration) {
		case "ixth": img = document.getElementById("sixteenthRest"); break;	
		case "eighth": img = document.getElementById("eighthRest"); break;	
		case "quarter": img = document.getElementById("quarterRest"); break;
		}
		ctx.drawImage(img, xPos, 150, 25, 50);
	}

	// regular notes
	else {

		// lines through middle
		if ((octave == 3 && note == 6) || (octave == 4 && note == 1) || (octave == 5 && note == 6)) {
			ctx.beginPath();
			ctx.moveTo(xPos - 7.5, yPos);
			ctx.lineTo(xPos + 7.5, yPos);
			ctx.stroke();
			ctx.closePath();
		}

		//draw sharp symbol
		if (type == 1) {
			ctx.beginPath();
			ctx.moveTo(xPos - 15, yPos - 12);
			ctx.lineTo(xPos - 0, yPos - 12);
			ctx.stroke();
			ctx.moveTo(xPos - 15, yPos - 18);
			ctx.lineTo(xPos - 0, yPos - 18);
			ctx.stroke();
			ctx.moveTo(xPos - 10, yPos - 10);
			ctx.lineTo(xPos - 10, yPos - 20);
			ctx.stroke();
			ctx.moveTo(xPos - 5, yPos - 10);
			ctx.lineTo(xPos - 5, yPos - 20);
			ctx.stroke();
			ctx.closePath();
		}

		switch (duration) {
		case "ixth":
			ctx.beginPath();
			ctx.arc(xPos + 5, yPos - 15, 10, 3 * Math.PI / 2, Math.PI * 2 + Math.PI / 4);
			ctx.stroke();
			ctx.closePath();
		case "eighth":
			ctx.beginPath();
			ctx.arc(xPos + 5, yPos - 20, 10, 3 * Math.PI / 2, Math.PI * 2 + Math.PI / 8);
			ctx.stroke();
			ctx.closePath();
		case "quarter":
			ctx.fillStyle="#000000"; shouldFill = 1;
		case "half":
			needsLine = 1; break;
		}

		if (needsLine) {
			ctx.beginPath();
			ctx.moveTo(xPos + 5, yPos);
			ctx.lineTo(xPos + 5, yPos - 30);
			ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
		ctx.arc(xPos,yPos,5,0,2*Math.PI);
		ctx.stroke();
		ctx.closePath();
		if (shouldFill) ctx.fill();
	}

	currNoteInd++;
}

</script>