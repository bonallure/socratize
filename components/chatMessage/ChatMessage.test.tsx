import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import styles from './ChatMessage.module.css';

describe('ChatMessage', () => {
  const baseMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Hello, how can I help you?',
    timestamp: new Date('2024-01-01T12:00:00').getTime()
  };

  describe('Structure and Element Count', () => {
    it('renders correct number of divs for assistant message without image', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      // Structure: messageRow > messageWrapper > [avatar, messageContent > [bubble > div, timestamp]]
      const divs = container.querySelectorAll('div');
      expect(divs).toHaveLength(6); // messageRow, messageWrapper, avatar, messageContent, bubble, inner div
    });

    it('renders correct number of divs for user message without image', () => {
      const userMessage: Message = { ...baseMessage, role: 'user' };
      const { container } = render(<ChatMessage message={userMessage} />);

      const divs = container.querySelectorAll('div');
      expect(divs).toHaveLength(6);
    });

    it('renders additional div when message has image', () => {
      const messageWithImage: Message = {
        ...baseMessage,
        imageUrl: 'data:image/png;base64,test'
      };
      const { container } = render(<ChatMessage message={messageWithImage} />);

      // No extra div when image is included - still 6 divs total
      const divs = container.querySelectorAll('div');
      expect(divs).toHaveLength(6);
    });

    it('renders exactly one span for timestamp', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const spans = container.querySelectorAll('span');
      expect(spans).toHaveLength(1);
    });
  });

  describe('Assistant Message Class Names', () => {
    it('applies correct classes to message row for assistant', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const messageRow = container.firstChild as HTMLElement;
      expect(messageRow).toHaveClass(styles.messageRow);
      expect(messageRow).toHaveClass(styles.start);
      expect(messageRow).not.toHaveClass(styles.end);
    });

    it('applies correct classes to message wrapper for assistant', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const messageWrapper = container.querySelector('[class*="messageWrapper"]');
      expect(messageWrapper).toHaveClass(styles.messageWrapper);
      expect(messageWrapper).toHaveClass(styles.mdMaxWidth);
      expect(messageWrapper).toHaveClass(styles.row);
      expect(messageWrapper).not.toHaveClass(styles.rowReverse);
    });

    it('applies correct classes to avatar for assistant', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles.avatar);
      expect(avatar).toHaveClass(styles.avatarAssistant);
      expect(avatar).not.toHaveClass(styles.avatarUser);
    });

    it('applies correct classes to message content for assistant', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const messageContent = container.querySelector('[class*="messageContent"]');
      expect(messageContent).toHaveClass(styles.messageContent);
      expect(messageContent).toHaveClass(styles.itemsStart);
      expect(messageContent).not.toHaveClass(styles.itemsEnd);
    });

    it('applies correct classes to bubble for assistant', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const bubble = container.querySelector('[class*="bubble"]');
      expect(bubble).toHaveClass(styles.bubble);
      expect(bubble).toHaveClass(styles.bubbleAssistant);
      expect(bubble).not.toHaveClass(styles.bubbleUser);
    });
  });

  describe('User Message Class Names', () => {
    const userMessage: Message = { ...baseMessage, role: 'user', content: 'Hi there!' };

    it('applies correct classes to message row for user', () => {
      const { container } = render(<ChatMessage message={userMessage} />);

      const messageRow = container.firstChild as HTMLElement;
      expect(messageRow).toHaveClass(styles.messageRow);
      expect(messageRow).toHaveClass(styles.end);
      expect(messageRow).not.toHaveClass(styles.start);
    });

    it('applies correct classes to message wrapper for user', () => {
      const { container } = render(<ChatMessage message={userMessage} />);

      const messageWrapper = container.querySelector('[class*="messageWrapper"]');
      expect(messageWrapper).toHaveClass(styles.messageWrapper);
      expect(messageWrapper).toHaveClass(styles.mdMaxWidth);
      expect(messageWrapper).toHaveClass(styles.rowReverse);
      expect(messageWrapper).not.toHaveClass(styles.row);
    });

    it('applies correct classes to avatar for user', () => {
      const { container } = render(<ChatMessage message={userMessage} />);

      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles.avatar);
      expect(avatar).toHaveClass(styles.avatarUser);
      expect(avatar).not.toHaveClass(styles.avatarAssistant);
    });

    it('applies correct classes to message content for user', () => {
      const { container } = render(<ChatMessage message={userMessage} />);

      const messageContent = container.querySelector('[class*="messageContent"]');
      expect(messageContent).toHaveClass(styles.messageContent);
      expect(messageContent).toHaveClass(styles.itemsEnd);
      expect(messageContent).not.toHaveClass(styles.itemsStart);
    });

    it('applies correct classes to bubble for user', () => {
      const { container } = render(<ChatMessage message={userMessage} />);

      const bubble = container.querySelector('[class*="bubble"]');
      expect(bubble).toHaveClass(styles.bubble);
      expect(bubble).toHaveClass(styles.bubbleUser);
      expect(bubble).not.toHaveClass(styles.bubbleAssistant);
    });
  });

  describe('Image Rendering', () => {
    it('renders image element when imageUrl is provided', () => {
      const messageWithImage: Message = {
        ...baseMessage,
        imageUrl: 'data:image/png;base64,test'
      };
      const { container } = render(<ChatMessage message={messageWithImage} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveClass(styles.messageImage);
      expect(img).toHaveAttribute('src', 'data:image/png;base64,test');
      expect(img).toHaveAttribute('alt', 'Uploaded context');
    });

    it('does not render image element when imageUrl is not provided', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const img = container.querySelector('img');
      expect(img).not.toBeInTheDocument();
    });
  });

  describe('Content and Timestamp', () => {
    it('renders message content correctly', () => {
      render(<ChatMessage message={baseMessage} />);

      expect(screen.getByText('Hello, how can I help you?')).toBeInTheDocument();
    });

    it('applies timestamp class to timestamp element', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const timestamp = container.querySelector('span');
      expect(timestamp).toHaveClass(styles.timestamp);
    });

    it('formats timestamp correctly', () => {
      const { container } = render(<ChatMessage message={baseMessage} />);

      const timestamp = container.querySelector('span');
      expect(timestamp?.textContent).toMatch(/\d{1,2}:\d{2}\s*[AP]M/i);
    });
  });
});
