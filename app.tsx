import { createRoot } from 'react-dom/client';
import Task from './TaskBox';
import ToonLayout from './ToonLayout';
import { InfoResponse, TaskData, TaskObjective } from './src/types/InfoResponse';
import { ToontownConnector } from './src/adapters/ToontownConnector';
import { useEffect, useState } from 'react';
import { TaskHubConnector } from "./src/adapters/TaskHubConnector";


export type TaskProps = {taskType: string, text: string, where: string, progressText: string, progressCurrent: number, progressTarget: number, reward: string}

const domNode = document.getElementById('display');
const root = createRoot(domNode);
// root.render(<Task taskType={TaskType.DELIVER} text={"DO THIS!"} where="" progressText={''} progressCurrent={0} progressTarget={0} />);

console.log("About to start Toontown Connection")
const toonTownConnector = new ToontownConnector();

toonTownConnector.startConnection();

const taskHubConnector = TaskHubConnector.getTaskHubConnector();

root.render(<App/>)


export default function App() {
  
    let data: InfoResponse[] = [];
    let [dataUp, setDataUp] = useState(data);
    let _sessionId: string = '';
    let [sessionId, setSessionId] = useState(_sessionId);

    let retrieveToonData = (sid?: string) => {
      toonTownConnector.getToonData().then((response) => {
        // TODO - is this the right way to update...?
        console.log(response);
        setDataUp([response]);

        // then, join room
        console.log(sessionId);
        if (sessionId != undefined && sessionId != "") {
          taskHubConnector.joinRoom(sessionId, response).then(data => {
            let otherInfoResponses = data.map(d => d.metadata);
            setDataUp([response, ...otherInfoResponses]);
          });
          // we can also fall back on sid
        } else if (sid != undefined && sid != "") {
          taskHubConnector.joinRoom(sid, response).then(data => {
            let otherInfoResponses = data.map(d => d.metadata);
            setDataUp([response, ...otherInfoResponses]);
          });
        }
      })
    }
    
    let buttonOnClick = () => {
      let sid = (document.getElementById("session") as HTMLInputElement).value;
      setSessionId(s => sid.trim());
      console.log(sid);
      console.log(sessionId);
      retrieveToonData(sid);
    }

    useEffect(() => {
      const interval = setInterval(retrieveToonData, 10000);

      retrieveToonData();
      
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

    return (<div>
      <p>Please enter your session id: <input id="session" type="text"/><button onClick={buttonOnClick}>Join!</button></p>
      <p></p>
      <div>{toons}</div>
      </div>);
}