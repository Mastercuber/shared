import { IVertex } from './vertex.ts'

export type VerticesPair<V extends IVertex> = [from: V, to: V]

export type EdgeProperties = {
    uuid?: string;
    title?: string;
    from: IVertex;
    to: IVertex;
    directed?: boolean;
    weight?: number;
}

export interface IEdge extends EdgeProperties {
    isDirected(): boolean;
    getReverseEdge(): IEdge;
    getVertices(): VerticesPair<IVertex>
}

export class Edge implements IEdge {
  uuid: string
  title: string
  from: IVertex
  to: IVertex
  directed = false
  weight: number

  constructor(options?: EdgeProperties) {
    options = {
      ...{
        uuid: crypto.randomUUID(),
        title: 'new edge',
        weight: 0,
        directed: true
      },
      ...options
    } as EdgeProperties
    this.title = options.title!
    this.from = options.from
    if (this.from) this.from.addOutgoingEdge(this)
    this.to = options.to
    if (this.to) this.to.addIncomingEdge(this)
    this.directed = options.directed!
    this.uuid = options.uuid!
    this.weight = options.weight!
  }

  isDirected(): boolean {
    return this.directed
  }


  /**
     * @returns the reverse edge, if existing
     */
  getReverseEdge(): IEdge {
    return [...this.to.outgoingEdges!]
      .find(e => e.to.uuid === this.from.uuid)!
  }

  /**
     * returns both ends of the edge [from, to]
     */
  getVertices(): VerticesPair<IVertex> {
    return [this.from, this.to]
  }

}
