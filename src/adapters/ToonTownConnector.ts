/**
 * Main class to help manage connections to ToonTown Client, can be replaced
 */
export class ToonTownConnector {

    PORT_RANGE_START = 1547
    // PORT_RANGE_START = 1548
    PORT_RANGE_END = 1552

    HOST_STRING_START = "http://localhost:"
    USER_AGENT = "ToonTownLocalHelper"
    AUTH_STRING_START = "local-helper:"

    public startConnection() {
        console.log("In method here");

        const standardHeader = {
            "Host": "localhost:1547",
            "UserAgent": this.USER_AGENT,
            "Authorization": this.AUTH_STRING_START + 1,
            // "Referrer-Policy": "same-origin",
            // "Origin": "*",
            // "Access-Control-Allow-Origin": "*",
            // "Sec-Fetch-Mode": 'no-cors',
            // "Sec-Fetch-Site": 'none',
            // "Sec-Fetch-Dest": 'document',
        }

        console.log("Starting connection...");
        // Start the first connection
        fetch(`${this.HOST_STRING_START}${this.PORT_RANGE_START}/info.json`, {
            headers: standardHeader,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            }).then(data => {
              console.log(data);
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                console.log("Complete");
        });
    }

}