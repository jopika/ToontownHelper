import {InfoResponse} from "../types/InfoResponse";
import {ToonMetadata} from "../types/ToonMetadata"

export class TaskHubConnector {

    static taskHubUrl = "localhost:3000";
    TASK_ROUTE = "/metadata"
    UPDATE_ROUTE = "update"
    GET_ROOM_ROUTE = "/getAllInRoom"
    static #instance: TaskHubConnector;
    // private toonTownConnector: ToontownConnector;

    private constructor() {
        console.log("Setting up TaskHubConnector");
    }

    public getTaskHubConnector() {
        if (!TaskHubConnector.#instance) {
            TaskHubConnector.#instance = new TaskHubConnector();
        }

        return TaskHubConnector.#instance;
    }

    public async joinRoom(roomId: string, toonMetadata: InfoResponse): Promise<ToonMetadata[]> {
        const response = await this.callEndpoint("POST", `${this.UPDATE_ROUTE}`, toonMetadata);

        return response.filter(toonData => toonData.metadata.toon.id !== toonMetadata.toon.id);
    }

    public async getAllInRoom(roomId: string, toonId: string): Promise<ToonMetadata[]> {
        const response = await this.callEndpoint("GET", `${this.GET_ROOM_ROUTE}/${roomId}`);

        return response.filter(toonData => toonData.metadata.toon.id !== toonId);
    }

    private async callEndpoint(method: string, endpoint: string, body?: any): Promise<ToonMetadata[]> {
        const requestHeaders = new Headers();
        requestHeaders.set('Accept', 'application/json');
        requestHeaders.append('Content-Type', 'application/json');

        const requestInit: any = {
            headers: requestHeaders,
            method: method,
        }

        if (body) {
            requestInit.body = JSON.stringify(body)
        }

        console.log(JSON.stringify(requestInit));

        const response = await fetch(`${TaskHubConnector.taskHubUrl}${(this.TASK_ROUTE)}/${endpoint}`, requestInit);

        return await response.json();
    }

}