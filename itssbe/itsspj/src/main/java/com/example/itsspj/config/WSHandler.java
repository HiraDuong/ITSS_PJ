package com.example.itsspj.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.*;

@Slf4j
public class WSHandler implements WebSocketHandler {



    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("New connection established on session: " + session.getId());
        session.sendMessage(new TextMessage("Hello, welcome to the server"));
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        log.info("Message received on session: " + session.getId());
        log.info("Message content: " + message.getPayload());
        session.sendMessage(new TextMessage("Message received: " + message.getPayload()));

        Thread.sleep(2000);
        session.sendMessage(new TextMessage("Message received: " + message.getPayload()));
        log.info("Response sent: " + message.getPayload());
    }


    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("Error on session: " + session.getId(), exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.info("Connection closed on session: " + session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private static class ResponseMessage {
        public String type;
        public String content;

        public ResponseMessage(String type, String content) {
            this.type = type;
            this.content = content;
        }
    }
}
