import asyncio
import websockets
import json

# Dict pentru a păstra conexiunile clienților (cheie: id cerere sau user)
clients = {}

async def handler(websocket):
    # Primește identificatorul clientului la conectare
    client_id = await websocket.recv()
    clients[client_id] = websocket
    print(f"Client conectat: {client_id}")
    try:
        async for message in websocket:
            # Poți procesa mesaje de la client dacă vrei
            print(f"Primit de la {client_id}: {message}")
    except websockets.ConnectionClosed:
        print(f"Client deconectat: {client_id}")
    finally:
        clients.pop(client_id, None)

async def trimite_aprobare(client_id, data):
    ws = clients.get(client_id)
    if ws:
        await ws.send(json.dumps(data))

async def main():
    async with websockets.serve(handler, "localhost", 8770):
        print("WebSocket server pornit pe ws://localhost:8770")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
