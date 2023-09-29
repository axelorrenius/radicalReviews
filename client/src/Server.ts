

export class Server {
    private endpoint = "http://localhost:8080";

    constructor() {
        console.log("Server created");
    }

    public async getTest() {
        const response = await fetch(this.endpoint + "/test");
        return await response.json();
    }
}