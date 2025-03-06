import asyncio
import websockets
import logging

# 创建一个日志记录器
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# 创建日志格式化器，包含时间戳
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# 创建文件处理器并设置级别
file_handler = logging.FileHandler('redirect_server.log', encoding='utf-8')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter)  # 应用格式化器

# 创建控制台处理器并设置级别
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)  # 应用格式化器

# 将处理器添加到日志记录器
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 存储所有WebSocket客户端的集合
clients = set()

# 用于存储已接收的消息，以便去重
received_messages = {}


# WebSocket 服务器处理逻辑
async def ws_handler(websocket):
    clients.add(websocket)
    logger.info(f"New WebSocket connection from {websocket.remote_address}")
    try:
        # 等待连接关闭
        await websocket.wait_closed()
    finally:
        clients.remove(websocket)
        logger.info(f"WebSocket connection closed from {websocket.remote_address}")


# UDP 监听逻辑，作为异步任务
async def udp_server():
    loop = asyncio.get_event_loop()
    logger.info("Starting UDP server on port 5005")  # 添加日志记录
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: UdpProtocol(),
        local_addr=('0.0.0.0', 5005))  # 绑定UDP监听地址和端口

    try:
        while True:
            await asyncio.sleep(3600)  # Keep the task alive
    except asyncio.CancelledError:
        transport.close()
        logger.info("UDP server stopped")  # 添加日志记录


class UdpProtocol(asyncio.DatagramProtocol):
    def datagram_received(self, data, addr):
        message = data.decode()
        logger.info(f"Received UDP message from {addr}: {message}")

        # 在这里添加你的判断逻辑
        if not self.validate_message(message):
            return
        the_last_message = message
        # 记录当前连接的客户端数量
        clients_count = len(clients)
        if clients_count > 0:
            logger.info(f"Forwarding message to {clients_count} clients: {message}")
            for ws in clients:
                asyncio.create_task(ws.send(message))
        else:
            logger.info("No clients connected to forward message: {message}")

    def validate_message(self, message):
        # 示例判断逻辑：检查消息是否包含特定字符串
        parts = message.rsplit(',', 1)
        if len(parts) != 2:
            logger.warning(f"Invalid message format: {message}")
            return False
        key, timestamp = parts
        if key in received_messages:
            if abs(float(timestamp) - received_messages[key]) < 600:
                logger.info(f"Duplicate message received: {message}")
                return False
        received_messages[key] = float(timestamp)
        info = key.split(",")
        if len(info) == 2:
            if '0' in received_messages:
                last_message = received_messages['0']
                old = last_message.split(",")
                if info[0] == old[0] and int(int(info[1]) / 13 + 1) == int(int(old[1]) / 13 + 1) \
                        or info[1] == old[1] and int(int(info[0]) / 13 + 1) == int(int(old[0]) / 13 + 1):
                    logger.warning(f"message similar to last {last_message} - current: {message}")
                    return False
            received_messages['0'] = message
        elif len(info) == 4:
            table_id, card1, card2, table_name = info
            table_key = f'{table_id}-{table_name}'
            if table_key in received_messages:
                last_message = received_messages[table_key]
                olds = last_message.split(",")
                if card1 == olds[1] and int(int(card2) / 13 + 1) == int(int(olds[2]) / 13 + 1) \
                        or card2 == olds[2] and int(int(card1) / 13 + 1) == int(int(olds[1]) / 13 + 1):
                    logger.warning(f"message similar to last {last_message} - current: {message}")
                    return False
            received_messages[table_key] = message
        else:
            logger.info(f"Invalid message format: {message}")
            return False

        return True


async def main():
    # 启动WebSocket服务器
    async with websockets.serve(ws_handler, '0.0.0.0', 8765):  # WebSocket服务监听地址和端口
        logger.info("WebSocket server started on port 8765")

        # 启动UDP监听器
        udp_listener = asyncio.create_task(udp_server())

        try:
            await asyncio.Future()  # 运行直到被手动停止
        except asyncio.CancelledError:
            udp_listener.cancel()
            await udp_listener


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped.")
