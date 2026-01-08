import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import styles from './ProblemInput.module.css';

interface ProblemInputProps {
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

const ProblemInput = ({ onSendMessage, isLoading }: ProblemInputProps) => {
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
    <div className={styles.container}>
      <div className={styles.innerWrapper}>
        {image && (
          <div className={styles.imagePreviewWrapper}>
            <img src={image} alt="Preview" className={styles.previewImage} />
            <button 
              onClick={() => setImage(null)}
              className={styles.removeImageButton}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className={styles.inputBar}>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadButton}
            title="Upload image of your problem"
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" // keeping hidden since CSS module doesn't define it
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
            className={styles.textarea}
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !image) || isLoading}
            className={`${styles.sendButton} ${
              (input.trim() || image) && !isLoading
                ? styles.sendButtonEnabled
                : styles.sendButtonDisabled
            }`}
          >
            <Send size={22} />
          </button>
        </div>

        <p className={styles.footnote}>
          Socratize helps you think. It will not solve the problem for you, but will guide you to the solution.
        </p>
      </div>
    </div>
  );
};

export default ProblemInput;
