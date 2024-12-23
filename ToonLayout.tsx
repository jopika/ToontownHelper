import { TaskProps } from "app";
import Task from "./TaskBox";



export default function ToonLayout(props: {name: string, tasks: TaskProps[]}) {
    let {name, tasks} = props;

    let taskKey = tasks.map(task => task.text);
    let taskObjects = tasks.map(taskprop => (<Task {...taskprop} />))

    return (
        <div className="toonInfo">
            <p>{name}</p>
        <br/>
        <div className="tasks">
            {taskObjects}
        </div>
        </div>
    )

}