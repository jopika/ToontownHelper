import { createRoot } from 'react-dom/client';
import Task from './TaskBox';
import ToonLayout from './ToonLayout';

export enum TaskType {
  DEFEAT,
  RECOVER,
  GOFISHING,
  DELIVER,
  VISIT
}

export type TaskProps = {taskType: TaskType, text: string, where: string, progressText: string, progressCurrent: number, progressTarget: number}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
// root.render(<Task taskType={TaskType.DELIVER} text={"DO THIS!"} where="" progressText={''} progressCurrent={0} progressTarget={0} />);



root.render(<ToonLayout name="Marigold" tasks={[{
  taskType: TaskType.DELIVER, "text": "DO THIS!", where:"", progressText:"", progressCurrent: undefined, progressTarget: undefined},
  {taskType: TaskType.DELIVER, "text": "DO THIS2!", where:"", progressText:"", progressCurrent: undefined, progressTarget: undefined}]}/>)


  export default function App(props: {jsonObj: string}) {
  let { jsonObj } = props;

  let obj = JSON.parse(jsonObj);
  let toonName = obj["toon"]["name"];
  let tasks: { [key: string]: any[] }[] = obj["tasks"];

  let tasksParsed: TaskProps[] = [];
  for (let task in tasks) {
    let taskParsed: TaskProps = {
      taskType: TaskType.DEFEAT,
      text: task["objective"]["text"],
      where: task["objective"]["where"],
      progressText: task["objective"]["progress"]["text"],
      progressCurrent: task["objective"]["progress"]["current"],
      progressTarget: task["objective"]["progress"]["target"]
    }
    tasksParsed.push(taskParsed);
  }

  return (<ToonLayout name={toonName} tasks={tasksParsed}/>)
}