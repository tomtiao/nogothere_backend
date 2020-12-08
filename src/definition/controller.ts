import { IncomingMessage, ServerResponse } from "http";

export interface ControllerFunc {
    (request: IncomingMessage, response: ServerResponse): void;
}

export interface ControllerObject {
    [url: string]: ControllerFunc;
}