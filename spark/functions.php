<?php 
function showRegularNotes() {
	$notes = array( 'B', 'C', 'D', 'E', 'F', 'G', 'A' );
	$numNotes = count($notes);
	$spaces = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	echo '<div id="regNotes" style="color:brown"><form>&nbsp;&nbsp;&nbsp;';
	for ($i = 0; $i < $numNotes; $i++) { echo $notes[$i]; echo $spaces; } echo '<br>';
	for ($i = 0; $i < $numNotes; $i++) {
		echo '<input type="radio" id="Rnote'.$i.'" name="note" value="'.$notes[$i].'" onChange="javascript:showNote('.$i.', 0)">&nbsp;&nbsp;&nbsp;';
	}
	echo '<br>';
	echo '</form></div>';
}

function showSharpNotes() {
	$notes = array( '#C' , '#D' , '#F' , '#G' , '#A' );
	$numNotes = count($notes);
	echo '<div id="sharpNotes" style="display:none;color:purple"><form>';
	$spaces = '&nbsp;&nbsp;&nbsp;&nbsp;';
	echo '&nbsp;';
	for ($i = 0; $i < $numNotes; $i++) { echo $notes[$i]; echo $spaces; } echo '<br>';
	for ($i = 0; $i < $numNotes; $i++) {
		echo '<input type="radio" id="Snote'.$i.'" name="note" value="'.$notes[$i].'" onChange="javascript:showNote('.$i.', 1)">&nbsp;&nbsp;&nbsp;';
	}
	echo '<br>';
	echo '</form></div>';
}

function noteTypeForm() {
	//echo '<br>Choose note type: <br>';
	echo '<form>';
	echo 'Regular: <input type="radio" name="choice" value="regular" checked onChange="javascript:showRegular()"><br>';
	echo '<i>Sharp:</i> <input type="radio" name="choice" value="sharp" onChange="javascript:showSharp()">';
	echo '</form>';
}
?>