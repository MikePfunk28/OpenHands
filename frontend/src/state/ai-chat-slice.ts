import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface AIChatState {
  messages: ChatMessage[];
}

const initialState: AIChatState = {
  messages: [],
};

export const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addChatMessage, clearChat } = aiChatSlice.actions;

export default aiChatSlice.reducer;
