export interface Node {
    id: number
    token: string
    name: string
    online: boolean
    lastUpdate: number
}

export interface PacketFromClient {
    name: string,
    data: any
}

export interface PacketFromBot {
    name: string,
    data: any
}

export interface PacketFromNodes {
    name: string,
    data: Node
}

export interface PacketFromAPI {
    name: string,
    data: any
}

export interface PacketFromHere {
    name: string,
    data: any
}

export interface MessageForNode {
    eventName: string
    data: any
}