import { createRoot } from 'react-dom/client';
import Task from './TaskBox';
import ToonLayout from './ToonLayout';
import { InfoResponse, TaskData, TaskObjective } from './src/types/InfoResponse';
import { ToontownConnector } from './src/adapters/ToontownConnector';
import { useState } from 'react';

export enum TaskType {
  DEFEAT,
  WANTED,
  RECOVER,
  GOFISHING,
  DELIVER,
  VISIT
}

export function taskTypeToString(task: TaskType) {
  switch (task) {
    case TaskType.DEFEAT:
      return "DEFEAT";
    case TaskType.WANTED:
      return "WANTED";
    case TaskType.RECOVER:
      return "RECOVER";
    case TaskType.GOFISHING:
      return "GO FISHING";
    case TaskType.DELIVER:
      return "DELIVER";
    case TaskType.VISIT:
      return "VISIT";
  }
}

export type TaskProps = {taskType: TaskType, text: string, where: string, progressText: string, progressCurrent: number, progressTarget: number, reward: string}

const domNode = document.getElementById('display');
const root = createRoot(domNode);
// root.render(<Task taskType={TaskType.DELIVER} text={"DO THIS!"} where="" progressText={''} progressCurrent={0} progressTarget={0} />);

console.log("About to start Toontown Connection")
const toonTownConnector = new ToontownConnector();

toonTownConnector.startConnection();

root.render(<App/>)


export default function App() {
  
    let data: InfoResponse[] = [];
    let [dataUp, setDataUp] = useState(data);

    function setupDataRetrieval() {
        function retrieveToonData() {
            toonTownConnector.getToonData().then((response) => {
              // TODO - is this the right way to update...?
              console.log(response);
              setDataUp([response]);
            });
        }

        setInterval(retrieveToonData, 10000);
    }

    setupDataRetrieval();
    
    let toons = dataUp.map(info => {
      let toonName = info.toon.name;
      let tasks: TaskData[] = info.tasks;
  
      let tasksParsed: TaskProps[] = [];
      
      for (let task of tasks) {
        let taskType = TaskType.DEFEAT;

        let objectiveWords = task.objective.text.split(" ");
      
        switch (objectiveWords[0]) {
          case "Defeat":
            if (isNaN(Number(objectiveWords[1]))) {
              taskType = TaskType.DEFEAT;
            } else {
              taskType = TaskType.WANTED;
            }
            break;
          case "Visit": 
            taskType = TaskType.VISIT;
            break;
        }

        let newText = objectiveWords.slice(1).join(" ");
        newText = newText[0].toUpperCase() + newText.slice(1);
        

        let taskParsed: TaskProps = {
          taskType: taskType,
          text: newText,
          where: task.objective.where,
          progressText: task.objective.progress.text,
          progressCurrent: task.objective.progress.current,
          progressTarget: task.objective.progress.target,
          reward: task.reward
        }
        tasksParsed.push(taskParsed);
      }
      
      return (<ToonLayout key={info.toon.id} name={toonName} tasks={tasksParsed}/>);
    });
    
    console.log(toons)
    return (<div> {toons} </div>);
}