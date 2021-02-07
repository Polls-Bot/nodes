import Express, { Request, Response } from 'express';

export default class NodesRoute {

    private server: Express.Application;
    private client: any;

    public constructor(server, client) {
        this.server = server;
        this.client = client;
    }

    public async listen() {
        this.server.post(`/api/internal/get/discord/nodes`, async (req: Request, res: Response) => {
            return res.status(200).json({
                exited_code: 0,
                data: this.client.discord_bot.nodes.toJSON()
            });
        });
    }
}