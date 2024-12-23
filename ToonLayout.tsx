import { TaskProps } from "app";
import Task from "./TaskBox";



export default function ToonLayout(props: {name: string, colour: string, tasks: TaskProps[]}) {
    let {name, colour, tasks} = props;

    let taskObjects = tasks.map(taskprop => (<Task key={taskprop.text + taskprop.where} {...taskprop} />))

    return (
        <div className="toonInfo" style={{ backgroundColor: colour }}>
            <p className="toonName">{name}</p>
        <br/>
        <div className="taskGroup">
            {taskObjects}
        </div>
        </div>
    )

}