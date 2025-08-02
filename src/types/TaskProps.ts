/**
 * @description Represents the properties of a parsed task, formatted for display.
 */
export type TaskProps = {
    /** The type of the task (e.g., "DEFEAT", "VISIT", "DELIVER"). */
    taskType: string;
    /** The main description text of the task. */
    text: string;
    /** An array of location details for the task. */
    where: string[];
    /** The text describing the current progress (e.g., "5/10 Cogs"). */
    progressText: string;
    /** The current progress value. */
    progressCurrent: number;
    /** The target progress value. */
    progressTarget: number;
    /** The reward for completing the task. */
    reward: string;
};
