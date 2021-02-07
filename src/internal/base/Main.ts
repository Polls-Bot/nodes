import WS from '../websocket/WS';
import HTTP from '../http/HTTP';
import Collection from '../utilities/Collection';

export default class Main {

    public client: any;

    public constructor() {
        this.client = {
            discord_bot: {
                nodes: new Collection()
            } 
        }

        new HTTP(this.client);
        new WS(this.client);
    }
}