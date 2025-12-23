
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  imageUrl?: string;
  type?: 'thought' | 'hint' | 'question' | 'explanation';
}

export interface ProblemSession {
  id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'completed';
  topic?: string;
}

export interface Step {
  id: string;
  label: string;
  status: 'pending' | 'current' | 'completed';
}
