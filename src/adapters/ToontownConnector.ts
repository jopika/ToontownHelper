import {InfoResponse} from "../types/InfoResponse";

/**
 * Main class to help manage connections to ToonTown Client, can be replaced
 */
export class ToontownConnector {

    PORT_RANGE_START = 1547
    // PORT_RANGE_START = 1548
    PORT_RANGE_END = 1552

    HOST_STRING_START = "http://localhost:"
    USER_AGENT = "ToonTownLocalHelper"
    AUTH_STRING_START = "local-helper-"

    public startConnection() {
        console.log("In method here");

        this.getToonData().then((data) => {
            console.log(data);
        });
    }

    public async getToonData(): Promise<InfoResponse> {
        const requestHeaders = new Headers();
        requestHeaders.set('Accept', 'application/json');
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Host', `${this.HOST_STRING_START}${this.PORT_RANGE_START}`);
        requestHeaders.append('User-Agent', `${this.USER_AGENT}`);
        requestHeaders.append('Authorization', `Basic ${this.AUTH_STRING_START}`);
        requestHeaders.append('Origin', `${this.USER_AGENT}`);

        return await fetch(`${this.HOST_STRING_START}${this.PORT_RANGE_START}/info.json`, {
            headers: requestHeaders,
            mode: "cors",
        }).then(response => {
            return response.json();
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            console.log("Complete");
        });
    }
}