import {Point} from "../math/point.ts";
import {IEdge} from "./edge.ts";

export type VertexProperties = {
    uuid?: string,
    title?: string,
    outgoingEdges?: Set<IEdge>,
    incomingEdges?: Set<IEdge>,
    point?: Point,
    object?: any,
}

export interface IVertex extends VertexProperties {
    hasPosition(): boolean;

    getAllEdges(): Set<IEdge>;
    getNeighbours(): Set<IVertex>;
    getReachableNeighbours(): Set<IVertex>;
    getEdgeTo(to: IVertex): IEdge | undefined;

    addIncomingEdge(incoming: IEdge): boolean;
    removeIncomingEdge(e: IEdge): boolean;
    addOutgoingEdge(outgoing: IEdge): boolean;
    removeOutgoingEdge(e: IEdge): boolean;

    deg(): number;
    indeg(): number;
    outdeg(): number;
}

export class Vertex implements IVertex {
    title: string;
    uuid: string;
    outgoingEdges: Set<IEdge>;
    incomingEdges: Set<IEdge>;
    point: Point;
    object: object;

    constructor(options: VertexProperties = <VertexProperties>{}) {
        options = {
            ...{
                uuid: crypto.randomUUID(),
                title: 'new vertex',
                incomingEdges: new Set(),
                outgoingEdges: new Set(),
            },
            ...options,
        }
        this.uuid = options.uuid!;
        this.title = options.title!;
        this.point = options.point!;
        this.object = options.object;
        this.incomingEdges = options.incomingEdges!;
        this.outgoingEdges = options.outgoingEdges!;
    }

    hasPosition(): boolean {
        return this.point !== null;
    }

    getAllEdges(): Set<IEdge> {
        return new Set([...this.outgoingEdges, ...this.incomingEdges]);
    }

    getNeighbours(): Set<IVertex> {
        const set: Set<IVertex> = new Set();
        for (const edge of this.outgoingEdges) {
            set.add(edge.to)
        }
        for (const edge of this.incomingEdges) {
            set.add(edge.from)
        }
        return set;
    }

    getReachableNeighbours(): Set<IVertex> {
        const set: Set<IVertex> = new Set();
        for (const edge of this.outgoingEdges) {
            set.add(edge.to)
        }
        return set;
    }

    getEdgeTo(to: IVertex): IEdge | undefined {
        return [...this.outgoingEdges].find(e => e.to.uuid === to.uuid)
    }

    addIncomingEdge(incoming: IEdge): boolean {
        const sizeBefore = this.incomingEdges.size
        this.incomingEdges.add(incoming)
        return sizeBefore < this.incomingEdges.size;
    }

    removeIncomingEdge(e: IEdge): boolean {
        return this.incomingEdges.delete(e)
    }

    addOutgoingEdge(outgoing: IEdge): boolean {
        const sizeBefore = this.outgoingEdges.size
        this.outgoingEdges.add(outgoing)
        return sizeBefore < this.outgoingEdges.size;
    }

    removeOutgoingEdge(e: IEdge): boolean {
        return this.outgoingEdges.delete(e)
    }

    deg(): number {
        return this.getNeighbours().size;
    }

    indeg(): number {
        return this.incomingEdges.size;
    }

    outdeg(): number {
        return this.outgoingEdges.size;
    }
}
