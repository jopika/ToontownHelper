import { useState, useEffect, useRef } from 'react';
import { InfoResponse } from '../types/InfoResponse';
import { ToontownConnector } from '../adapters/ToontownConnector';
import { TaskHubConnector } from '../adapters/TaskHubConnector';
import { ToonMetadata } from '../types/ToonMetadata';

const toonTownConnector = new ToontownConnector();
toonTownConnector.startConnection();

const taskHubConnector = TaskHubConnector.getInstance();

/**
 * @description Custom hook to manage and retrieve Toon data.
 * It fetches data from both the Toontown connector and the Task Hub,
 * and keeps the data updated at regular intervals.
 * @returns {{
 *   data: InfoResponse[],
 *   sessionId: string,
 *   setSessionId: React.Dispatch<React.SetStateAction<string>>,
 *   retrieveToonData: (sid?: string) => void
 * }} An object containing the toon data, session ID, and related functions.
 */
export function useToonData(): {
    data: InfoResponse[];
    sessionId: string;
    setSessionId: React.Dispatch<React.SetStateAction<string>>;
    retrieveToonData: (sid?: string) => void;
} {
    const [data, setData] = useState<InfoResponse[]>([]);
    const [sessionId, setSessionId] = useState<string>('');

    /**
     * @description Retrieves Toon data from the Toontown connector and updates the state.
     * If a session ID is available, it also joins a room in the Task Hub to get data for other toons.
     * @param {string} [sid] - An optional session ID to use if the state one is not yet set.
     */
    const retrieveToonData = (sid?: string) => {
        toonTownConnector.getAllToonData().then(response => {
            let sessionIdentifier: string | null = null;
            if (sessionId) {
                sessionIdentifier = sessionId;
            } else if (sid) {
                sessionIdentifier = sid;
            }

            if (sessionIdentifier) {
                taskHubConnector.joinRoomWithMany(sessionIdentifier, response).then((data: ToonMetadata[]) => {
                    const otherInfoResponses = data.map((d: ToonMetadata) => d.metadata);
                    setData([...response.sort((a, b) => a.toon.id.localeCompare(b.toon.id)), ...otherInfoResponses]);
                });
            } else {
                setData(response.sort((a, b) => a.toon.id.localeCompare(b.toon.id)));
            }
        });
    };

    const toonUpdateRef = useRef(retrieveToonData);
    toonUpdateRef.current = retrieveToonData;

    useEffect(() => {
        const interval = setInterval(() => toonUpdateRef.current(), 10000);
        toonUpdateRef.current();

        return () => {
            clearInterval(interval);
        };
    }, []);

    return { data, sessionId, setSessionId, retrieveToonData: toonUpdateRef.current };
}
