import { IncomingMessage, ServerResponse } from "http"
import { RequestStatus } from "./requestStatus"

export type RequestObject = {
    status: (RequestStatus.PENDING | RequestStatus.RESOLVED),
    request: IncomingMessage,
    response: ServerResponse
}
