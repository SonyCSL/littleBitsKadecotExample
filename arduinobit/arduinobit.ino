const int  buttonPin = A0;
int inState = 0 , outState = LOW ;

// Remove chattering
int NO_READ_COUNTDOWN_MAX = 1000 ;
int noReadCount = 0 ;

void setup() {
  /*----input----*/
  pinMode(buttonPin, INPUT);
  /*----output----*/
  pinMode(5,OUTPUT);
  /*----Serial----*/
  Serial.begin(9600);
}

void loop() {
  char inChar = (char)Serial.read() ;
  if( inChar == '1' && outState == LOW ){
    outState = HIGH ;
    setLED(outState);
  } else if (inChar == '0' && outState == HIGH){
    outState = LOW ;
    setLED(outState);
  }

  if( noReadCount!=0 ){
    --noReadCount ;
    return ;
  }
  int curState = digitalRead(buttonPin);
  
  if(inState!=curState){
    inState=curState;
    sendSerial(curState);

    noReadCount = NO_READ_COUNTDOWN_MAX ;
  }

}

void setLED(int state){
  if (state == HIGH) {
    digitalWrite(5,HIGH);
  }else{
    digitalWrite(5,LOW);
  } 
}

void sendSerial(int state){
  if (state == HIGH) {
      Serial.print("1");
  }else{
      Serial.print("0");
  } 
}

