const int  buttonPin = A0;
int buttonState = 0;
int currentState = 0;

void setup() {
  /*----input----*/
  pinMode(buttonPin, INPUT);
  /*----output----*/
  pinMode(5,OUTPUT);
  /*----Serial----*/
  Serial.begin(9600);
}

void loop() {
  buttonState = digitalRead(buttonPin);
  
  setLED(buttonState);
  if(currentState!=buttonState){
    sendSerial(buttonState);
    currentState=buttonState;
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
      Serial.println("on");
  }else{
      Serial.println("off");
  } 
}

