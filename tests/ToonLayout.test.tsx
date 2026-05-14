import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToonLayout from '../ToonLayout';

describe('ToonLayout', () => {
  it('renders the toon name, background color, and all tasks', () => {
    const { container } = render(
      <ToonLayout
        name="Captain Zippy"
        colour="rgb(10, 20, 30)"
        tasks={[
          {
            taskType: 'VISIT',
            text: 'Professor Pete',
            where: ['School House', 'Toontown Central', 'Playground'],
            progressText: 'Incomplete',
            progressCurrent: undefined,
            progressTarget: undefined,
            reward: 'Small pouch',
          },
          {
            taskType: 'WANTED',
            text: '4 Cogs',
            where: ['Anywhere'],
            progressText: '1 of 4',
            progressCurrent: 1,
            progressTarget: 4,
            reward: '20 jellybeans',
          },
        ]}
      />,
    );

    expect(screen.getByText('Captain Zippy')).toBeInTheDocument();
    expect(screen.getByText('Professor Pete')).toBeInTheDocument();
    expect(screen.getByText('4 Cogs')).toBeInTheDocument();
    expect(container.querySelector('.toonInfo')).toHaveStyle({ backgroundColor: 'rgb(10, 20, 30)' });
  });
});
