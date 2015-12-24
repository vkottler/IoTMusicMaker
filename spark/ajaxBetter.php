<html>
<head>
<title>Vaughn Spark</title>
<font style="font-size:25px" face="verdana">
<?php 
include 'myJavascript.js';
include 'functions.php';
include 'myStyle.css';
include 'script.js';
?>
</head>

<script type="text/javascript">

</script>

<body onload="{init()}">

<!-- <input id="myDeviceId" name="myCoreID" type=hidden size=50 value="55ff6f066678505540361367"> -->
<!-- <input id="myFunctionName" name="myFunction"  type=hidden size=50 value="my-main" > --> 

<form name="myForm" method="POST" id="myCoolForm" >
<input id="myParameter" name="params" type=text  style="display:none" size=50 placeholder="d7-send-high"> 
<input id="myToken" name="access_token" type=hidden size=50 value="6e8c919136e2a43db6f88e6e4c216661d5ac7f5c">
</form>

<canvas id="music" width="1500" height="300"></canvas><br>

Notes Left: <div id="notesLeft" style="display:inline;font-weight:bold;">4</div><br>

<?php noteTypeForm(); ?>

<div id='notes' style="font-size:12px"><?php showRegularNotes(); showSharpNotes(); ?></div>
<div id="noteDisplay"> <!-- current note here --> </div><br>

Octave:&nbsp;&nbsp;
<input type="button" value="-" onClick="javascript:decrement()">
<div id="currOctave" style="display:inline;padding-right:20px;padding-left:20px;">3</div>
<input type="button" value="+" onClick="javascript:increment()"><br><br>

<div>
<input type="button" value="Add Rest" onClick="javascript:sendToSpark('rest');addToLoop(1);">
<input type="button" value="Choose" onClick="javascript:addToLoop(0);sendToSpark('choose');">
<input type="button" value="Erase" onClick="javascript:sendToSpark('erase');erase();"><br>
<input type="button" value="Preview Loop" onClick="javascript:sendToSpark('prev')">
<input type="button" value="Quit Loop" onClick="javascript:sendToSpark('quit');checkReset();">
<input type="button" value="Reset Loop" onClick="javascript:sendToSpark('clear');clearLoop();">
</div><br>

<form>
<input type="radio" id="durations4" name="dura" value="ixth" onChange="javascript:newDuration(4)"> Sixteenth<br>
<input type="radio" id="durations0" name="dura" value="eighth" onChange="javascript:newDuration(0)"> Eighth<br>
<input type="radio" id="durations1" name="dura" value="quarter" onChange="javascript:newDuration(1)" checked> Quarter<br>
<input type="radio" id="durations2" name="dura" value="half" onChange="javascript:newDuration(2)"> Half<br>
<input type="radio" id="durations3" name="dura" value="full" onChange="javascript:newDuration(3)"> Full<br>
</form>
Size of Loop: <div id="S3place" style="display:inline">4</div>
<input id="slider3" style="width:800px" min="1" max="100" step="1" type="range" onChange="javascript:getSize();clearLoop();drawStaff();" value=4><br><br>

<div id="currentLoop" style="color:red;font-size:12px">Notes</div>
<div id="loopOctave"style="color:blue;font-size:12px">Octaves</div>
<div id="loopDurations"style="color:green;font-size:12px">Durations</div><br>

<div width="400" height="200" name="testSpot" id="testSpot"><!-- string being sent --></div>

<br><br>

<div width="400" height="200" name="myDivName" id="myDivId"> output here </div><br>

</font>
</body>
</html>