import { TaskProps, TaskType } from "./app";

export default function Task(props: TaskProps) {
    let { taskType, 
        text,
        where,
        progressText,
        progressCurrent,
        progressTarget
    } = props;

 
    return (
        <div key={text + where}
        className="taskbox"
        style={{border: `1px solid "#000000`}}>
            {text}<br/>
            {where}<br/>
        </div>

    //       style={{
    //         opacity: canEdit ? 1 : 0.5,
    //         backgroundColor: colour,
    //         border: `1px solid ${noBorder ? colour : "#D3D3D3"}`,
    //         cursor: canEdit ? "pointer" : "default",
    //       }}
    //       className="pixel"
    //       onClick={canEdit ? onChange : undefined}
    //     >
    //       {rowArrow && <i style={{}} className="fa fa-angle-right"></i>}
    //       {colArrow && <i style={{}} className="fa fa-angle-down"></i>}
    //       {stitchType === RAISED && (
    //         <i
    //           style={{
    //             color: dotColour,
    //             paddingBottom: 5,
    //             fontSize: 5,
    //             textAlign: "center",
    //             verticalAlign: "middle",
    //           }}
    //           className="fa fa-circle"
    //         />
    //       )}
    //     </div>
      );
}