
import React from 'react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Step } from '../types';

interface StepTrackerProps {
  steps: Step[];
}

const StepTracker: React.FC<StepTrackerProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 sticky top-20 z-0 hidden lg:block">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Learning Journey</h3>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'text-green-500' : 
                step.status === 'current' ? 'text-indigo-600' : 'text-slate-300'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 size={20} /> : 
                 step.status === 'current' ? <PlayCircle size={20} /> : <Circle size={20} />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-0.5 h-6 my-1 ${
                  step.status === 'completed' ? 'bg-green-200' : 'bg-slate-100'
                }`} />
              )}
            </div>
            <div className="pt-0.5">
              <p className={`text-sm font-medium ${
                step.status === 'completed' ? 'text-slate-500 line-through' : 
                step.status === 'current' ? 'text-indigo-700 font-bold' : 'text-slate-400'
              }`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepTracker;
