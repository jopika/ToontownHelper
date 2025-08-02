import { InfoResponse } from "../types/InfoResponse";
import { ToonMetadata } from "../types/ToonMetadata";

/**
 * @class TaskHubConnector
 * @description Manages the connection and data exchange with the Task Hub server.
 * This class follows the Singleton pattern to ensure only one instance exists.
 * It is responsible for operations related to rooms and toon metadata.
 */
export class TaskHubConnector {
    private static readonly TASK_HUB_URL = "http://34.145.13.149:3024";
    // private static readonly DEV_TASK_HUB_URL = "http://localhost:3000";
    private static readonly TASK_ROUTE = "/metadata";
    private static readonly UPDATE_ROUTE = "update";
    private static readonly UPDATE_MANY_ROUTE = "updateMany";
    private static readonly GET_ROOM_ROUTE = "getAllInRoom";

    private static instance: TaskHubConnector;

    private constructor() {
        console.log("Setting up TaskHubConnector");
    }

    /**
     * @description Gets the singleton instance of the TaskHubConnector.
     * @returns {TaskHubConnector} The singleton instance.
     */
    public static getInstance(): TaskHubConnector {
        if (!TaskHubConnector.instance) {
            TaskHubConnector.instance = new TaskHubConnector();
        }
        return TaskHubConnector.instance;
    }

    /**
     * @description Allows a single toon to join a room and retrieves the list of other toons in that room.
     * @param {string} roomId - The ID of the room to join.
     * @param {InfoResponse} toonMetadata - The metadata of the toon joining the room.
     * @returns {Promise<ToonMetadata[]>} A promise that resolves to an array of metadata for other toons in the room.
     */
    public async joinRoom(roomId: string, toonMetadata: InfoResponse): Promise<ToonMetadata[]> {
        const body = {
            roomId,
            metadata: toonMetadata,
        };
        const response = await this.callEndpoint("POST", TaskHubConnector.UPDATE_ROUTE, body);
        return response.filter(toonData => toonData.metadata.toon.id !== toonMetadata.toon.id);
    }

    /**
     * @description Allows multiple toons to join a room and retrieves the list of other toons in that room.
     * @param {string} roomId - The ID of the room to join.
     * @param {InfoResponse[]} toonsMetadata - The metadata of the toons joining the room.
     * @returns {Promise<ToonMetadata[]>} A promise that resolves to an array of metadata for other toons in the room.
     */
    public async joinRoomWithMany(roomId: string, toonsMetadata: InfoResponse[]): Promise<ToonMetadata[]> {
        const body = {
            roomId,
            metadata: toonsMetadata,
        };
        const response = await this.callEndpoint("POST", TaskHubConnector.UPDATE_MANY_ROUTE, body);
        const toonIds = new Set(toonsMetadata.map(metadata => metadata.toon.id));
        return response.filter(toonData => !toonIds.has(toonData.metadata.toon.id));
    }

    /**
     * @description Retrieves all toons currently in a specific room, excluding the querying toon.
     * @param {string} roomId - The ID of the room.
     * @param {string} toonId - The ID of the toon making the request, to be excluded from the result.
     * @returns {Promise<ToonMetadata[]>} A promise that resolves to an array of metadata for other toons in the room.
     */
    public async getAllInRoom(roomId: string, toonId: string): Promise<ToonMetadata[]> {
        const response = await this.callEndpoint("GET", `${TaskHubConnector.GET_ROOM_ROUTE}/${roomId}`);
        return response.filter(toonData => toonData.metadata.toon.id !== toonId);
    }

    /**
     * @description A generic method to make API calls to the Task Hub server.
     * @param {"GET" | "POST" | "PUT" | "DELETE"} method - The HTTP method.
     * @param {string} endpoint - The API endpoint to call.
     * @param {Record<string, unknown>} [body] - The request body for POST or PUT requests.
     * @returns {Promise<ToonMetadata[]>} A promise that resolves to the JSON response from the API.
     * @private
     */
    private async callEndpoint(
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        body?: Record<string, unknown>
    ): Promise<ToonMetadata[]> {
        const url = `${TaskHubConnector.TASK_HUB_URL}${TaskHubConnector.TASK_ROUTE}/${endpoint}`;
        const headers = new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
        });

        const requestInit: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(url, requestInit);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to call endpoint:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
}
