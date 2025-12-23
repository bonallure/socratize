
import React, { useState, useEffect, useRef } from 'react';
import { Message, Step } from './types';
import { sendMessageToTutor, generateProblemSteps } from './services/geminiService';
import { TOPICS, INITIAL_SUGGESTIONS } from './constants';
import ChatMessage from './components/ChatMessage';
import ProblemInput from './components/ProblemInput';
import StepTracker from './components/StepTracker';
import { GraduationCap, BookOpen, Clock, Settings, Search, Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      imageUrl: image
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // If this is the first message, generate steps
      if (messages.length === 0) {
        const generatedSteps = await generateProblemSteps(text);
        setSteps(generatedSteps.map((s, i) => ({
          id: i.toString(),
          label: s,
          status: i === 0 ? 'current' : 'pending'
        })));
      }

      const responseText = await sendMessageToTutor(newMessages, image);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Basic heuristic to move steps forward
      if (steps.length > 0) {
         setSteps(prevSteps => {
           const currentIdx = prevSteps.findIndex(s => s.status === 'current');
           // Just a dummy progression for demo purposes
           // In a real app, Gemini would decide when a step is completed via tool calling
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
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="font-bold text-xl text-slate-800">Socratis</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          <div className="py-2">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace</h3>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
              <Sparkles size={18} className="text-indigo-600" />
              Active Session
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors mt-1">
              <Clock size={18} />
              Session History
            </button>
          </div>

          <div className="py-4">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Popular Topics</h3>
            {TOPICS.map(topic => (
              <button 
                key={topic}
                onClick={() => setCurrentTopic(topic)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1 ${
                  currentTopic === topic ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800">Tutoring Lab</h2>
            {messages.length > 0 && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>}
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <Search size={20} />
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Scrollable Chat Area */}
        <div className="flex-grow overflow-y-auto px-4 py-8">
          <div className="max-w-4xl mx-auto flex gap-6">
            <div className="flex-grow">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-indigo-100 p-6 rounded-3xl text-indigo-600 mb-6">
                    <BookOpen size={48} />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-4">How can I help you think today?</h1>
                  <p className="text-slate-500 max-w-md mb-8">
                    Ask a question, upload a problem, or explore a topic. I'll guide you step-by-step through the reasoning.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                    {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion.replace(/\$/g, ""))}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-left text-sm font-medium text-slate-700 hover:border-indigo-400 hover:shadow-md transition-all group"
                      >
                        <span className="text-indigo-500 group-hover:translate-x-1 inline-block transition-transform mr-2">→</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 mb-6 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                        <Loader2 className="animate-spin" size={20} />
                      </div>
                      <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-tl-none border border-slate-200 text-slate-400 text-sm">
                        Socratis is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Steps - Desktop Only */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
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

export default App;
