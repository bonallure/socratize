import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ProblemInput from './ProblemInput';
import styles from './ProblemInput.module.css';

describe('ProblemInput', () => {
  const mockOnSendMessage = vi.fn();

  const defaultProps = {
    onSendMessage: mockOnSendMessage,
    isLoading: false
  };

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  describe('Structure and Element Count', () => {
    it('renders correct number of divs without image preview', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      // Structure: container > innerWrapper > inputBar
      const divs = container.querySelectorAll('div');
      expect(divs).toHaveLength(3);
    });

    it('renders additional divs when image is uploaded', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(input, file);

      await waitFor(() => {
        const divs = container.querySelectorAll('div');
        expect(divs).toHaveLength(4); // +1 for imagePreviewWrapper
      });
    });

    it('renders exactly 2 buttons', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2); // Upload button + Send button
    });

    it('renders exactly 1 textarea', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const textareas = container.querySelectorAll('textarea');
      expect(textareas).toHaveLength(1);
    });

    it('renders exactly 1 hidden file input', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const fileInputs = container.querySelectorAll('input[type="file"]');
      expect(fileInputs).toHaveLength(1);
    });

    it('renders exactly 1 paragraph for footnote', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(1);
    });
  });

  describe('Container Class Names', () => {
    it('applies correct classes to main container', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(styles.container);
    });

    it('applies correct classes to inner wrapper', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const innerWrapper = container.querySelector('[class*="innerWrapper"]');
      expect(innerWrapper).toHaveClass(styles.innerWrapper);
    });

    it('applies correct classes to input bar', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const inputBar = container.querySelector('[class*="inputBar"]');
      expect(inputBar).toHaveClass(styles.inputBar);
    });
  });

  describe('Upload Button Class Names', () => {
    it('applies correct classes to upload button', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const uploadButton = container.querySelector('button[title="Upload image of your problem"]');
      expect(uploadButton).toHaveClass(styles.uploadButton);
    });
  });

  describe('Textarea Class Names', () => {
    it('applies correct classes to textarea', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass(styles.textarea);
    });
  });

  describe('Send Button Class Names - Disabled State', () => {
    it('applies disabled classes when input is empty and no image', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const sendButton = container.querySelectorAll('button')[1]; // Second button is send
      expect(sendButton).toHaveClass(styles.sendButton);
      expect(sendButton).toHaveClass(styles.sendButtonDisabled);
      expect(sendButton).not.toHaveClass(styles.sendButtonEnabled);
      expect(sendButton).toBeDisabled();
    });

    it('applies disabled classes when isLoading is true', () => {
      const { container } = render(<ProblemInput {...defaultProps} isLoading={true} />);

      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Hello' } });

      const sendButton = container.querySelectorAll('button')[1];
      expect(sendButton).toHaveClass(styles.sendButton);
      expect(sendButton).toHaveClass(styles.sendButtonDisabled);
      expect(sendButton).not.toHaveClass(styles.sendButtonEnabled);
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Send Button Class Names - Enabled State', () => {
    it('applies enabled classes when input has text', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Hello' } });

      const sendButton = container.querySelectorAll('button')[1];
      expect(sendButton).toHaveClass(styles.sendButton);
      expect(sendButton).toHaveClass(styles.sendButtonEnabled);
      expect(sendButton).not.toHaveClass(styles.sendButtonDisabled);
      expect(sendButton).not.toBeDisabled();
    });

    it('applies enabled classes when image is uploaded', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        // After uploading, there are 3 buttons: upload, remove, send (in that order)
        const sendButton = container.querySelectorAll('button')[2];
        expect(sendButton).toHaveClass(styles.sendButtonEnabled);
        expect(sendButton).not.toBeDisabled();
      });
    });
  });

  describe('Image Preview Class Names', () => {
    it('applies correct classes to image preview wrapper when image uploaded', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const previewWrapper = container.querySelector('[class*="imagePreviewWrapper"]');
        expect(previewWrapper).toHaveClass(styles.imagePreviewWrapper);
      });
    });

    it('applies correct classes to preview image', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const previewImage = container.querySelector('img');
        expect(previewImage).toHaveClass(styles.previewImage);
      });
    });

    it('applies correct classes to remove image button', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const removeButton = container.querySelector('[class*="removeImageButton"]');
        expect(removeButton).toHaveClass(styles.removeImageButton);
      });
    });
  });

  describe('Footnote Class Names', () => {
    it('applies correct classes to footnote', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const footnote = container.querySelector('p');
      expect(footnote).toHaveClass(styles.footnote);
    });
  });

  describe('Content Rendering', () => {
    it('renders placeholder text correctly', () => {
      render(<ProblemInput {...defaultProps} />);

      const textarea = screen.getByPlaceholderText(
        "Type your question or explain what you're working on..."
      );
      expect(textarea).toBeInTheDocument();
    });

    it('renders footnote text correctly', () => {
      render(<ProblemInput {...defaultProps} />);

      expect(
        screen.getByText(/Socratize helps you think/)
      ).toBeInTheDocument();
    });

    it('does not render image preview initially', () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).not.toBeInTheDocument();
    });
  });

  describe('Image Upload Flow', () => {
    it('shows image preview after file upload', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('alt', 'Preview');
      });
    });

    it('removes image preview when remove button is clicked', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      const removeButton = container.querySelector('[class*="removeImageButton"]') as HTMLButtonElement;
      fireEvent.click(removeButton);

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).not.toBeInTheDocument();
      });
    });

    it('renders remove button with X icon', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const removeButton = container.querySelector('[class*="removeImageButton"]');
        expect(removeButton).toBeInTheDocument();
        // Button should contain the X icon from lucide-react
        expect(removeButton?.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Element Count Changes with State', () => {
    it('increases button count when image is uploaded (adds remove button)', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      let buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        buttons = container.querySelectorAll('button');
        expect(buttons).toHaveLength(3); // Upload + Send + Remove
      });
    });

    it('decreases button count after removing image', async () => {
      const { container } = render(<ProblemInput {...defaultProps} />);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        const buttons = container.querySelectorAll('button');
        expect(buttons).toHaveLength(3);
      });

      const removeButton = container.querySelector('[class*="removeImageButton"]') as HTMLButtonElement;
      fireEvent.click(removeButton);

      await waitFor(() => {
        const buttons = container.querySelectorAll('button');
        expect(buttons).toHaveLength(2); // Back to Upload + Send
      });
    });
  });
});
