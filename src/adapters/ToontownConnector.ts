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

    static #instance: ToontownConnector;

    public static getInstance(): ToontownConnector {
        if (!ToontownConnector.#instance) {
            ToontownConnector.#instance = new ToontownConnector();
            ToontownConnector.#instance.startConnection();
        }

        return ToontownConnector.#instance;
    }

    public startConnection() {
        this.getToonData().then((data) => {
            console.log(data);
        });
    }

    public async getAllToonData(): Promise<InfoResponse[]> {
        const responseHolder: Promise<InfoResponse>[] = [];

        for (let portNumber = this.PORT_RANGE_START; portNumber <= this.PORT_RANGE_END; portNumber += 1) {
            responseHolder.push(this.getToonData(portNumber));
        }

        const resolvedPromises: InfoResponse[] = [];
        responseHolder.forEach(responsePromise => {
            responsePromise.then((response) => {
                resolvedPromises.push(response);
            }).catch(error => {
                console.log(error);
            });
        });

        await Promise.allSettled(responseHolder);

        return resolvedPromises;
    }

    public async getToonData(port: number = this.PORT_RANGE_START): Promise<InfoResponse> {
        const requestHeaders = new Headers();
        requestHeaders.set('Accept', 'application/json');
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Host', `${this.HOST_STRING_START}${port}`);
        requestHeaders.append('User-Agent', `${this.USER_AGENT}`);
        requestHeaders.append('Authorization', `Basic ${this.AUTH_STRING_START}`);
        requestHeaders.append('Origin', `${this.USER_AGENT}`);

        return await fetch(`${this.HOST_STRING_START}${port}/info.json`, {
            headers: requestHeaders,
            mode: "cors",
        }).then(response => {
            return response.json();
        }).catch(error => {
            // console.error(error);
            throw new Error(`Unable to get info: ${error} for ${port}`);
        }).finally(() => {
            // console.log("Complete");
        });
    }
}