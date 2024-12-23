import { createRoot } from 'react-dom/client';
import Task from './TaskBox';
import ToonLayout from './ToonLayout';
import { InfoResponse, TaskData, TaskObjective } from './src/types/InfoResponse';
import { ToontownConnector } from './src/adapters/ToontownConnector';
import { useEffect, useState } from 'react';
import {TaskHubConnector} from "./src/adapters/TaskHubConnector";


export type TaskProps = {taskType: string, text: string, where: string, progressText: string, progressCurrent: number, progressTarget: number, reward: string}

const domNode = document.getElementById('display');
const root = createRoot(domNode);
// root.render(<Task taskType={TaskType.DELIVER} text={"DO THIS!"} where="" progressText={''} progressCurrent={0} progressTarget={0} />);

console.log("About to start Toontown Connection")
const toonTownConnector = new ToontownConnector();

toonTownConnector.startConnection();

root.render(<App/>)

// function setupDataRetrieval() {
//   function retrieveToonData(setDataUp) {
//       toonTownConnector.getToonData().then((response) => {
//         // TODO - is this the right way to update...?
//         console.log(response);
//         setDataUp([response]);
//       });
//   }

//   setInterval(retrieveToonData, 10000);
// }

// setupDataRetrieval();


export default function App() {
  
    let data: InfoResponse[] = [];
    let [dataUp, setDataUp] = useState(data);
    
    useEffect(() => {
      const interval = setInterval(function retrieveToonData() {
        toonTownConnector.getToonData().then((response) => {
          // TODO - is this the right way to update...?
          console.log(response);
          setDataUp([response]);
        });
    }, 10000);
      
      return () => {
        clearInterval(interval);
      };
    }, []);


    let toons = dataUp.map(info => {
      let toonName = info.toon.name;
      let tasks: TaskData[] = info.tasks;
  
      let tasksParsed: TaskProps[] = [];
      
      for (let task of tasks) {
        let objectiveWords = task.objective.text.split(" ");
        let taskType = objectiveWords[0].toUpperCase();
        
        if (objectiveWords[0] == "Defeat") {
            if (isNaN(Number(objectiveWords[1]))) {
              taskType = "DEFEAT";
            } else {
              taskType = "WANTED";
            }
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
      
      return (<ToonLayout key={info.toon.id} name={toonName} colour={info.toon.headColor} tasks={tasksParsed}/>);
    });
    
    console.log(toons)
    return (<div> {toons} </div>);
}