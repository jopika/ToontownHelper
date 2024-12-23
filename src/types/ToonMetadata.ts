import {InfoResponse} from "./InfoResponse";

export interface ToonMetadata {
    id: number,
    roomId: string,
    metadata: InfoResponse
    updatedAt: number, // Heartbeat
    joinedAt: number, // timestamp when joined
    test?: boolean,
}