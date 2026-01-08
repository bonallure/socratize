import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StepTracker from './StepTracker';
import { Step } from '@/types';
import styles from './StepTracker.module.css';

describe('StepTracker', () => {
  const mockSteps: Step[] = [
    { id: '1', label: 'Understand the problem', status: 'completed' },
    { id: '2', label: 'Break it down', status: 'current' },
    { id: '3', label: 'Find solution', status: 'pending' }
  ];

  describe('Conditional Rendering', () => {
    it('renders nothing when steps array is empty', () => {
      const { container } = render(<StepTracker steps={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders container when steps are provided', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Structure and Element Count', () => {
    it('renders correct number of step items', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const stepItems = container.querySelectorAll('[class*="stepItem"]');
      expect(stepItems).toHaveLength(3);
    });

    it('renders correct number of icons (one per step)', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      // Select divs that have "icon" but not "iconWrapper" in class name
      const allIcons = container.querySelectorAll('[class*="icon"]');
      const icons = Array.from(allIcons).filter(el =>
        !el.className.includes('iconWrapper')
      );
      expect(icons).toHaveLength(3);
    });

    it('renders connecting lines only between steps (n-1 lines for n steps)', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const lines = container.querySelectorAll('[class*="line"]');
      expect(lines).toHaveLength(2); // 3 steps = 2 lines
    });

    it('renders correct number of labels', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const labels = container.querySelectorAll('[class*="label"]');
      expect(labels).toHaveLength(3);
    });

    it('does not render line after last step', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const stepItems = container.querySelectorAll('[class*="stepItem"]');
      const lastStepItem = stepItems[stepItems.length - 1];
      const lineInLastStep = lastStepItem.querySelector('[class*="line"]');

      expect(lineInLastStep).not.toBeInTheDocument();
    });
  });

  describe('Container Class Names', () => {
    it('applies correct classes to container', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const mainContainer = container.querySelector('[class*="container"]');
      expect(mainContainer).toHaveClass(styles.container);
    });

    it('applies correct classes to header', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const header = container.querySelector('h3');
      expect(header).toHaveClass(styles.header);
    });

    it('applies correct classes to step list', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const stepList = container.querySelector('[class*="stepList"]');
      expect(stepList).toHaveClass(styles.stepList);
    });
  });

  describe('Step Item Class Names', () => {
    it('applies correct classes to step items', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const stepItems = container.querySelectorAll('[class*="stepItem"]');
      stepItems.forEach((item) => {
        expect(item).toHaveClass(styles.stepItem);
      });
    });

    it('applies correct classes to icon wrapper', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const iconWrappers = container.querySelectorAll('[class*="iconWrapper"]');
      expect(iconWrappers).toHaveLength(3);
      iconWrappers.forEach((wrapper) => {
        expect(wrapper).toHaveClass(styles.iconWrapper);
      });
    });
  });

  describe('Completed Step Styling', () => {
    it('applies completedIcon class to completed step icon', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const allIcons = container.querySelectorAll('[class*="icon"]');
      const icons = Array.from(allIcons).filter(el =>
        !el.className.includes('iconWrapper')
      );
      const completedIcon = icons[0]; // First step is completed

      expect(completedIcon).toHaveClass(styles.icon);
      expect(completedIcon).toHaveClass(styles.completedIcon);
    });

    it('applies completed class to completed step label', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const labels = container.querySelectorAll('[class*="label"]');
      const completedLabel = labels[0]; // First step is completed

      expect(completedLabel).toHaveClass(styles.label);
      expect(completedLabel).toHaveClass(styles.completed);
      expect(completedLabel).not.toHaveClass(styles.current);
    });

    it('applies completedLine class to line after completed step', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const lines = container.querySelectorAll('[class*="line"]');
      const firstLine = lines[0]; // Line after completed step

      expect(firstLine).toHaveClass(styles.line);
      expect(firstLine).toHaveClass(styles.completedLine);
    });
  });

  describe('Current Step Styling', () => {
    it('applies currentIcon class to current step icon', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const allIcons = container.querySelectorAll('[class*="icon"]');
      const icons = Array.from(allIcons).filter(el =>
        !el.className.includes('iconWrapper')
      );
      const currentIcon = icons[1]; // Second step is current

      expect(currentIcon).toHaveClass(styles.icon);
      expect(currentIcon).toHaveClass(styles.currentIcon);
    });

    it('applies current class to current step label', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const labels = container.querySelectorAll('[class*="label"]');
      const currentLabel = labels[1]; // Second step is current

      expect(currentLabel).toHaveClass(styles.label);
      expect(currentLabel).toHaveClass(styles.current);
      expect(currentLabel).not.toHaveClass(styles.completed);
    });

    it('does not apply completedLine class to line after current step', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const lines = container.querySelectorAll('[class*="line"]');
      const secondLine = lines[1]; // Line after current step

      expect(secondLine).toHaveClass(styles.line);
      expect(secondLine).not.toHaveClass(styles.completedLine);
    });
  });

  describe('Pending Step Styling', () => {
    it('applies only base icon class to pending step icon', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const allIcons = container.querySelectorAll('[class*="icon"]');
      const icons = Array.from(allIcons).filter(el =>
        !el.className.includes('iconWrapper')
      );
      const pendingIcon = icons[2]; // Third step is pending

      expect(pendingIcon).toHaveClass(styles.icon);
      expect(pendingIcon).not.toHaveClass(styles.currentIcon);
      expect(pendingIcon).not.toHaveClass(styles.completedIcon);
    });

    it('applies only base label class to pending step label', () => {
      const { container } = render(<StepTracker steps={mockSteps} />);

      const labels = container.querySelectorAll('[class*="label"]');
      const pendingLabel = labels[2]; // Third step is pending

      expect(pendingLabel).toHaveClass(styles.label);
      expect(pendingLabel).not.toHaveClass(styles.current);
      expect(pendingLabel).not.toHaveClass(styles.completed);
    });
  });

  describe('Content Rendering', () => {
    it('renders header text correctly', () => {
      render(<StepTracker steps={mockSteps} />);

      expect(screen.getByText('Learning Journey')).toBeInTheDocument();
    });

    it('renders all step labels correctly', () => {
      render(<StepTracker steps={mockSteps} />);

      expect(screen.getByText('Understand the problem')).toBeInTheDocument();
      expect(screen.getByText('Break it down')).toBeInTheDocument();
      expect(screen.getByText('Find solution')).toBeInTheDocument();
    });
  });

  describe('Single Step Edge Case', () => {
    it('renders correctly with single step', () => {
      const singleStep: Step[] = [
        { id: '1', label: 'Only step', status: 'current' }
      ];
      const { container } = render(<StepTracker steps={singleStep} />);

      const stepItems = container.querySelectorAll('[class*="stepItem"]');
      expect(stepItems).toHaveLength(1);

      const lines = container.querySelectorAll('[class*="line"]');
      expect(lines).toHaveLength(0); // No lines for single step
    });
  });

  describe('All Steps Completed', () => {
    it('applies completed styling to all steps when all completed', () => {
      const allCompleted: Step[] = [
        { id: '1', label: 'Step 1', status: 'completed' },
        { id: '2', label: 'Step 2', status: 'completed' },
        { id: '3', label: 'Step 3', status: 'completed' }
      ];
      const { container } = render(<StepTracker steps={allCompleted} />);

      const labels = container.querySelectorAll('[class*="label"]');
      labels.forEach((label) => {
        expect(label).toHaveClass(styles.completed);
      });

      const lines = container.querySelectorAll('[class*="line"]');
      lines.forEach((line) => {
        expect(line).toHaveClass(styles.completedLine);
      });
    });
  });
});