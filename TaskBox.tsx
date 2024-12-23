import { useState } from "react";
import { TaskProps } from "./app";

export default function Task(props: TaskProps) {
    let { taskType, 
        text,
        where,
        progressText,
        progressCurrent,
        progressTarget,
        reward
    } = props;
    
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);
 
    return (
        <div key={text + where}
        className="taskbox" 
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}>
            <div className="type">{taskType}</div>
            <div className="icon"></div>
            <div className="goal">{text}</div>
            <div className="where">{where}</div>
            <div className="progress">
            <span className="progressText">{progressCurrent} of {progressTarget}</span>
            <progress value={progressCurrent} max={progressTarget}></progress>
            </div>
            <div className="reward" style={{visibility:`${hovered ? "visible" : "hidden"}`}}>Reward: {reward}</div>
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