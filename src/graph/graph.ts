import {Edge, IEdge} from "./edge.ts";
import {IVertex, Vertex} from "./vertex.ts";
import {Comparator, DoublyLinkedList, IStack, LinkedStack, Ordering, PriorityQueue} from "../"

export type GraphProperties = {
    uuid?: string;
    title?: string;
    vertices?: Set<IVertex>;
    edges?: Set<IEdge>;
    directed?: boolean;
    mixed?: boolean;
    connected?: boolean;
    connectedComponentsCount?: number;
    strongConnectedComponentsCount?: number;
    cycleCount?: number;
    hasCycles?: boolean;
    hasNegativeCycles?: boolean;
}
export interface IGraph<V extends IVertex, E extends IEdge> extends GraphProperties {
    infer(): void;
    depthFirstSearch(startVertex: V, L: Array<V>): DoublyLinkedList<V>;
    breadthFirstSearch(startVertex: V): DoublyLinkedList<V>;
    shortestPath(from: V, to: V): Array<V>;
    kShortestPaths(from: V, to: V, k: number): Array<Array<V>>;
    minimalSpanningTree(): IGraph<V, E>;
    topologicalSorting(): Array<V>;
    parallelTopologicalSorting(): Array<Array<V>>;
    checkForCycles(): boolean;
    checkForNegativeCycles(): boolean;
    inferCycles(): Set<Array<V>> | null;
    connectedComponents(): Array<IGraph<V, E>>;
    strongConnectedComponents(): Array<IGraph<V, E>>;

    density(): number;
    order(): number;
    size(): number;

    isCyclic(): boolean;
    isAcyclic(): boolean;
    isTree(): boolean;
    isDirected(): boolean;
    isConnected(): boolean;
    isConnectedFrom(v: V): boolean;
    isStronglyConnectedFrom(v: V): boolean;
    isMixed(): boolean;
    isDense(): boolean;
    isSparse(): boolean;

    createEdge(from: V, to: V, title: string, directed: boolean, weight: number): E
    addEdge(e: E): boolean;
    removeEdge(e: E): boolean;

    addVertex(v: V): boolean;
    removeVertex(v: V): boolean;

    c(from: V, to: V): number;
}

export type SPPair<V extends IVertex> = {
    /**
     * Map of all Predecessors
     */
    p: Map<V, V>
    /**
     * Map of path costs to Vertex
     */
    k: Map<V, number>
}

export class AGraph<V extends IVertex, E extends IEdge> implements IGraph<V, E> {
    uuid: string;
    title: string;
    vertices: Set<V>;
    edges: Set<E>;
    directed = false;
    mixed = false;
    connected = false;
    connectedComponentsCount = 0;
    strongConnectedComponentsCount = 0;
    cycleCount = 0;
    hasCycles = false;
    hasNegativeCycles = false;
    comparator: Comparator<V>

    constructor(
        options: GraphProperties = <GraphProperties>{},
        _comparator: Comparator<V>,
        private vertexType: new(options?: any) => V,
        private edgeType: new(options?: any) => E,
    ) {
        this.comparator = _comparator
        options = {
            ...{
                uuid: crypto.randomUUID(),
                title: 'new graph',
                vertices: new Set(),
                edges: new Set(),
                connectedComponentsCount: 0,
                strongConnectedComponentsCount: 0,
                hasCycles: false,
                cycleCount: 0,
                hasNegativeCycles: false,
                isConnected: false,
                isMixes: false,
                isDirected: false
            },
            ...options
        }
        this.uuid = options.uuid as string
        this.title = options.title as string
        this.vertices = options.vertices as Set<V>
        this.edges = options.edges as Set<E>;
        this.connectedComponentsCount = options.connectedComponentsCount as number
        this.strongConnectedComponentsCount = options.strongConnectedComponentsCount as number
        this.hasCycles = options.hasCycles as boolean;
        this.cycleCount = options.cycleCount as number;
        this.hasNegativeCycles = options.hasNegativeCycles as boolean;
        this.connected = options.connected as boolean;
        this.mixed = options.mixed as boolean;
        this.directed = options.directed as boolean;
        this.infer()
    }

    infer(): void {
        this.isDirected()
        this.checkForCycles()
    }

    depthFirstSearch(startVertex: V, L?: V[]): DoublyLinkedList<V> {
        const stack: IStack<V> = new LinkedStack<V>()
        const neighbours: Map<V, Array<V>> = new Map<V, Array<V>>()
        const markedVertices: IStack<V> = new LinkedStack<V>()
        markedVertices.comparator = this.comparator

        stack.push(startVertex)
        markedVertices.push(startVertex)
        neighbours.set(startVertex, [...startVertex.getReachableNeighbours()] as V[])

        while (!stack.isEmpty()) {
            const topOfStack = stack.top()

            if (neighbours.get(topOfStack)!.length !== 0) {
                const v2 = neighbours.get(topOfStack)![0]
                const _neighbours = neighbours.get(topOfStack) as V[]
                _neighbours.splice(_neighbours.indexOf(v2), 1)

                if (!markedVertices.contains(v2)) {
                    stack.push(v2)
                    markedVertices.push(v2)
                    neighbours.set(v2, [...v2.getReachableNeighbours()] as V[])
                }
            } else {
                stack.pop()
                if (L != null) L.push(topOfStack)
            }
        }

        const list = new DoublyLinkedList<V>(markedVertices, true);
        list.comparator = this.comparator
        return list
    }

    breadthFirstSearch(startVertex: V) {
        const stack: IStack<V> = new LinkedStack<V>()
        const neighbours: Map<V, Set<V>> = new Map()
        const markedVertices: IStack<V> = new LinkedStack<V>()
        markedVertices.comparator = this.comparator

        markedVertices.push(startVertex)

        stack.push(startVertex);
        neighbours.set(startVertex, startVertex.getReachableNeighbours() as Set<V>)

        while (!stack.isEmpty()) {
            const v = stack.top()

            if (neighbours.get(v)!.size !== 0) {
                const v2 = [...neighbours.get(v)!][0]
                neighbours.get(v)!.delete(v2)

                if (!markedVertices.contains(v2)) {
                    stack.push(v2)
                    markedVertices.push(v2)
                    neighbours.set(v2, v2.getReachableNeighbours() as Set<V>)
                }
            } else {
                stack.pop()
            }
        }

        return new DoublyLinkedList<V>(markedVertices, true);
    }

    /**
     * shortest path (Moore-Bellman-Ford)
     *
     * @param from
     * @param to
     */
    shortestPath(from: V, to: V): Array<V> {
        const {p} = this.shortestPathMooreBellmanFord(from)
        return this.constructShortestPath(from, to, p)
    }

    /**
     * Yen's k-shortest-paths
     *
     * @param from
     * @param to
     * @param K
     */
    kShortestPaths(from: V, to: V, K: number): Array<Array<V>> {
        if (K <= 0) throw new Error("count of wanted shortest paths must be greater then 0")

        const A: Array<Array<V>> = []
        const B: Array<Array<V>> = []
        const removedVertices: Array<V> = []
        const removedEdges: Map<E, number> = new Map()
        const shortestPath = this.shortestPath(from, to)

        A.push(shortestPath)

        for (let k = 1; k < K; k++) {
            for (let i = 0; i < A[k-1].length - 2; i++) {
                const spurNode = A[k-1][i]
                const rootPath = A[k-1].slice(0, i+1)

                // remove edges
                for (let p of A) {
                    if (JSON.stringify(rootPath) === JSON.stringify(p.slice(0, i+1))) {
                        const v1 = p[i]
                        const v2 = p[i+1]
                        const edgeTo = v1.getEdgeTo(v2)!
                        const weight = edgeTo.weight!
                        edgeTo.weight = Number.MAX_VALUE
                        removedEdges.set(edgeTo as E, weight)
                    }
                }

                // remove vertices
                for (let rootPathNode of rootPath) {
                    if (rootPathNode.uuid === spurNode.uuid) continue
                    this.vertices.delete(rootPathNode)
                    removedVertices.push(rootPathNode)
                }
                const spurPath = this.shortestPath(spurNode, to)
                if (spurPath.length > 0) {
                    rootPath.push(...spurPath.slice(1, spurPath.length))
                }
                if (rootPath.length > 1 && !B.includes(rootPath)) {
                    B.push(rootPath)
                }

                // restore edge weights and vertices
                removedVertices.forEach(v => this.vertices.add(v))
                for (let entry of removedEdges.entries()) {
                    const [e, weight] = entry
                    e.weight = weight
                }
                removedVertices.splice(0, removedVertices.length)
                removedEdges.clear()
            }

            if (B.length === 0) break

            B.sort((p1, p2) => this.sumUpPathCosts(p1) - this.sumUpPathCosts(p2))

            A.push(B[0])
            B.shift()
        }

        return A
    }

    /**
     * Minimal spanning tree algorithmen (Kruskal) for undirected, connected and weighted graphs
     */
    minimalSpanningTree(): IGraph<V, E> {
        if (this.directed || !this.connected) throw new Error("graph must be undirected, connected and weighted")
        const _edges = new Set<E>()
        const ignores = new Set<V>()
        const comparator = (e1: E, e2: E) => {
            if (e1.weight! - e2.weight! === 0) return Ordering.EQ
            if (e1.weight! - e2.weight! < 0) return Ordering.LT
            return Ordering.GT
        }
        const queue = new PriorityQueue<E>(comparator, this.getDeduplicatedEdges() as E[])

        let totalCost = 0
        while (!queue.isEmpty()) {
            const edge = queue.dequeue()
            if (!(ignores.has(edge.to as V)) && ignores.has(edge.from as V)) {
                totalCost += edge.weight || 0
                _edges.add(edge)
                ignores.add(edge.from as V)
                ignores.add(edge.to as V)
            }
        }

        return new AGraph<V, E>({
            vertices: this.vertices,
            edges: _edges
        }, this.comparator, this.vertexType, this.edgeType)
    }

    topologicalSorting(): Array<V> {
        if (!this.directed || this.hasCycles) {
            throw new Error("graph must be directed and acyclic")
        }
        const sorting: Array<V> = []
        const indeg: Map<V, number> = new Map()
        for (let v of this.vertices) {
            indeg.set(v, 0)
        }
        for (let v of this.vertices) {
            const rn = v.getReachableNeighbours();
            for (let w of rn) {
                indeg.set(w as V, indeg.get(w as V)! + 1)
            }
        }
        const Q: Set<V> = new Set()
        for (let v of this.vertices) {
            if (indeg.get(v) == 0) {
                Q.add(v)
            }
        }

        while (!(Q.size === 0)) {
            const v = [...Q][0]
            Q.delete(v)
            sorting.push(v)
            const rn = v.getReachableNeighbours()
            for (let w of rn) {
                indeg.set(w as V, indeg.get(w as V)! - 1)
                if (indeg.get(w as V) === 0) {
                    Q.add(w as V)
                }
            }
        }

        return sorting
    }

    /**
     * With this variant of the topological sorting it's additionally possible
     * to determine which vertices can be processed simulations (see "parallel topological sorting" test)
     */
    parallelTopologicalSorting(): Array<Array<V>> {
        if (!this.directed || this.hasCycles) {
            throw new Error("graph must be directed and acyclic")
        }

        const backup = new Set(this.vertices)
        const result: Array<Array<V>> = []
        for (let i = 0; this.vertices.size > 0; i++) {
            result.push([])
            const cloned = [...this.vertices]

            const toRemove: Array<E> = []
            for (let j = 0; j < cloned.length; j++) {
                if (cloned[j].indeg() === 0) {
                    result[i].push(cloned[j])
                    this.vertices.delete(cloned[j])

                    cloned[j].outgoingEdges!.forEach(e => toRemove.push(e as E))
                }
            }
            for (let e of toRemove) {
                e.to.removeIncomingEdge(e)
            }
        }
        this.vertices = backup

        return result
    }

    checkForCycles(): boolean {
        if (this.directed) {
            this.hasCycles = [...this.vertices].filter(v => this.containsCyclesFrom(v)).length > 0

            if (this.hasCycles) this.inferCycles()
        } else {
            const p = this.strongConnectedComponentCount()
            const m = this.edges.size;

            this.hasCycles = !(m + p === this.vertices.size)
        }

        return this.hasCycles;
    }

    checkForNegativeCycles(): boolean {
        this.hasNegativeCycles = false

        for (let v of this.vertices) {
            if (this.checkForNegativeCyclesFrom(v)) break;
        }

        return this.hasNegativeCycles
    }

    protected getNeighbours(neighbours: Map<V, Array<V>>, currentVertex: V) {
        if (!neighbours.has(currentVertex)) {
            const _neighbours = [...currentVertex.getReachableNeighbours()] as Array<V>
            neighbours.set(currentVertex, _neighbours as Array<V>)
            return _neighbours
        }
        return neighbours.get(currentVertex) as Array<V>
    }

    inferCycles(): Set<Array<V>> {
        let neighbours: Map<V, Array<V>> = new Map()
        const cycles: Set<Array<V>> = new Set()
        let markedVertices: Array<V> = []

        if (!this.directed) {
            // @TODO nicht fertig
            for (let vertex of this.vertices) {
                const stack: Array<V> = []
                stack.splice(0, stack.length)
                stack.push(vertex)
                const startVertex: V = vertex
                const markedVertices: Set<V> = new Set([startVertex])
                let cycleFound = false

                for (let iterCount = 0; stack.length !== 0; iterCount++) {
                    const currentVertex = stack[stack.length - 1]
                    let _neighbours: Array<V> = this.getNeighbours(neighbours, currentVertex)

                    let neighbour: V | null = null
                    for (let neighbour1 of _neighbours) {
                        if (iterCount > 1 && startVertex.uuid === neighbour1.uuid) {
                            cycleFound = true
                            break
                        }
                        if (!markedVertices.has(neighbour1)) {
                            neighbour = neighbour1
                            break
                        }
                    }
                    if (cycleFound) break
                    if (neighbour) {
                        stack.push(neighbour)
                        markedVertices.add(neighbour)
                    } else {
                        stack.pop()
                        iterCount -= 2;
                    }
                }

                if (cycleFound && !isCycleAlreadyTracked(stack, cycles)) {
                    cycles.add(stack)
                }
                /*const dfs = this.depthFirstSearch(vertex)*/
            }

            return cycles
        }

        function isCycleAlreadyTracked(stack: V[], cylces: Set<V[]>): boolean {
            const cyclesWithSameLength = [...cylces].filter(cycle => cycle.length === stack.length)
            for (let cycle of cyclesWithSameLength) {
                const contains: boolean[] = []
                for (let v of cycle) {
                    contains.push(stack.includes(v))
                }
                if (contains.filter(Boolean).length === stack.length) return true
            }

            return false
        }

        const stack: V[] = []

        for (const s of this.vertices) {
            stack.push(s)
            markedVertices.push(s)
            neighbours.set(s, [...s.getReachableNeighbours()] as V[])

            while (stack.length !== 0) {
                const vertex = stack[stack.length - 1]

                if (neighbours.get(vertex)!.length !== 0) {
                    const v2 = [...neighbours.get(vertex)!][0]
                    const v2Index = neighbours.get(vertex)!.indexOf(v2)
                    neighbours.get(vertex)!.splice(v2Index, 1)

                    if (!markedVertices.includes(v2)) {
                        stack.push(v2)
                        markedVertices.push(v2)
                        neighbours.set(v2, [...v2.getReachableNeighbours()] as V[])
                    }


                    if (stack[0].uuid === v2.uuid) {
                        cycles.add(stack)
                    }
                } else {
                    stack.shift()
                }
            }

            markedVertices = []
            neighbours = new Map()
        }

        this.cycleCount = cycles.size
        this.hasCycles = this.cycleCount > 0

        return cycles
    }

    connectedComponents(): Array<IGraph<V, E>> {
        const connectedComponents: Array<IGraph<V, E>> = []
        if (this.directed) {
            for (let v of this.vertices) {
                const dfs = this.depthFirstSearch(v)
                const edges = new Set<E>()
                for (const _v of dfs) {
                    _v.outgoingEdges?.forEach(e => edges.add(e as E))
                }
                connectedComponents.push(new AGraph<V, E>({
                    vertices: new Set(dfs),
                    edges
                }, this.comparator, this.vertexType, this.edgeType))
            }

            this.connectedComponentsCount = connectedComponents.length

            return connectedComponents
        }

        const visitedVertices = new Set<V>()
        const vertices = new Set<V>()
        const edges = new Set<E>()

        for (let v of this.vertices) {
            if (!visitedVertices.has(v)) {
                for (const _v of this.depthFirstSearch(v)) {
                    vertices.add(_v)
                }
                vertices.forEach(_v => visitedVertices.add(_v))

                vertices.forEach(w => {
                    w.outgoingEdges?.forEach(e => edges.add(e as E))
                })

                connectedComponents.push(new AGraph<V, E>({
                    vertices, edges
                }, this.comparator, this.vertexType, this.edgeType))

                vertices.clear()
                edges.clear()
            }
        }

        this.connectedComponentsCount = connectedComponents.length

        return connectedComponents;
    }

    strongConnectedComponents(): Array<IGraph<V, E>> {
        const components: Set<IGraph<V, E>> = new Set<IGraph<V, E>>()
        const cache = new Map()

        for (let a of this.vertices) {
            if (a.outgoingEdges!.size === 0 || a.incomingEdges!.size === 0) {
                components.add(new AGraph<V, E>({
                    vertices: new Set([a]),
                    edges: new Set()
                }, this.comparator, this.vertexType, this.edgeType))
                continue;
            }

            for (let b of this.vertices) {
                if (a.uuid === b.uuid) continue

                let dfsv: DoublyLinkedList<V>, dfsw: DoublyLinkedList<V>;
                if (cache.has(a)) {
                    dfsv = cache.get(a)
                } else {
                    dfsv = this.depthFirstSearch(a)
                    cache.set(a, dfsv)
                }
                if (cache.has(b)) {
                    dfsw = cache.get(b)
                } else {
                    dfsw = this.depthFirstSearch(b)
                    cache.set(b, dfsw)
                }

                if (dfsw.contains(a) && dfsv.contains(b)) {
                    let first: IGraph<V, E> | null = null
                    for (let component of components) {
                        if (component.vertices?.has(a))
                            first = component
                    }

                    if (first) {
                        first.vertices?.add(a)
                        first.vertices?.add(b)
                    } else {
                        components.add(new AGraph<V, E>({
                            vertices: new Set([a, b]),
                            edges: new Set()
                        }, this.comparator, this.vertexType, this.edgeType))
                    }
                }
            }
        }

        // add edges
        for (let cc of components) {
            for (let v of cc.vertices!) {
                for (let e of v.outgoingEdges!) {
                    if (cc.vertices?.has(e.to)) {
                        cc.edges?.add(e)
                    }
                }
            }
        }

        return [...components]
    }

    strongConnectedComponentCount(): number {
        const stack: V[] = []
        let count = 0

        for (const v of this.vertices) {
            if (!stack.includes(v)) {
                this.depthFirstSearch(v, stack)
                count++;
            }
        }

        return count;
    }

    density(): number {
        const order = this.order()
        const density = 2.0 * this.size() / (order * (order - 1));
        if (this.directed) {
            return (1 / 2.0) * density;
        } else {
            return density;
        }
    }

    order(): number {
        return this.vertices.size
    }

    size(): number {
        return this.edges.size
    }

    isCyclic(): boolean {
        return this.hasCycles;
    }

    isAcyclic(): boolean {
        return !this.hasCycles;
    }

    isTree(): boolean {
        if (!this.directed)
            return this.connected && !this.hasCycles;

        const roots = [...this.vertices].filter(v => v.incomingEdges!.size === 0)

        if (roots.length !== 1) {
            return false;
        }

        for (const v of this.vertices) {
            if (v.incomingEdges!.size > 1)
                return false;
        }

        return true;
    }

    isDirected(): boolean {
        let lastValue = false;
        let isFirst = true

        for (let edge of this.edges) {
            if (isFirst) {
                isFirst = false
                this.directed = lastValue = edge.isDirected()
            } else if (edge.isDirected() != lastValue) {
                this.mixed = true;
                this.directed = false;
                break;
            }
        }

        return this.directed
    }

    isConnected(): boolean {
        if (this.vertices.size < 1) return false;
        if (this.vertices.size === 1) return true;

        this.isDirected()
        if (this.mixed) throw Error("graph must be not mixed")

        if (this.directed) {
            return [...this.vertices]
                .map(this.isConnectedFrom.bind(this))
                .every(v => v)
        }

        let last: DoublyLinkedList<V> | null = null

        for (let currentVertex of this.vertices) {
            const reachableNeighbours = this.depthFirstSearch(currentVertex)

            if (last === null) last = reachableNeighbours
            else if (
                last.size !== reachableNeighbours.size
                || this.verticesArrayEquals([...last], [...reachableNeighbours])
            ) {
                return false;
            }
        }

        return true;
    }

    isConnectedFrom(v: V): boolean {
        if (!this.directed) {
            throw new Error("graph must be directed")
        }
        const cloned = new Set(this.vertices)
        cloned.delete(v)
        const reachableVertices = this.depthFirstSearch(v)

        for (let v2 of cloned) {
            if (!reachableVertices.contains(v2)) {
                return false
            }
        }

        return true
    }

    isStronglyConnectedFrom(v: V): boolean {
        if (!this.directed) {
            throw new Error("graph must be directed")
        }

        const cloned = new Set(this.vertices)
        cloned.delete(v)
        const reachableVertices = this.depthFirstSearch(v)
        reachableVertices.comparator = this.comparator
        for (let v2 of cloned) {
            if (reachableVertices.contains(v2)) {
                const reachableVerticesV2 = this.depthFirstSearch(v2)
                if (!reachableVerticesV2.contains(v)) {
                    return false
                }
            }
        }

        return true
    }

    isMixed(): boolean {
        this.isDirected()
        return this.mixed;
    }

    isDense(): boolean {
        return this.density() <= 0.5;
    }

    isSparse(): boolean {
        return this.density() > 0.5;
    }

    createEdge(from: V, to: V, title = 'new edge', directed = true, weight = 0): E {
        const e = this.createSingleEdge(title, directed, weight, from, to)
        this.addEdge(e)

        if (!directed) {
            const r = this.createSingleEdge(title + " r", directed, weight, to, from)
            this.addEdge(r)
        }

        return e
    }

    addEdge(e: E): boolean {
        this.edges.add(e)
        return true
    }

    removeEdge(e: E): boolean {
        const arr = [...this.edges]
        const sizeBefore = arr.length
        const index = arr.indexOf(e)
        if (index >= 0) {
            arr.splice(index, 1)
            this.edges = new Set(arr)
        }

        return sizeBefore != arr.length;
    }

    addVertex(v: V): boolean {
        this.vertices.add(v);
        return true
    }

    removeVertex(v: V): boolean {
        const arr = [...this.vertices]
        const sizeBefore = arr.length
        const index = arr.indexOf(v)
        if (index >= 0) {
            arr.splice(index, 1)
            this.vertices = new Set(arr)
        }

        return sizeBefore != arr.length;
    }

    /**
     * Weight function for calculating the weight of an edge.
     *
     * Override, for custom weight function
     *
     * @param from
     * @param to
     */
    c(from: V, to: V): number {
        const e = from.getEdgeTo(to)
        return e ? e.weight! : 0
    }

    protected verticesArrayEquals(p1: Array<V>, p2: Array<V>): boolean {
        if (p1.length !== p2.length) return false
        const uuidsP1 = p1.map(v => v.uuid)
        const uuidsP2 = p2.map(v => v.uuid)
        uuidsP1.sort()
        uuidsP2.sort()
        for (let i = 0; i < uuidsP1.length; i++) {
            if (uuidsP1[i] !== uuidsP2[i]) return false
        }

        return true
    }

    protected sumUpPathCosts(p: Array<V>): number {
        let sum = 0
        for (let i = 0; i < p.length - 1; i++) {
            const first = p[i]
            const second = p[i+1]

            sum += [...first.outgoingEdges!].find(e => e.to.uuid === second.uuid)!.weight!
        }

        return sum
    }

    protected createSingleEdge(title: string, directed: boolean, weight: number, from: V, to: V) {
        const _e = new this.edgeType()
        _e.from = from
        _e.to = to
        _e.title = title
        _e.directed = directed
        _e.weight = weight

        from.addOutgoingEdge(_e)
        to.addIncomingEdge(_e)
        return _e;
    }

    protected getDeduplicatedEdges(): IEdge[] {
        if (this.directed) throw new Error("graph must be undirected")

        const edges: IEdge[] = []
        const ignores: IEdge[] = []
        for (let edge of this.edges) {
            const from = edge.from;
            const to = edge.to;

            if (!ignores.includes(edge)) {
                edges.push(edge)
            }

            const filtered = [...to.outgoingEdges!].filter(e => e.to.uuid === from.uuid)
            if (filtered.length > 0) {
                const first = filtered[0]
                ignores.push(first)
            }
        }

        return edges;
    }

    protected constructShortestPath(from: V, to: V, predecessors: Map<V, V>): Array<V> {
        const shortestPath: Array<V> = []

        let p = predecessors.get(to)!
        if (!p) return shortestPath

        shortestPath.unshift(to)
        shortestPath.unshift(p)

        while (!(p.uuid === from.uuid)) {
            const vertex = predecessors.get(p)!
            if (
                predecessors.get(vertex) !== null
                && predecessors.has(vertex)
                && predecessors.get(vertex)!.uuid === p.uuid
            ) {
                break; // circle contained, so stop immediately
            }
            p = vertex
            shortestPath.unshift(p)
        }

        return shortestPath
    }

    protected shortestPathMooreBellmanFord(from: V): SPPair<V> {
        const V: Set<V> = new Set(this.vertices)
        const k: Map<V, number> = new Map()
        const p: Map<V, V> = new Map()
        V.delete(from)

        for (let v of V) {
            k.set(v, 200000)
        }
        k.set(from, 0)
        V.add(from)

        for (let i = 1; i < V.size - 1; i++) {
            for (let e of this.edges) {
                const c = this.c(e.from as V, e.to as V)
                const c1 = k.get(e.from as V)! + c

                if (c1 < k.get(e.to as V)!) {
                    k.set(e.to as V, c1)
                    p.set(e.to as V, e.from as V)
                }
            }
        }

        return { p, k }
    }

    protected containsCyclesFrom(v: V): boolean {
        const stack = []
        const neighbours: Map<V, Set<V>> = new Map()

        stack.push(v)
        neighbours.set(v, v.getReachableNeighbours() as Set<V>)

        while (stack.length !== 0) {
            const topOfStack = stack[stack.length - 1]

            if (neighbours.get(topOfStack)!.size !== 0) {
                const v2 = [...neighbours.get(topOfStack)!][0]
                neighbours.get(topOfStack)!.delete(v2)

                if (v2.getReachableNeighbours().has(v)) {
                    return true
                }
            } else {
                stack.pop()
            }
        }

        return false;
    }

    protected checkForNegativeCyclesFrom(s: V): boolean {
        this.hasNegativeCycles = false
        const {k} = this.shortestPathMooreBellmanFord(s)

        for (let e of this.edges) {
            const c = this.c(e.from as V, e.to as V)
            const c1 = k.get(e.from as V)! + c

            if (c1 < k.get(e.to as V)!) {
                return this.hasNegativeCycles = true
            }
        }

        return false
    }
}

export class Graph extends AGraph<Vertex, Edge> {
    constructor(props: GraphProperties, comparator: Comparator<Vertex>) {
        super(props, comparator, Vertex, Edge);
    }
}
