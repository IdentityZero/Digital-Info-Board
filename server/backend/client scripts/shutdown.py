import json
import os
import asyncio
import websockets

URI = "ws://localhost:8000/api/ws/field-devices/"


def shutdown_device():
    if os.name == "nt":
        pass
        # os.system("shutdown /s /t 1")
    elif os.name == "posix":
        os.system("sudo sleep 10 && sudo shutdown -h now")


def restart_device():
    if os.name == "nt":
        pass
    elif os.name == "posix":
        os.system("sudo sleep 10 && sudo reboot")


async def connect_to_websocket():

    async with websockets.connect(URI) as websocket:
        await websocket.send(
            json.dumps({"type": "rpi_reply_on", "message": "Raspberry Pi is On."})
        )
        while True:
            response = await websocket.recv()

            if "shutdown_rpi" in response:
                shutdown_device()
            elif "restart_rpi" in response:
                restart_device()
            elif "ask_rpi_on" in response:
                await websocket.send(
                    json.dumps(
                        {"type": "rpi_reply_on", "message": "Raspberry Pi is On."}
                    )
                )


asyncio.run(connect_to_websocket())
