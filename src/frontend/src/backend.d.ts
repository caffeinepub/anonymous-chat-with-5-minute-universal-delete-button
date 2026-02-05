import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    content: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    deleteMessage(messageId: bigint): Promise<void>;
    listMessages(): Promise<Array<Message>>;
    sendMessage(text: string): Promise<bigint>;
    trimMessages(): Promise<void>;
}
