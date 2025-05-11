import requests
import time

URL = "http://localhost:8000/api/field-devices/scd40/"


def send_sensor_data(co2: int, temperature: int, humidity: int) -> None:
    response = requests.post(
        URL, {"co2": co2, "temperature": temperature, "humidity": humidity}
    )
    response.raise_for_status()


if __name__ == "__main__":
    co2 = 500
    temperature = 25
    humidity = 50
    while True:

        send_sensor_data(co2, temperature, humidity)

        co2 += 1
        temperature += 1
        humidity += 1
        time.sleep(10)
