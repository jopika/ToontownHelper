import { describe, expect, it, vi } from 'vitest';
import { buildInfoResponse, buildToonMetadata } from '../fixtures';
import { TaskHubConnector } from '../../src/adapters/TaskHubConnector';

describe('TaskHubConnector', () => {
  it('posts one toon to a room and filters out the local toon', async () => {
    const local = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'local' } });
    const remote = buildToonMetadata({
      id: 2,
      metadata: buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'remote' } }),
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        buildToonMetadata({ id: 1, metadata: local }),
        remote,
      ]),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(TaskHubConnector.getInstance().joinRoom('abc123', local)).resolves.toEqual([remote]);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://34.145.13.149:3024/metadata/update',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ roomId: 'abc123', metadata: local }),
      }),
    );
  });

  it('posts many local toons and filters all local toon ids from the room response', async () => {
    const localOne = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'local-1' } });
    const localTwo = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'local-2' } });
    const remote = buildToonMetadata({
      id: 3,
      metadata: buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'remote' } }),
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        buildToonMetadata({ id: 1, metadata: localOne }),
        buildToonMetadata({ id: 2, metadata: localTwo }),
        remote,
      ]),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(TaskHubConnector.getInstance().joinRoomWithMany('party', [localOne, localTwo])).resolves.toEqual([remote]);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://34.145.13.149:3024/metadata/updateMany',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ roomId: 'party', metadata: [localOne, localTwo] }),
      }),
    );
  });

  it('rejects non-OK responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(
      TaskHubConnector.getInstance().getAllInRoom('broken-room', 'local'),
    ).rejects.toThrow('HTTP error! status: 500');
  });
});
