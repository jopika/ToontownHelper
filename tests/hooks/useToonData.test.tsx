import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildInfoResponse, buildToonMetadata } from '../fixtures';

const mocks = vi.hoisted(() => ({
  startConnection: vi.fn(),
  getAllToonData: vi.fn(),
  joinRoomWithMany: vi.fn(),
}));

vi.mock('../../src/adapters/ToontownConnector', () => ({
  ToontownConnector: vi.fn(function MockToontownConnector() {
    return {
      startConnection: mocks.startConnection,
      getAllToonData: mocks.getAllToonData,
    };
  }),
}));

vi.mock('../../src/adapters/TaskHubConnector', () => ({
  TaskHubConnector: {
    getInstance: vi.fn(() => ({
      joinRoomWithMany: mocks.joinRoomWithMany,
    })),
  },
}));

describe('useToonData', () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.startConnection.mockReset();
    mocks.getAllToonData.mockReset();
    mocks.joinRoomWithMany.mockReset();
    mocks.joinRoomWithMany.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches and sorts local toon data on mount', async () => {
    const toonB = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'toon-b', name: 'B' } });
    const toonA = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'toon-a', name: 'A' } });
    mocks.getAllToonData.mockResolvedValue([toonB, toonA]);
    const { useToonData } = await import('../../src/hooks/useToonData');

    const { result } = renderHook(() => useToonData());

    await waitFor(() => expect(result.current.data.map(info => info.toon.id)).toEqual(['toon-a', 'toon-b']));
    expect(mocks.startConnection).toHaveBeenCalledTimes(1);
    expect(mocks.joinRoomWithMany).not.toHaveBeenCalled();
  });

  it('uses a provided session id to sync room data and append remote toons', async () => {
    const local = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'local' } });
    const remote = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'remote' } });
    mocks.getAllToonData.mockResolvedValue([local]);
    mocks.joinRoomWithMany.mockResolvedValue([buildToonMetadata({ metadata: remote })]);
    const { useToonData } = await import('../../src/hooks/useToonData');

    const { result } = renderHook(() => useToonData());

    await waitFor(() => expect(result.current.data.map(info => info.toon.id)).toEqual(['local']));
    act(() => result.current.retrieveToonData('room-code'));

    await waitFor(() => expect(result.current.data.map(info => info.toon.id)).toEqual(['local', 'remote']));
    expect(mocks.joinRoomWithMany).toHaveBeenCalledWith('room-code', [local]);
  });

  it('polls every 10 seconds and clears the interval on unmount', async () => {
    vi.useFakeTimers();
    mocks.getAllToonData.mockResolvedValue([buildInfoResponse()]);
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { useToonData } = await import('../../src/hooks/useToonData');

    const { unmount } = renderHook(() => useToonData());

    await act(async () => {
      await Promise.resolve();
    });
    expect(mocks.getAllToonData).toHaveBeenCalledTimes(1);
    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });
    expect(mocks.getAllToonData).toHaveBeenCalledTimes(2);

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});
