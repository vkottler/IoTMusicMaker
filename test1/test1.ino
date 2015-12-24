#include <rgb_lcd.h>
#include <Wire.h>
#include "pitches.h"
rgb_lcd lcd;

const int reg[7][7] =  {{ NOTE_B0, NOTE_C1, NOTE_D1, NOTE_E1, NOTE_F1, NOTE_G1, NOTE_A1 },
                        { NOTE_B1, NOTE_C2, NOTE_D2, NOTE_E2, NOTE_F2, NOTE_G2, NOTE_A2 },
                        { NOTE_B2, NOTE_C3, NOTE_D3, NOTE_E3, NOTE_F3, NOTE_G3, NOTE_A3 },
                        { NOTE_B3, NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4 },
                        { NOTE_B4, NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5 },
                        { NOTE_B5, NOTE_C6, NOTE_D6, NOTE_E6, NOTE_F6, NOTE_G6, NOTE_A6 },
                        { NOTE_B6, NOTE_C7, NOTE_D7, NOTE_E7, NOTE_F7, NOTE_G7, NOTE_A7 }};
                        
const int sharp[7][5] = {{ NOTE_CS1, NOTE_DS1, NOTE_FS1, NOTE_GS1, NOTE_AS1 },
                         { NOTE_CS2, NOTE_DS2, NOTE_FS2, NOTE_GS2, NOTE_AS2 },
                         { NOTE_CS3, NOTE_DS3, NOTE_FS3, NOTE_GS3, NOTE_AS3 },
                         { NOTE_CS4, NOTE_DS4, NOTE_FS4, NOTE_GS4, NOTE_AS4 },
                         { NOTE_CS5, NOTE_DS5, NOTE_FS5, NOTE_GS5, NOTE_AS5 },
                         { NOTE_CS6, NOTE_DS6, NOTE_FS6, NOTE_GS6, NOTE_AS6 },
                         { NOTE_CS7, NOTE_DS7, NOTE_FS7, NOTE_GS7, NOTE_AS7 }};

char myChar;
String myString = "";
int octave = 3;
int loopSize = 4;
int speaker = 8;
String duration = "QUARTER";
String currNote = "C";
int noteVal = NOTE_C3;
int durVal = 250;
int notes[100];
int dur[100];
int noteInd = 0;


void setup() {
  Serial.begin(9600);
  lcd.begin(16,2);
  lcd.setRGB(255, 255, 255);
  pinMode(4, OUTPUT);
  lcd.print("Vaughn's Music");
  lcd.setCursor(0,1);
  lcd.print("Box V 2.0");
  delay(5000); // need to replace with a cool intro song
  lcd.clear();
  lcd.setCursor(0,0);
  showValues();
}

void loop() {

  if (Serial.available() > 0) {
    digitalWrite(4, HIGH);
    delay(100);
    digitalWrite(4, LOW);
    delay(100);
    digitalWrite(4, HIGH);
    delay(100);
    digitalWrite(4, LOW);
    delay(100);
    while (Serial.available() > 0) { myString += char(Serial.read()); }
  }

  // process String
  //
  // eighth, quarter, half, full = durations
  // S1-30 = loopSize
  // O1-7 = octave
  // Regular notes: B, C, D, E, F, G, A
  // Sharp notes: #C, #D, #F, #G, #A
  // choose = choose button
  // listen = listen button

  // handle size input
  if (myString.charAt(0) == 'S') { 
    loopSize = myString.substring(1).toInt(); updateSize(); myString = "";
    resetSong();
    playDiddy1(loopSize);
    noteInd = 0;
  }

  // handle octave input
  else if (myString.charAt(0) == 'O') { 
    octave = int(myString.charAt(1)) - 48;
    updateOct(); listenTo(noteVal);
    myString = "";
  }

  // choose button
  else if (myString.equals("CHOOSE")) { addNote(0); myString = ""; }

  // quit button
  else if (myString.equals("QUIT")) { myString = ""; }

  // preview button
  else if (myString.equals("PREV")) { playLoopOnce(); myString = ""; }

  else if (myString.equals("ERASE")) { eraseNote(); myString = ""; }

  // rest button
  else if (myString.equals("REST")) { addNote(1); myString = ""; }

  else if (myString.equals("CLEAR")) { resetSong(); myString = ""; }

  // durations
  else if (myString.equals("EIGHTH") || myString.equals("QUARTER") || myString.equals("HALF") || myString.equals("FULL") || myString.equals("IXTH")) { 
    duration = myString; updateDur(); listenTo(noteVal); myString = "";
  }

  // new note was chosen
  else { if (!myString.equals("") && myString.length() < 4) { currNote = myString; noteVal = getNote(currNote); updateNote(); listenTo(noteVal); myString = ""; }}

  delay(100);
}

void eraseNote() {
  if (noteInd == 0) { notes[0] = 0; dur[0] = 0; }
  else if (noteInd > 0) { notes[noteInd] = 0; dur[noteInd] = 0; noteInd--; }
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(loopSize - noteInd);
  lcd.print(" notes left.");
  playDiddy2();
  lcd.clear();
  showValues();
}

// 0 for notes, 1 for rest
void addNote(int type) {
  if (type == 1) { notes[noteInd] = 0; }
  else { notes[noteInd] = noteVal; }
  dur[noteInd] = durVal;
  noteInd++;
  lcd.clear();
  lcd.setCursor(0,0);
  if (type == 1) { lcd.print("R"); }
  else { lcd.print(currNote); }
  lcd.setCursor(0,4);
  lcd.print(duration);
  lcd.setCursor(0,1);
  lcd.print(loopSize - noteInd);
  lcd.print(" notes left.");
  if (type == 1) { playDiddy3(); }
  else {
    tone(speaker, noteVal, 50); 
    delay(75);
    tone(speaker, noteVal, 50);
    delay(1250);
  }
  if (noteInd >= loopSize) { playLoop(); }
  lcd.clear();
  showValues();
}

void updateDur() {
  lcd.setCursor(8,0);
  lcd.print("Dur:");
  lcd.print(duration.substring(0, 4));
  switch (duration.charAt(0)) {
    case 'E': durVal = 125; break;
    case 'Q': durVal = 250; break;
    case 'H': durVal = 500; break;
    case 'F': durVal = 1000; break;
    case 'I': durVal = 63; break;
  }
}

void playLoopOnce() {
  for (int i = 0; i < noteInd; i++) {
    if (notes[i] == 0) { delay(dur[i] * 1.3); }
    else { tone(speaker, notes[i], dur[i]); delay(dur[i] * 1.3); }
  }
}

void updateOct() {
  noteVal = getNote(currNote);
  lcd.setCursor(0,1);
  lcd.print("Octave:");
  lcd.print(octave);
}

void updateSize() {
  lcd.setCursor(0,0);
  lcd.print("Size:");
  lcd.print(loopSize);
  lcd.print(" ");
}
void updateNote() {
  lcd.setCursor(9, 1);
  lcd.print("Note:");
  lcd.print(currNote);
  lcd.print(" ");
}

void showValues() {
  updateDur();
  updateOct();
  updateSize();
  updateNote();
}

void playDiddy1(int amount) {
  for (int i = 0; i < amount; i++) { 
    if (i % 4 == 0) tone(speaker, NOTE_C3, 75);
    else if (i % 4 == 1) tone(speaker, NOTE_F3, 75);
    else if (i % 4 == 2) tone(speaker, NOTE_E3, 75);
    else tone(speaker, NOTE_D3, 75);
    delay (100);
  }
}

void playDiddy2() {
  tone(speaker, NOTE_C3, 75); delay (100);
  tone(speaker, NOTE_D3, 75); delay (100);
  tone(speaker, NOTE_E3, 75); delay (100);
  tone(speaker, NOTE_F3, 75); delay (100);
}

void playDiddy3() {
  tone(speaker, NOTE_C3, 75); delay (100);
  tone(speaker, NOTE_D3, 75); delay (100);
  tone(speaker, NOTE_E3, 75); delay (100);
  tone(speaker, NOTE_F3, 75); delay (100);
  tone(speaker, NOTE_E3, 75); delay (100);
  tone(speaker, NOTE_D3, 75); delay (100);
  tone(speaker, NOTE_C3, 75); delay (100);
}

void listenTo(int note) { tone(speaker, note, durVal); delay(durVal * 1.3); }

int getNote(String note) {
  int index = 0;
  // sharp
  if (note.charAt(0) == '#') {
    switch (note.charAt(1)) {
      case 'C': index = 0; break;
      case 'D': index = 1; break;
      case 'F': index = 2; break;
      case 'G': index = 3; break;
      case 'A': index = 4; break;
    }
    return sharp[octave][index];
  }
  // non-sharp
  else {
    switch (note.charAt(0)) {
      case 'B': index = 0; break;
      case 'C': index = 1; break;
      case 'D': index = 2; break;
      case 'E': index = 3; break;
      case 'F': index = 4; break;
      case 'G': index = 5; break;
      case 'A': index = 6; break;
    }
    return reg[octave][index];
  }
}

bool checkQuit() {
  String temp = "";
  if (Serial.available() > 0) { while (Serial.available() > 0) { temp += char(Serial.read()); }}
  if (temp.equals("QUIT") || temp.equals("CLEAR")) { return true; }
  return false;
}

void playLoop() { 
  while(!checkQuit()) { 
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Enjoy the music!");
    lcd.setCursor(0,1);
    for (int i = 0; i < loopSize; i++) {
      if (notes[i] == 0) { delay(dur[i] * 1.3); }
      else { tone(speaker, notes[i], dur[i]); delay(dur[i] * 1.3); }
      lcd.print("-");
      if (i == 15) {
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Enjoy the music!");
        lcd.setCursor(0,1);
      }
    } 
  }
  noteInd = 0;
  lcd.clear();
  showValues();
  resetSong();
}

void resetSong() { noteInd = 0; for (int i = 0; i < 30; i++) { notes[i] = 0; dur[i] = 0; }}

