const uint8_t Led_Score = 6;
const uint8_t Led_Die = 9;

void setup()
{
  pinMode(Led_Score, OUTPUT);
  pinMode(Led_Die, OUTPUT);
  Serial.begin(9600);
}

void Score(int LedPin)
{
  for (int i = 1; i < 5; i++)
  {
    digitalWrite(LedPin, HIGH);
    delay((i * 100) / 2);
    digitalWrite(LedPin, LOW);
    delay((i * 100) / 2);
  }
}

void loop()
{
  if (Serial.available() > 0)
  {
    char data = Serial.read();
    if (data == 'M') {
      Score(Led_Score);
    }
    if (data == 'N') {
      Score(Led_Die);
    }
  }
}

