void setup(){
    
    Spark.function("my-main", myMain);
    Serial1.begin(9600);
    
    //RGB.control(true);
    //RGB.color(0, 255, 255);  //cyan
    RGB.brightness(1);    // 1=very low light, 255 = max
}

void loop() { } //PUT YOUR LOOP CODE HERE

int myMain(String myCode) {
    
    myCode.toUpperCase();           // set argument to uppercase--remove for better security
    
    delay(100);
    Serial1.print(myCode);
    digitalWrite(7, HIGH);
    delay(500);
    digitalWrite(7, LOW);
    delay(500);
    
    return 1;
}
