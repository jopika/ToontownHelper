import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Task from '../src/TaskBox';
import { TaskProps } from '../src/types/TaskProps';

const baseTask: TaskProps = {
  taskType: 'WANTED',
  text: '4 Cogs',
  where: ['Loopy Lane'],
  progressText: '2 of 4',
  progressCurrent: 2,
  progressTarget: 4,
  reward: '20 jellybeans',
};

describe('TaskBox', () => {
  it('renders progress for incomplete tasks', () => {
    render(<Task {...baseTask} />);

    expect(screen.getByText('WANTED')).toBeInTheDocument();
    expect(screen.getByText('4 Cogs')).toBeInTheDocument();
    expect(screen.getByText('2 of 4')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '2');
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '4');
  });

  it('hides complete-task progress and reveals reward on hover', async () => {
    const user = userEvent.setup();
    render(<Task {...baseTask} taskType="COMPLETE" progressCurrent={2} progressTarget={4} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    const reward = screen.getByText('Reward: 20 jellybeans');
    expect(reward).toHaveStyle({ visibility: 'hidden' });

    await user.hover(screen.getByText('COMPLETE'));
    expect(reward).toHaveStyle({ visibility: 'visible' });
  });
});
