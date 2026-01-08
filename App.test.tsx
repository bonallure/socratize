import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { TOPICS, INITIAL_SUGGESTIONS } from './constants';
import * as geminiService from './services/geminiService';
import styles from './App.module.css';

// Mock the gemini service
vi.mock('./services/geminiService', () => ({
  sendMessageToTutor: vi.fn(),
  generateProblemSteps: vi.fn()
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render - Structure and Classes', () => {
    it('renders main app container with correct class', () => {
      const { container } = render(<App />);

      const appContainer = container.firstChild as HTMLElement;
      expect(appContainer).toHaveClass(styles.appContainer);
    });

    it('renders sidebar with correct class', () => {
      const { container } = render(<App />);

      const sidebar = container.querySelector('aside');
      expect(sidebar).toHaveClass(styles.sidebar);
    });

    it('renders main content area with correct class', () => {
      const { container } = render(<App />);

      const mainContent = container.querySelector('main');
      expect(mainContent).toHaveClass(styles.mainContent);
    });

    it('renders header with correct class', () => {
      const { container } = render(<App />);

      const header = container.querySelector('header');
      expect(header).toHaveClass(styles.header);
    });

    it('renders chat area with correct class', () => {
      const { container } = render(<App />);

      const chatArea = container.querySelector('[class*="chatArea"]');
      expect(chatArea).toHaveClass(styles.chatArea);
    });
  });

  describe('Sidebar Structure and Classes', () => {
    it('renders sidebar header with logo and text', () => {
      const { container } = render(<App />);

      const sidebarHeader = container.querySelector('[class*="sidebarHeader"]');
      expect(sidebarHeader).toHaveClass(styles.sidebarHeader);

      const logoIcon = container.querySelector('[class*="logoIcon"]');
      expect(logoIcon).toHaveClass(styles.logoIcon);

      const logoText = container.querySelector('[class*="logoText"]');
      expect(logoText).toHaveClass(styles.logoText);
      expect(logoText?.textContent).toBe('Socratis');
    });

    it('renders sidebar navigation with correct class', () => {
      const { container } = render(<App />);

      const sidebarNav = container.querySelector('nav');
      expect(sidebarNav).toHaveClass(styles.sidebarNav);
    });

    it('renders workspace section with correct buttons', () => {
      const { container } = render(<App />);

      const navSections = container.querySelectorAll('[class*="navSection"]');
      expect(navSections.length).toBeGreaterThanOrEqual(2);

      expect(screen.getByText('Active Session')).toBeInTheDocument();
      expect(screen.getByText('Session History')).toBeInTheDocument();
    });

    it('applies correct classes to active session button', () => {
      const { container } = render(<App />);

      const activeButton = screen.getByText('Active Session').closest('button');
      expect(activeButton).toHaveClass(styles.navButton);
      expect(activeButton).toHaveClass(styles.navButtonActive);
    });

    it('applies correct classes to inactive nav button', () => {
      const { container } = render(<App />);

      const inactiveButton = screen.getByText('Session History').closest('button');
      expect(inactiveButton).toHaveClass(styles.navButton);
      expect(inactiveButton).toHaveClass(styles.navButtonInactive);
    });

    it('renders settings button in sidebar footer', () => {
      const { container } = render(<App />);

      const sidebarFooter = container.querySelector('[class*="sidebarFooter"]');
      expect(sidebarFooter).toHaveClass(styles.sidebarFooter);

      const settingsButton = screen.getByText('Settings').closest('button');
      expect(settingsButton).toHaveClass(styles.settingsButton);
    });
  });

  describe('Constants - TOPICS', () => {
    it('renders all topics from TOPICS constant', () => {
      render(<App />);

      TOPICS.forEach(topic => {
        expect(screen.getByText(topic)).toBeInTheDocument();
      });
    });

    it('renders correct number of topic buttons', () => {
      const { container } = render(<App />);

      const topicButtons = container.querySelectorAll('[class*="topicButton"]');
      expect(topicButtons.length).toBe(TOPICS.length);
    });

    it('applies inactive class to topic buttons initially', () => {
      const { container } = render(<App />);

      const topicButtons = container.querySelectorAll('[class*="topicButton"]');
      topicButtons.forEach(button => {
        expect(button).toHaveClass(styles.topicButtonInactive);
      });
    });

    it('applies active class when topic is clicked', () => {
      const { container } = render(<App />);

      const firstTopicButton = screen.getByText(TOPICS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstTopicButton);

      expect(firstTopicButton).toHaveClass(styles.topicButtonActive);
      expect(firstTopicButton).not.toHaveClass(styles.topicButtonInactive);
    });
  });

  describe('Header Structure and Classes', () => {
    it('renders header with title', () => {
      const { container } = render(<App />);

      const headerTitle = container.querySelector('[class*="headerTitle"]');
      expect(headerTitle).toHaveClass(styles.headerTitle);
      expect(headerTitle?.textContent).toBe("Black Boy's Code");
    });

    it('does not show live indicator initially', () => {
      const { container } = render(<App />);

      const liveIndicator = container.querySelector('[class*="liveIndicator"]');
      expect(liveIndicator).not.toBeInTheDocument();
    });

    it('renders header left and right sections', () => {
      const { container } = render(<App />);

      const headerLeft = container.querySelector('[class*="headerLeft"]');
      expect(headerLeft).toHaveClass(styles.headerLeft);

      const headerRight = container.querySelector('[class*="headerRight"]');
      expect(headerRight).toHaveClass(styles.headerRight);
    });

    it('renders search button with correct class', () => {
      const { container } = render(<App />);

      const searchButton = container.querySelector('[class*="searchButton"]');
      expect(searchButton).toHaveClass(styles.searchButton);
    });

    it('renders profile picture with correct class', () => {
      const { container } = render(<App />);

      const profilePic = container.querySelector('[class*="profilePic"]');
      expect(profilePic).toHaveClass(styles.profilePic);
    });
  });

  describe('Welcome Screen - Initial State', () => {
    it('renders welcome screen when no messages', () => {
      const { container } = render(<App />);

      const welcomeScreen = container.querySelector('[class*="welcomeScreen"]');
      expect(welcomeScreen).toBeInTheDocument();
      expect(welcomeScreen).toHaveClass(styles.welcomeScreen);
    });

    it('renders welcome icon with correct class', () => {
      const { container } = render(<App />);

      const welcomeIcon = container.querySelector('[class*="welcomeIcon"]');
      expect(welcomeIcon).toHaveClass(styles.welcomeIcon);
    });

    it('renders welcome title with correct text', () => {
      const { container } = render(<App />);

      const welcomeTitle = container.querySelector('[class*="welcomeTitle"]');
      expect(welcomeTitle).toHaveClass(styles.welcomeTitle);
      expect(welcomeTitle?.textContent).toBe('How can I help you think today?');
    });

    it('renders welcome text with correct class', () => {
      const { container } = render(<App />);

      const welcomeText = container.querySelector('[class*="welcomeText"]');
      expect(welcomeText).toHaveClass(styles.welcomeText);
    });

    it('renders suggestions grid with correct class', () => {
      const { container } = render(<App />);

      const suggestionsGrid = container.querySelector('[class*="suggestionsGrid"]');
      expect(suggestionsGrid).toHaveClass(styles.suggestionsGrid);
    });
  });

  describe('Constants - INITIAL_SUGGESTIONS', () => {
    it('renders all suggestions from INITIAL_SUGGESTIONS constant', () => {
      render(<App />);

      INITIAL_SUGGESTIONS.forEach(suggestion => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    it('renders correct number of suggestion buttons', () => {
      const { container } = render(<App />);

      const suggestionButtons = container.querySelectorAll('[class*="suggestionButton"]');
      expect(suggestionButtons.length).toBe(INITIAL_SUGGESTIONS.length);
    });

    it('applies correct class to suggestion buttons', () => {
      const { container } = render(<App />);

      const suggestionButtons = container.querySelectorAll('[class*="suggestionButton"]');
      suggestionButtons.forEach(button => {
        expect(button).toHaveClass(styles.suggestionButton);
      });
    });

    it('renders suggestion arrows with correct class', () => {
      const { container } = render(<App />);

      const arrows = container.querySelectorAll('[class*="suggestionArrow"]');
      expect(arrows.length).toBe(INITIAL_SUGGESTIONS.length);
      arrows.forEach(arrow => {
        expect(arrow).toHaveClass(styles.suggestionArrow);
      });
    });
  });

  describe('Chat Container Structure', () => {
    it('renders chat container with correct class', () => {
      const { container } = render(<App />);

      const chatContainer = container.querySelector('[class*="chatContainer"]');
      expect(chatContainer).toHaveClass(styles.chatContainer);
    });

    it('renders chat content with correct class', () => {
      const { container } = render(<App />);

      const chatContent = container.querySelector('[class*="chatContent"]');
      expect(chatContent).toHaveClass(styles.chatContent);
    });

    it('renders steps sidebar with correct class', () => {
      const { container } = render(<App />);

      const stepsSidebar = container.querySelector('[class*="stepsSidebar"]');
      expect(stepsSidebar).toHaveClass(styles.stepsSidebar);
    });
  });

  describe('Message Flow and State Changes', () => {
    it('shows live indicator after first message sent', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockResolvedValue('Test response');
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1', 'Step 2']);

      const { container } = render(<App />);

      // Click first suggestion
      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const liveIndicator = container.querySelector('[class*="liveIndicator"]');
        expect(liveIndicator).toBeInTheDocument();
        expect(liveIndicator).toHaveClass(styles.liveIndicator);
      });
    });

    it('hides welcome screen after message is sent', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockResolvedValue('Test response');
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1']);

      const { container } = render(<App />);

      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const welcomeScreen = container.querySelector('[class*="welcomeScreen"]');
        expect(welcomeScreen).not.toBeInTheDocument();
      });
    });

    it('shows loading indicator while waiting for response', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Test response'), 100))
      );
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1']);

      const { container } = render(<App />);

      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const loadingIndicator = container.querySelector('[class*="loadingIndicator"]');
        expect(loadingIndicator).toBeInTheDocument();
        expect(loadingIndicator).toHaveClass(styles.loadingIndicator);
      });
    });

    it('renders loading avatar with correct class', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Test response'), 100))
      );
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1']);

      const { container } = render(<App />);

      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const loadingAvatar = container.querySelector('[class*="loadingAvatar"]');
        expect(loadingAvatar).toHaveClass(styles.loadingAvatar);
      });
    });

    it('renders loading text with correct class and content', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Test response'), 100))
      );
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1']);

      const { container } = render(<App />);

      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const loadingText = container.querySelector('[class*="loadingText"]');
        expect(loadingText).toHaveClass(styles.loadingText);
        expect(loadingText?.textContent).toBe('Socratize is thinking...');
      });
    });

    it('renders spinner with correct class', async () => {
      vi.mocked(geminiService.sendMessageToTutor).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Test response'), 100))
      );
      vi.mocked(geminiService.generateProblemSteps).mockResolvedValue(['Step 1']);

      const { container } = render(<App />);

      const firstSuggestion = screen.getByText(INITIAL_SUGGESTIONS[0]).closest('button') as HTMLButtonElement;
      fireEvent.click(firstSuggestion);

      await waitFor(() => {
        const spinner = container.querySelector('[class*="spinner"]');
        expect(spinner).toHaveClass(styles.spinner);
      });
    });
  });

  describe('Component Integration', () => {
    it('renders ProblemInput component', () => {
      render(<App />);

      // ProblemInput contains a textarea with specific placeholder
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    it('renders StepTracker component', () => {
      const { container } = render(<App />);

      // StepTracker is in the steps sidebar
      const stepsSidebar = container.querySelector('[class*="stepsSidebar"]');
      expect(stepsSidebar).toBeInTheDocument();
    });
  });

  describe('Initial State - Hooks', () => {
    it('initializes with empty messages array', () => {
      const { container } = render(<App />);

      // Welcome screen only shows when messages.length === 0
      const welcomeScreen = container.querySelector('[class*="welcomeScreen"]');
      expect(welcomeScreen).toBeInTheDocument();
    });

    it('initializes with isLoading as false', () => {
      const { container } = render(<App />);

      // Loading indicator should not be present initially
      const loadingIndicator = container.querySelector('[class*="loadingIndicator"]');
      expect(loadingIndicator).not.toBeInTheDocument();
    });

    it('initializes with empty steps array', () => {
      render(<App />);

      // No steps should be displayed initially
      expect(screen.queryByText('Learning Journey')).not.toBeInTheDocument();
    });

    it('initializes with currentTopic as null', () => {
      const { container } = render(<App />);

      // All topic buttons should have inactive class initially
      const topicButtons = container.querySelectorAll('[class*="topicButton"]');
      topicButtons.forEach(button => {
        expect(button).toHaveClass(styles.topicButtonInactive);
        expect(button).not.toHaveClass(styles.topicButtonActive);
      });
    });
  });

  describe('Topic Selection State Management', () => {
    it('updates currentTopic when a topic is clicked', () => {
      const { container } = render(<App />);

      const firstTopic = TOPICS[0];
      const firstTopicButton = screen.getByText(firstTopic).closest('button') as HTMLButtonElement;

      fireEvent.click(firstTopicButton);

      // Should now have active class
      expect(firstTopicButton).toHaveClass(styles.topicButtonActive);

      // Other topics should remain inactive
      const secondTopicButton = screen.getByText(TOPICS[1]).closest('button') as HTMLButtonElement;
      expect(secondTopicButton).toHaveClass(styles.topicButtonInactive);
    });

    it('switches active topic when different topic is clicked', () => {
      render(<App />);

      const firstTopicButton = screen.getByText(TOPICS[0]).closest('button') as HTMLButtonElement;
      const secondTopicButton = screen.getByText(TOPICS[1]).closest('button') as HTMLButtonElement;

      fireEvent.click(firstTopicButton);
      expect(firstTopicButton).toHaveClass(styles.topicButtonActive);

      fireEvent.click(secondTopicButton);
      expect(secondTopicButton).toHaveClass(styles.topicButtonActive);
      expect(firstTopicButton).toHaveClass(styles.topicButtonInactive);
    });
  });
});
