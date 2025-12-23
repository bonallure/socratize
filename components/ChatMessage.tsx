
import React from 'react';
import { Message } from '../types';
import { User, Cpu, Lightbulb } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`flex w-full mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isAssistant ? 'bg-indigo-600 text-white mr-3' : 'bg-slate-200 text-slate-600 ml-3'
        }`}>
          {isAssistant ? <Cpu size={20} /> : <User size={20} />}
        </div>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm ${
            isAssistant 
              ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}>
            {message.imageUrl && (
              <img 
                src={message.imageUrl} 
                alt="Uploaded context" 
                className="max-w-full rounded-lg mb-3 border border-slate-200"
              />
            )}
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
