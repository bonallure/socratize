import React, { useState, useEffect, useRef } from 'react';
import { Message, Step } from './types';
import { sendMessageToTutor, generateProblemSteps } from './services/geminiService';
import { TOPICS, INITIAL_SUGGESTIONS } from './constants';
import ChatMessage from './components/chatMessage/ChatMessage';
import ProblemInput from './components/problemInput/ProblemInput';
import StepTracker from './components/stepTracker/StepTracker';
import { GraduationCap, BookOpen, Clock, Settings, Search, Sparkles, Loader2 } from 'lucide-react';
import styles from './App.module.css';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);    //Stores entire chat history in a list
  const [isLoading, setIsLoading] = useState(false);    //Tracks whether the AI is thinking or has responded
  const [steps, setSteps] = useState<Step[]>([]);   //Tracks the problem-solving steps
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);    //Tracks which topic is selected in the sidebar
  //The current topic is not something that can't be set in a conversation that has already started

  const messagesEndRef = useRef<HTMLDivElement>(null);    //Used to "auto-scroll" to the bottom of the chat

  const scrollToBottom = () => {    //Whenerver the message from the user is updated
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {   //Chat automatically scrolls to the bottom
    //Use effect is a react hook that rerenders, or runs a method when the watched value is updated
    //React hooks start with "use" and they're essentially functions used to execute or store the result of functions when watch values are updated
    //Every time setMessage is executed and the value actually changes, scrollToBottom is executeed
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, image?: string) => {   //Runs when a student sends a message
    const userMessage: Message = {    //Builds message containing
      id: Date.now().toString(),    //ID
      role: 'user',   //Role which is equal to user
      content: text,    //Content, the text of the message itself
      timestamp: Date.now(),      //Timestamp showing when message was sent
      imageUrl: image   //Optional image
    };

    const newMessages = [...messages, userMessage];   //Add's message to chat and sets isLoading to true; list containg all messages
    //".." above spreads the message
    setMessages(newMessages);     //Updates messages the newMessage
    setIsLoading(true);   //Says that the AI is loading 

    try {
      // If this is the first message, generate steps
      if (messages.length === 0) {    //If there is no message 
        const generatedSteps = await generateProblemSteps(text);    //AI creates a step-by-step plan
        setSteps(generatedSteps.map((s, i) => ({    //returs a map that contains: i - the ID and s - the label
          id: i.toString(),   //Verify in types.ts
          label: s,
          status: i === 0 ? 'current' : 'pending'   //If i = 0, then the status is current, if not its pending
        })));
      }

      const responseText = await sendMessageToTutor(newMessages, image);    //AI responds using the full chat history
      //"await" waits for async method to complete, see in "hook"

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);   //Add AI response to conversation
      
      // Basic heuristic to move steps forward
      //heuristic - thinking through something, "trial-and-error"
      if (steps.length > 0) {   
         setSteps(prevSteps => {
           const currentIdx = prevSteps.findIndex(s => s.status === 'current');
           // Just a dummy progression for demo purposes
           // In a real app, we would decide when a step is completed via tool calling
           if (currentIdx !== -1 && messages.length > 3 && Math.random() > 0.6) {
             const next = [...prevSteps];
             next[currentIdx].status = 'completed';
             if (currentIdx + 1 < next.length) {
               next[currentIdx + 1].status = 'current';
             }
             return next;
           }
           return prevSteps;
         });
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error. Could you please check your connection and try again?",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);   //Adds error message to chat as coming from assistant
    } finally {   //finaly always run when using try-catch
      setIsLoading(false);
    }
  };
//Defined variables and methods above

//Return the UI component below
  return (
    <div className={styles.appContainer}> 
      {/* Sidebar - Desktop Only */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>
            <GraduationCap size={24} />
          </div>
          <h1 className={styles.logoText}>Socratis</h1>
        </div>
        
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Workspace</h3>
            <button className={`${styles.navButton} ${styles.navButtonActive}`}>
              <Sparkles size={18} className="text-indigo-600" />
              Active Session
            </button>
            <button className={`${styles.navButton} ${styles.navButtonInactive}`}>
              <Clock size={18} />
              Session History
            </button>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Popular Topics</h3>
            {TOPICS.map(topic => (
              <button 
                key={topic}
                onClick={() => setCurrentTopic(topic)}
                className={`${styles.topicButton} ${
                  currentTopic === topic ? styles.topicButtonActive : styles.topicButtonInactive
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.settingsButton}>
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>Black Boy's Code</h2>
            {messages.length > 0 && <span className={styles.liveIndicator}>LIVE</span>}
          </div>
          <div className={styles.headerRight}>
             <button className={styles.searchButton}>
               <Search size={20} />
             </button>
             <div className={styles.profilePic} />
          </div>
        </header>

        {/* Scrollable Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.chatContainer}>
            <div className={styles.chatContent}>
              {messages.length === 0 ? (
                <div className={styles.welcomeScreen}>
                  <div className={styles.welcomeIcon}>
                    <BookOpen size={48} />
                  </div>
                  <h1 className={styles.welcomeTitle}>How can I help you think today?</h1>
                  <p className={styles.welcomeText}>
                    Ask a question, upload a problem, or explore a topic. I'll guide you step-by-step through the reasoning.
                  </p>
                  
                  <div className={styles.suggestionsGrid}>
                    {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion.replace(/\$/g, ""))}
                        className={styles.suggestionButton}
                      >
                        <span className={styles.suggestionArrow}>→</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                {/*Actual message display*/}
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isLoading && (
                    <div className={styles.loadingIndicator}>
                      <div className={styles.loadingAvatar}>
                        <Loader2 className={styles.spinner} size={20} />
                      </div>
                      <div className={styles.loadingText}>
                        Socratize is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Steps - Desktop Only */}
            <aside className={styles.stepsSidebar}>
              <StepTracker steps={steps} />
            </aside>
          </div>
        </div>

        {/* Input Bar */}
        <ProblemInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};
{/*"onSoemthing" anything are event listeners, when "Something" happens the exectute*/}
export default App;
