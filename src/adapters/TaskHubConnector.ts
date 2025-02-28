import {InfoResponse} from "../types/InfoResponse";
import {ToonMetadata} from "../types/ToonMetadata"
import {meta} from "@typescript-eslint/parser";

export class TaskHubConnector {

    static taskHubUrl = "http://34.145.13.149:3024";
    // static taskHubUrl = "http://localhost:3000";
    TASK_ROUTE = "/metadata"
    UPDATE_ROUTE = "update"
    UPDATE_MANY_ROUTE = "updateMany"
    GET_ROOM_ROUTE = "getAllInRoom"
    static #instance: TaskHubConnector;
    // private toonTownConnector: ToontownConnector;

    private constructor() {
        console.log("Setting up TaskHubConnector");
    }

    public static getTaskHubConnector() {
        if (!TaskHubConnector.#instance) {
            TaskHubConnector.#instance = new TaskHubConnector();
        }

        return TaskHubConnector.#instance;
    }

    public async joinRoom(roomId: string, toonMetadata: InfoResponse): Promise<ToonMetadata[]> {
        const body = {
            roomId: roomId,
            metadata: toonMetadata,
        }
        const response = await this.callEndpoint("POST", `${this.UPDATE_ROUTE}`, body);

        return response.filter(toonData => toonData.metadata.toon.id !== toonMetadata.toon.id);
    }

    public async joinRoomWithMany(roomId: string, toonMetadata: InfoResponse[]): Promise<ToonMetadata[]> {
        const body = {
            roomId: roomId,
            metadata: toonMetadata,
        }

        const response = await this.callEndpoint("POST", `${this.UPDATE_MANY_ROUTE}`, body);

        const toonMetadataIds = toonMetadata.map(metadata => metadata.toon.id);

        return response.filter(toonData => !toonMetadataIds.includes(toonData.metadata.toon.id));
    }

    public async getAllInRoom(roomId: string, toonId: string): Promise<ToonMetadata[]> {
        const response = await this.callEndpoint("GET", `${this.GET_ROOM_ROUTE}/${roomId}`);

        return response.filter(toonData => toonData.metadata.toon.id !== toonId);
    }

    private async callEndpoint(method: string, endpoint: string, body?: any): Promise<ToonMetadata[]> {
        const requestHeaders = new Headers();
        requestHeaders.set('Accept', 'application/json');
        requestHeaders.append('Content-Type', 'application/json');

        let requestInit: any;

        if (body) {
            requestInit = {
                headers: requestHeaders,
                method: method,
                body: JSON.stringify(body)
            }
        } else {
            requestInit = {
                headers: requestHeaders,
                method: method,
            }
        }

        // console.log(JSON.stringify(requestInit));

        const response = await fetch(`${TaskHubConnector.taskHubUrl}${(this.TASK_ROUTE)}/${endpoint}`, requestInit);

        return await response.json();
    }

}