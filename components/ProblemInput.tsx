
import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface ProblemInputProps {
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

const ProblemInput: React.FC<ProblemInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || image) && !isLoading) {
      onSendMessage(input, image || undefined);
      setInput('');
      setImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const base64 = readerEvent.target?.result as string;
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        {image && (
          <div className="relative inline-block mb-3">
            <img src={image} alt="Preview" className="h-24 w-auto rounded-lg border border-slate-300 shadow-sm" />
            <button 
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-colors"
            title="Upload image of your problem"
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your question or explain what you're working on..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 py-2 resize-none max-h-32 scrollbar-hide"
          />
          
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !image) || isLoading}
            className={`p-2 rounded-xl transition-all ${
              (input.trim() || image) && !isLoading
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={22} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Socratis helps you think. It will not solve the problem for you, but will guide you to the solution.
        </p>
      </div>
    </div>
  );
};

export default ProblemInput;
