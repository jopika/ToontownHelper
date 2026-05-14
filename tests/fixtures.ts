import { InfoResponse, TaskData } from '../src/types/InfoResponse';
import { ToonMetadata } from '../src/types/ToonMetadata';

export function buildTask(overrides: Partial<TaskData> = {}): TaskData {
  return {
    objective: {
      text: 'Defeat 4 Cogs',
      where: 'Anywhere',
      progress: {
        text: '0 of 4',
        current: 0,
        target: 4,
      },
    },
    from: {
      name: 'Flippy',
      building: 'Toon Hall',
      zone: 'Playground',
      neighborhood: 'Toontown Central',
    },
    to: {
      name: 'HQ Officer',
      building: 'Toon HQ',
      zone: 'Playground',
      neighborhood: 'Toontown Central',
    },
    reward: '10 jellybeans',
    deletable: false,
    ...overrides,
  };
}

export function buildInfoResponse(overrides: Partial<InfoResponse> = {}): InfoResponse {
  return {
    toon: {
      id: 'toon-1',
      name: 'Test Toon',
      species: 'dog',
      headColor: '#abcdef',
      style: 'shorts',
    },
    laff: {
      current: 15,
      max: 15,
    },
    location: {
      zone: 'Playground',
      neighborhood: 'Toontown Central',
      district: 'Boingbury',
      instanceId: null,
    },
    gags: {
      'Toon-Up': null,
      Trap: null,
      Lure: null,
      Sound: null,
      Throw: null,
      Squirt: null,
      Drop: null,
    },
    tasks: [buildTask()],
    invasion: {
      cog: '',
      quantity: 0,
      mega: false,
    },
    ...overrides,
  };
}

export function buildToonMetadata(overrides: Partial<ToonMetadata> = {}): ToonMetadata {
  return {
    id: 1,
    roomId: 'room-1',
    metadata: buildInfoResponse(),
    updatedAt: 1767225600000,
    joinedAt: 1767225600000,
    ...overrides,
  };
}
