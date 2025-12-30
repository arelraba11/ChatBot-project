import fs from 'fs';
import path from 'path';

type ConversationStore = Record<string, string>;

const DATA_DIR = path.join(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'conversations.json');

function loadStore(): ConversationStore {
   if (!fs.existsSync(FILE_PATH)) {
      return {};
   }

   try {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      return JSON.parse(raw) as ConversationStore;
   } catch {
      return {};
   }
}

function saveStore(store: ConversationStore): void {
   fs.mkdirSync(DATA_DIR, { recursive: true });
   fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2));
}

// Load persisted conversations on startup
let store: ConversationStore = loadStore();

export const conversationRepository = {
   getLastResponseId(conversationId: string): string | undefined {
      return store[conversationId];
   },

   setLastResponseId(conversationId: string, responseId: string): void {
      store[conversationId] = responseId;
      saveStore(store);
   },
};
