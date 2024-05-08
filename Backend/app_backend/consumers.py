import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        logger.info(f"Received message: {message}")

        # Echo the message back to the sender
        await self.send(text_data=json.dumps({
            'message': message
        }))

        logger.info(f"Sent message: {message}")
