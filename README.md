# Intelligent Chatbot with Router-Based Architecture

This project implements an intelligent chatbot built around a router-based
architecture. The system uses an LLM only for intent classification and
general conversation, while routing specific intents to deterministic
backend services.

The goal is to demonstrate controlled, reliable usage of LLMs combined with
traditional backend logic.

---

## Features

- LLM-based intent classification using a dedicated system prompt
- Deterministic backend handling for:
  - Mathematical calculations
  - Currency exchange rates
  - Weather information via an external API
- General AI chat fallback
- Persistent conversation memory across server restarts
- Clear separation between routing logic, services, and LLM usage

---

## Architecture Overview

The system is built around a central **Router** component.

### Request Flow

1. The user sends a message from the client along with a persistent
   `conversationId`.
2. An LLM-based classifier analyzes the input and returns a structured JSON
   describing the intent and extracted parameters.
3. The Router dispatches the request to the appropriate handler:
   - Math Service (deterministic)
   - Exchange Service (deterministic)
   - Weather Service (external API)
   - Chat Service (LLM fallback)
4. Conversation state is persisted on disk to allow continuity across server
   restarts.

---

## Intent Routing

| Intent    | Handler              | LLM Used |
|----------|----------------------|----------|
| Math     | math.service.ts       | No       |
| Exchange | exchange.service.ts   | No       |
| Weather  | weather.service.ts    | No (API) |
| General  | chat.service.ts       | Yes      |

---

## Conversation Persistence

The system supports conversation continuity across server restarts.

- Each conversation is identified by a unique `conversationId`.
- The client stores the `conversationId` in `localStorage`.
- The server persists the last response ID per conversation in a local JSON file.
- After a server restart, the chatbot continues the conversation using the
  stored state.

This design demonstrates basic persistence without relying on a database.

---

## Running the Project

### Server

```bash
cd packages/server
bun install
bun run dev
```