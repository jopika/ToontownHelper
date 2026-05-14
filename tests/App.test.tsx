import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { buildInfoResponse, buildTask } from './fixtures';

const hookState = vi.hoisted(() => ({
  data: [],
  setSessionId: vi.fn(),
  retrieveToonData: vi.fn(),
}));

vi.mock('../src/hooks/useToonData', () => ({
  useToonData: vi.fn(() => hookState),
}));

describe('App', () => {
  beforeEach(() => {
    hookState.data = [];
    hookState.setSessionId.mockReset();
    hookState.retrieveToonData.mockReset();
  });

  it('renders the empty state when no toons are available', () => {
    render(<App />);

    expect(screen.getByText(/No toons detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Version:/i)).toBeInTheDocument();
  });

  it('renders toons, parsed task details, and joins a trimmed room id', async () => {
    const user = userEvent.setup();
    hookState.data = [
      buildInfoResponse({
        toon: {
          ...buildInfoResponse().toon,
          id: 'toon-1',
          name: 'Lady Lily',
          headColor: '#123456',
        },
        tasks: [
          buildTask({
            objective: {
              text: 'Defeat 4 Cogs',
              where: 'Loopy Lane',
              progress: { text: '2 of 4', current: 2, target: 4 },
            },
          }),
        ],
      }),
    ];

    render(<App />);

    expect(screen.getByText('Lady Lily')).toBeInTheDocument();
    expect(screen.getByText('WANTED')).toBeInTheDocument();
    expect(screen.getByText('4 Cogs')).toBeInTheDocument();
    expect(screen.getByText('Loopy Lane')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), '  my-room  ');
    await user.click(screen.getByRole('button', { name: 'Join!' }));

    expect(hookState.setSessionId).toHaveBeenCalledWith('my-room');
    expect(hookState.retrieveToonData).toHaveBeenCalledWith('my-room');
  });
});
