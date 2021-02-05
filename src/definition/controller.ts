import { IncomingMessage, ServerResponse } from "http";

export interface ControllerFunc {
    (request: IncomingMessage, response: ServerResponse): void;
}

export type ControllerObject = Map<string, ControllerFunc>;