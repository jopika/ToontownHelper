import { createRoot } from 'react-dom/client';
import ToonLayout from './ToonLayout';
import VersionBanner from "./src/components/VersionBanner";
import { useToonData } from 'src/hooks/useToonData';
import { parseTasks } from 'src/utils/taskParser';

const domNode = document.getElementById('display');
const root = createRoot(domNode);

root.render(<App />);

export default function App() {
    const { data, setSessionId, retrieveToonData } = useToonData();

    const buttonOnClick = () => {
        const sid = (document.getElementById("session") as HTMLInputElement).value;
        setSessionId(sid.trim());
        retrieveToonData(sid.trim());
    }

    const toons = data.filter(p => p != undefined).map(info => {
        const tasksParsed = parseTasks(info.tasks);
        return (<ToonLayout key={info.toon.id} name={info.toon.name} colour={info.toon.headColor} tasks={tasksParsed} />);
    });

    const success = (
        <div>
            <p>Please enter your session id: <input id="session" type="text" /><button onClick={buttonOnClick}>Join!</button></p>
            <p></p>
            <div>{toons}</div>
            <VersionBanner />
        </div>
    );

    const failure = (
        <div>
            <div id="pleaseopen">No toons detected! Please connect to Toontown first. Make sure to allow Companion App Support in Options, then accept the connection.</div>
            <VersionBanner />
        </div>
    );

    return toons.length > 0 ? success : failure;
}
