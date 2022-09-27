float temp;
void setup()
{
pinMode(6,INPUT);
pinMode(12,OUTPUT);
Serial.begin(9600);
}
 void loop()
[
if(digitalRead(6)==HIGH)
{
tone(12,523,1000);
Serial.println("Unknown Detected");
}
else{
boTone(12);
}
temp=analogRead(A1);
temp=temp*0.48828125;
if(temp>=110.84){
tone(12,100,2000);
Serial.print("Above 60 c Temperature...");
}
else{
noTone(12);
}
