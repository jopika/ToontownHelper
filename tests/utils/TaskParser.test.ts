import { describe, expect, it } from 'vitest';
import { buildTask } from '../fixtures';
import { parseTasks } from '../../src/utils/TaskParser';

describe('parseTasks', () => {
  it('parses numbered defeat objectives as wanted tasks', () => {
    const [task] = parseTasks([
      buildTask({
        objective: {
          text: 'Defeat 10 Cold Callers',
          where: 'Sellbot HQ',
          progress: { text: '3 of 10', current: 3, target: 10 },
        },
        reward: 'Teleport access',
      }),
    ]);

    expect(task).toMatchObject({
      taskType: 'WANTED',
      text: '10 Cold Callers',
      where: ['Sellbot HQ'],
      progressText: '3 of 10',
      progressCurrent: 3,
      progressTarget: 10,
      reward: 'Teleport access',
    });
  });

  it('parses named defeat objectives as defeat tasks', () => {
    const [task] = parseTasks([
      buildTask({
        objective: {
          text: 'Defeat The Mingler',
          where: 'Cashbot HQ',
          progress: { text: 'Incomplete', current: 0, target: 1 },
        },
      }),
    ]);

    expect(task.taskType).toBe('DEFEAT');
    expect(task.text).toBe('The Mingler');
    expect(task.where).toEqual(['Cashbot HQ']);
  });

  it('uses destination details for visit tasks', () => {
    const [task] = parseTasks([
      buildTask({
        objective: {
          text: 'Visit Professor Pete',
          where: 'Anywhere',
          progress: { text: 'Incomplete', current: 0, target: -1 },
        },
        to: {
          name: 'Professor Pete',
          building: 'School House',
          zone: 'Playground',
          neighborhood: 'Toontown Central',
        },
      }),
    ]);

    expect(task).toMatchObject({
      taskType: 'VISIT',
      text: 'Professor Pete',
      where: ['School House', 'Toontown Central', 'Playground'],
      progressCurrent: undefined,
      progressTarget: undefined,
    });
  });

  it('appends destination and location details for delivery tasks', () => {
    const [task] = parseTasks([
      buildTask({
        objective: {
          text: 'Deliver Gag Training Film',
          where: 'Anywhere',
          progress: { text: 'Incomplete', current: 0, target: -1 },
        },
        to: {
          name: 'Clerk Clara',
          building: 'Gag Shop',
          zone: 'Playground',
          neighborhood: 'Daisy Gardens',
        },
      }),
    ]);

    expect(task).toMatchObject({
      taskType: 'DELIVER',
      text: 'Gag Training Film to Clerk Clara',
      where: ['Gag Shop', 'Daisy Gardens', 'Playground'],
    });
  });

  it('marks complete tasks as return-to tasks', () => {
    const [task] = parseTasks([
      buildTask({
        objective: {
          text: 'Defeat 2 Cogs',
          where: 'Anywhere',
          progress: { text: 'Complete', current: 2, target: 2 },
        },
        to: {
          name: 'Flippy',
          building: 'Toon Hall',
          zone: 'Playground',
          neighborhood: 'Toontown Central',
        },
      }),
    ]);

    expect(task).toMatchObject({
      taskType: 'COMPLETE',
      text: '2 Cogs return to Flippy',
      where: ['Toon Hall', 'Toontown Central', 'Playground'],
      progressText: 'Complete',
    });
  });
});
