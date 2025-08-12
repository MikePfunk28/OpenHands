import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useWsClient } from '#/context/ws-client-provider';
import { Send, ClipboardCopy, CornerDownLeft } from 'lucide-react';
import { insertText } from '#/state/terminal-input-slice';
import { addChatMessage } from '#/state/ai-chat-slice';
import { RootState } from '#/store';

function AIChatPanel() {
  const [input, setInput] = useState('');
  const { send } = useWsClient();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Get messages from the Redux store
  const messages = useSelector((state: RootState) => state.aiChat.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: 'user' as const, text: input };
      // Dispatch action to add user message to the store
      dispatch(addChatMessage(userMessage));
      // Send the message to the backend
      send({ action: 'ai_chat', data: { prompt: input } });
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInsert = (text: string) => {
    dispatch(insertText(text));
  };

  return (
    <div className="h-full w-full flex flex-col p-4 bg-base-200">
      <div className="flex-grow overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-700 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === 'ai' && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={() => handleCopy(msg.text)}
                  size="sm"
                  variant="ghost"
                  className="text-neutral-400 hover:text-white"
                  aria-label="Copy"
                >
                  <ClipboardCopy size={16} />
                </Button>
                <Button
                  onClick={() => handleInsert(msg.text)}
                  size="sm"
                  variant="ghost"
                  className="text-neutral-400 hover:text-white"
                  aria-label="Insert into terminal"
                >
                  <CornerDownLeft size={16} />
                </Button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow p-2 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Translate natural language to a shell command..."
        />
        <Button
          onClick={handleSend}
          className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600"
          aria-label="Send"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
}

function AIChatTab() {
  return <AIChatPanel />;
}

export default AIChatTab;
