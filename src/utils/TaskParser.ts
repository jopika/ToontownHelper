import { TaskData } from "../types/InfoResponse";
import { TaskProps } from "../types/TaskProps";

/**
 * @description Parses raw task data into a structured format for display.
 * This function processes an array of tasks, transforming them into a more
 * readable and UI-friendly format.
 * @param {TaskData[]} tasks - An array of raw task data objects.
 * @returns {TaskProps[]} An array of parsed and formatted task properties.
 */
export function parseTasks(tasks: TaskData[]): TaskProps[] {
    return tasks.map(task => {
        const objectiveWords = task.objective.text.split(" ");
        let taskType = objectiveWords[0].toUpperCase();

        if (objectiveWords[0] === "Defeat") {
            if (isNaN(Number(objectiveWords[1]))) {
                taskType = "DEFEAT";
            } else {
                taskType = "WANTED";
            }
        }

        let newText = objectiveWords.slice(1).join(" ");
        if (newText.length > 0) {
            newText = newText[0].toUpperCase() + newText.slice(1);
        }

        let progTarget: number | undefined = task.objective.progress.target;
        let progCurrent: number | undefined = task.objective.progress.current;
        if (progTarget === -1) {
            progTarget = undefined;
            progCurrent = undefined;
        }

        let location = [task.objective.where];
        if (taskType === "VISIT") {
            newText = task.to.name;
            location = [task.to.building, task.to.neighborhood, task.to.zone];
        }

        if (taskType === "DELIVER") {
            newText += ` to ${task.to.name}`;
            location = [task.to.building, task.to.neighborhood, task.to.zone];
        }

        if (task.objective.progress.text === "Complete") {
            newText += ` return to ${task.to.name}`;
            location = [task.to.building, task.to.neighborhood, task.to.zone];
            taskType = "COMPLETE";
        }

        return {
            taskType: taskType,
            text: newText,
            where: location,
            progressText: task.objective.progress.text,
            progressCurrent: progCurrent,
            progressTarget: progTarget,
            reward: task.reward,
        };
    });
}
