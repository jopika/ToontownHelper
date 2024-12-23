import { TaskProps } from "app";
import Task from "./TaskBox";



export default function ToonLayout(props: {name: string, tasks: TaskProps[]}) {
    let {name, tasks} = props;

    let taskObjects = tasks.map(taskprop => (<Task key={taskprop.text + taskprop.where} {...taskprop} />))

    return (
        <div className="toonInfo">
            <p>{name}</p>
        <br/>
        <div className="taskGroup">
            {taskObjects}
        </div>
        </div>
    )

}