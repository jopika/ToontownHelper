import { describe, expect, it, vi } from 'vitest';
import { buildInfoResponse } from '../fixtures';
import { ToontownConnector } from '../../src/adapters/ToontownConnector';

describe('ToontownConnector', () => {
  it('fetches toon data from the requested companion app port', async () => {
    const payload = buildInfoResponse();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(payload),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await new ToontownConnector().getToonData(1550);

    expect(result).toBe(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:1550/info.json',
      expect.objectContaining({
        mode: 'cors',
        headers: expect.any(Headers),
      }),
    );

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('User-Agent')).toBe('ToonTownLocalHelper');
    expect(headers.get('Authorization')).toBe('Basic local-helper-');
    expect(headers.get('Origin')).toBe('ToonTownLocalHelper');
  });

  it('wraps fetch failures with the requested port', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connection refused')));

    await expect(new ToontownConnector().getToonData(1547)).rejects.toThrow(
      'Unable to get info: Error: connection refused for 1547',
    );
  });

  it('scans the configured port range and returns successful toon responses', async () => {
    const connector = new ToontownConnector();
    const first = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'toon-1' } });
    const second = buildInfoResponse({ toon: { ...buildInfoResponse().toon, id: 'toon-2' } });
    const getToonData = vi.spyOn(connector, 'getToonData');

    getToonData
      .mockRejectedValueOnce(new Error('no toon on 1547'))
      .mockResolvedValueOnce(first)
      .mockRejectedValueOnce(new Error('no toon on 1549'))
      .mockResolvedValueOnce(second)
      .mockRejectedValueOnce(new Error('no toon on 1551'))
      .mockRejectedValueOnce(new Error('no toon on 1552'));
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await expect(connector.getAllToonData()).resolves.toEqual([first, second]);
    expect(getToonData).toHaveBeenCalledTimes(6);
    expect(getToonData.mock.calls.map(([port]) => port)).toEqual([1547, 1548, 1549, 1550, 1551, 1552]);
  });
});
