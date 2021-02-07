import Express, { Request, Response } from 'express';
import fs = require('fs');
import Cors from 'cors';
import Logger from '../utilities/Logger';

export default class Server {

    public server: Express.Application;
    public client: any;

    public constructor(client) {
        this.server = Express();
        this.client = client;

        this.main();
    }

    public main() {
        this.server.use(Cors({
            origin: true
        }));

        this.server.get("/api/internal", async (req: Request, res: Response) => {
            res.status(200).json({
                exited_code: 0,
                message: "api is running"
            });
        });

        fs.readdirSync("./bundle/internal/http/routes").map((dir: any) => {
            let _route = require(`./routes/${dir}`);
            new _route.default(this.server, this.client).listen();
        });

        this.server.listen(process.env.HTTP_PORT, () => {
            Logger.prototype.debug("HTTP", `API running on ${process.env.HTTP_PORT}.`);
        });
    }
}