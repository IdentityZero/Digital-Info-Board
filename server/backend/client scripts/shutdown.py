import json
import os
import asyncio
import websockets


def shutdown_device():
    if os.name == "nt":
        os.system("shutdown /s /t 1")
    elif os.name == "posix":
        os.system("sudo sleep 10 && sudo shutdown -h now")


async def connect_to_websocket():
    uri = "ws://localhost:8001/api/ws/field-devices/"

    async with websockets.connect(uri) as websocket:
        await websocket.send(
            json.dumps({"type": "rpi_reply_on", "message": "Raspberry Pi is On."})
        )
        while True:
            response = await websocket.recv()

            if "shutdown_rpi" in response:
                shutdown_device()
            elif "ask_rpi_on" in response:
                await websocket.send(
                    json.dumps(
                        {"type": "rpi_reply_on", "message": "Raspberry Pi is On."}
                    )
                )


asyncio.run(connect_to_websocket())
