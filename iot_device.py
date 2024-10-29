import random
import time
import firebase_admin
from firebase_admin import credentials, db
from gpiozero import LED

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://opdracht1mobile-default-rtdb.europe-west1.firebasedatabase.app/'
})

# References to temperature and light control in Firebase
temperature_ref = db.reference('sensorData/temperature')
light_ref = db.reference('lightControl/status')

# Setup external LED on GPIO pin 17
led = LED(17)

# Function to monitor light control and update LED state
def monitor_light_control():
    status = light_ref.get()
    print(f"Current light status: {status}")
    if status == "on":
        led.on()
    else:
        led.off()

# Function to send random temperature data and check light status
def send_data_and_check_light():
    while True:
        random_temperature = round(random.uniform(15, 30), 2)  # Simulated temperature
        temperature_ref.set(random_temperature)
        print(f"Sent temperature: {random_temperature}°C")

        # Check light status and control the LED
        monitor_light_control()

        time.sleep(5)  # Interval for sending temperature and checking light status

# Run the function
send_data_and_check_light()