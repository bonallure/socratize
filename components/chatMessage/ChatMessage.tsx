import React from 'react';
import { Message } from '../../types';
import { User, Cpu } from 'lucide-react';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`${styles.messageRow} ${isAssistant ? styles.start : styles.end}`}>
      <div className={`${styles.messageWrapper} ${styles.mdMaxWidth} ${isAssistant ? styles.row : styles.rowReverse}`}>
        
        {/* Avatar */}
        <div className={`${styles.avatar} ${isAssistant ? styles.avatarAssistant : styles.avatarUser}`}>
          {isAssistant ? <Cpu size={20} /> : <User size={20} />}
        </div>
        
        {/* Message Content */}
        <div className={`${styles.messageContent} ${isAssistant ? styles.itemsStart : styles.itemsEnd}`}>
          
          {/* Message Bubble */}
          <div className={`${styles.bubble} ${isAssistant ? styles.bubbleAssistant : styles.bubbleUser}`}>
            
            {/* Optional Image */}
            {message.imageUrl && (
              <img 
                src={message.imageUrl} 
                alt="Uploaded context" 
                className={styles.messageImage}
              />
            )}

            {/* Text Content */}
            <div>
              {message.content}
            </div>
          </div>

          {/* Timestamp */}
          <span className={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
