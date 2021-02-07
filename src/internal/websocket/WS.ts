import WS from 'ws';
import Logger from '../utilities/Logger';
import { 
    PacketFromAPI, 
    PacketFromBot, 
    PacketFromClient, 
    PacketFromNodes,
    Node
} from "../../Types";
import { Socket } from 'dgram';

export default class WebSocket {

    public server: any;
    public client: any;

    public constructor(client: any) {
        this.client = client;
        this.server = new WS.Server({
            port: process.env.WS_PORT,
            perMessageDeflate: {
              zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3
              },
              zlibInflateOptions: {
                chunkSize: 10 * 1024
              },
              clientNoContextTakeover: true,
              serverNoContextTakeover: true,
              serverMaxWindowBits: 10,
              concurrencyLimit: 10,
              threshold: 1024
            }
        });

        this.receiveConnections();
    }

    public async receiveConnections(): Promise<void> {
        Logger.prototype.debug("WS", `Receiving packets on ${process.env.WS_PORT}.`);
        this.server.on("connection", (socket: any) => {
        
            socket.on('open', async (): Promise<any> => {
                socket.send('hello');
            });
              
            socket.on('message', async (packet: PacketFromAPI | PacketFromBot | PacketFromClient | PacketFromNodes | any): Promise<any> => {
                packet = JSON.parse(packet);
                if(!packet || (packet && !packet.data || (packet.data && !(packet.data.id || packet.data.token)))) return;
                switch(packet.name) {
                    case "discord_bot_nodes":
                        this.packetNodes(socket, packet);
                        break;
                    case "broadcast":
                        this.broadcast(socket, packet.data);
                        break;
                
                }
            });
          
            return true;
        });

        this.server.on('close', () => {
            return Logger.prototype.warn("Nodes", "Some node has been disconnected.");
        });
    }

    public async packetNodes(socket: any, packet: PacketFromNodes): Promise<void> {

        let _node: Node = {
            id: packet.data.id,
            name: packet.data.name || null,
            online: packet.data.online,
            token: packet.data.token,
            lastUpdate: Date.now()
        }

        if(socket._nodeTimeout) clearTimeout(socket._nodeTimeout);

        let _availableTokens = ["iz5DCqM9Y3dB/5/061Tsdgg{sKb_5np?c1?xFh{hg]%kwZh7e/k]^tCAxX6HE4", "qCTv_8|kOVJ]6JOR_4w:u)W@;9`_1Qo~@Oiz]]~aHws.tQ0OK/p#]2^8&M2yX>u"];
        if(!_availableTokens.includes(packet.data.token)) return;
        
        if(this.client.discord_bot.nodes.get(packet.data.id)) {
            let _previousNode = this.client.discord_bot.nodes.find((e: any) => e.token === packet.data.token);
            if(!_previousNode) return;
            if(!(Date.now() - _previousNode.lastUpdate > 14000 && Date.now() - _previousNode.lastUpdate < 20000)) return;

            return this.client.discord_bot.nodes.set(_node.id, _node);
        }

        this.client.discord_bot.nodes.set(_node.id, _node);
        Logger.prototype.info("Nodes", `The node ${_node.id} has been connected successfully (id: ${_node.id}).`);

        socket._nodeTimeout = setTimeout(() => {
            return Logger.prototype.warn("Nodes", "Some node doesn't send packets.");
        }, 18000);

        return;
    }

    public async broadcast(socket: any, data: string | number | any) {

        if(typeof data === "object") {
            data = JSON.stringify(data);
        }

        for(let client of this.server.clients) {
            if(client !== socket && client.readyState === WS.OPEN) {
                client.send(data);
            }
        }
    }
}