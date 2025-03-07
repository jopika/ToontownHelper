import {createRoot} from 'react-dom/client';
import ToonLayout from './ToonLayout';
import {InfoResponse, TaskData} from './src/types/InfoResponse';
import {ToontownConnector} from './src/adapters/ToontownConnector';
import {useEffect, useRef, useState} from 'react';
import {TaskHubConnector} from "./src/adapters/TaskHubConnector";
import VersionBanner from "./src/components/VersionBanner";


export type TaskProps = {taskType: string, text: string, where: string[], progressText: string, progressCurrent: number, progressTarget: number, reward: string}

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
    const [sessionId, setSessionId] = useState(_sessionId);
  
    useEffect(() => {
      console.log(sessionId, '- Has changed')
  },[sessionId])

    const retrieveToonData = (sid?: string) => {
      toonTownConnector.getAllToonData().then(response => {
        // sanity check, make sure sessionId is defined
        let sessionIdentifier: string | null = null;
        if (sessionId != undefined && sessionId != "") {
          sessionIdentifier = sessionId;
          // fallback to sids
        } else if (sid != undefined && sid != "") {
          sessionIdentifier = sid;
        }

        // If there is a session connected
        if (sessionIdentifier != null) {
          taskHubConnector.joinRoomWithMany(sessionId, response).then(data => {
            const otherInfoResponses = data.map(d => d.metadata);
            setDataUp([...response.sort((a, b) => a.toon.id.localeCompare(b.toon.id)), ...otherInfoResponses]);
          });
        } else {
          // no session, just display local
          setDataUp(response.sort((a, b) => a.toon.id.localeCompare(b.toon.id)));
        }

      });

      // toonTownConnector.getToonData().then((response) => {
      //   // TODO - is this the right way to update...?
      //   // then, join room
      //   if (sessionId != undefined && sessionId != "") {
      //     taskHubConnector.joinRoom(sessionId, response).then(data => {
      //       const otherInfoResponses = data.map(d => d.metadata);
      //       setDataUp([response, ...otherInfoResponses]);
      //     });
      //     // we can also fall back on sid
      //   } else if (sid != undefined && sid != "") {
      //     taskHubConnector.joinRoom(sid, response).then(data => {
      //       const otherInfoResponses = data.map(d => d.metadata);
      //       setDataUp([response, ...otherInfoResponses]);
      //     });
      //   } else {
      //     setDataUp([response]);
      //   }
      // });
    }

    // dumb capturing workaround: https://stackoverflow.com/questions/55066697/react-hooks-functions-have-old-version-of-a-state-var
    let toonUpdateRef = useRef(retrieveToonData);
    toonUpdateRef.current = retrieveToonData;
    
    useEffect(()=>{
      toonUpdateRef.current = retrieveToonData;
    });


    let buttonOnClick = () => {
      let sid = (document.getElementById("session") as HTMLInputElement).value;
      setSessionId(sid.trim());
      console.log(sid);
      console.log(sessionId);
      toonUpdateRef.current(sid);
    }

    useEffect(() => {
      const interval = setInterval(() => toonUpdateRef.current(), 10000);

      toonUpdateRef.current();
      
      return () => {
        clearInterval(interval);
      };
    }, []);


    let toons = dataUp.filter(p => p != undefined).map(info => {
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
        if (newText.length > 0) {
          newText = newText[0].toUpperCase() + newText.slice(1);
        }
        
        let progTarget = task.objective.progress.target;
        let progCurrent = task.objective.progress.current;
        if (progTarget == -1) {
          progTarget = undefined;
          progCurrent = undefined;
        }

        let location = [task.objective.where];
        if (taskType == "VISIT") {
          newText = task.to.name;
          location = [task.to.building, task.to.neighborhood,  task.to.zone];
        }

        if (taskType == "DELIVER") {
          newText += " to " + task.to.name;
          location = [task.to.building, task.to.neighborhood,  task.to.zone];
        }

        if (task.objective.progress.text == "Complete") {
          newText += " return to " + task.to.name;
          location = [task.to.building, task.to.neighborhood,  task.to.zone];
          taskType = "COMPLETE"
        }

        let taskParsed: TaskProps = {
          taskType: taskType,
          text: newText,
          where: location,
          progressText: task.objective.progress.text,
          progressCurrent: progCurrent,
          progressTarget: progTarget,
          reward: task.reward
        }
        tasksParsed.push(taskParsed);
      }
      
      return (<ToonLayout key={info.toon.id} name={toonName} colour={info.toon.headColor} tasks={tasksParsed}/>);
    });

    // console.log(toons)

    let success = (<div>
    <p>Please enter your session id: <input id="session" type="text"/><button onClick={buttonOnClick}>Join!</button></p>
    <p></p>
    <div>{toons}</div>
      <VersionBanner />
    </div>);

  let failure = (<div><div id="pleaseopen">No toons detected! Please connect to Toontown first. Make sure to allow Companion App Support in Options, then accept the connection.</div><VersionBanner /></div>)

    return toons.length > 0 ? success : failure;
}