import { Edge, IEdge } from './edge.ts'
import { IVertex, Vertex } from './vertex.ts'
import { Comparator, DoublyLinkedList, IStack, LinkedStack, Ordering, Point, PriorityQueue } from '../'

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
    depthFirstSearch(startVertex: V, L?: IStack<V>): DoublyLinkedList<V>;
    breadthFirstSearch(startVertex: V): DoublyLinkedList<V>;
    shortestPath(from: V, to: V): DoublyLinkedList<V>;
    kShortestPaths(from: V, to: V, k: number): DoublyLinkedList<DoublyLinkedList<V>>;
    minimalSpanningTree(): IGraph<V, E>;
    topologicalSorting(): DoublyLinkedList<V>;
    parallelTopologicalSorting(): DoublyLinkedList<DoublyLinkedList<V>>;
    checkForCycles(): boolean;
    checkForNegativeCycles(): boolean;
    inferCycles(): Set<Array<V>> | null;
    connectedComponents(): DoublyLinkedList<IGraph<V, E>>;
    strongConnectedComponents(): Array<IGraph<V, E>>;

    density(): number;
    order(): number;
    size(): number;

    isCyclic(): boolean;
    isAcyclic(): boolean;
    isTree(): boolean;
    isForest(): boolean;
    isDirected(): boolean;
    isConnected(): boolean;
    isConnectedFrom(v: V): boolean;
    isStronglyConnectedFrom(v: V): boolean;
    isMixed(): boolean;
    isDense(): boolean;
    isSparse(): boolean;

    createEdge(from: V, to: V, title?: string, directed?: boolean, weight?: number): E
    addEdge(e: E): boolean;
    removeEdge(e: E): boolean;

    createVertex(title?: string, point?: Point, object?: any): V
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
  uuid: string
  title: string
  vertices: Set<V>
  edges: Set<E>
  directed = false
  mixed = false
  connected = false
  connectedComponentsCount = 0
  strongConnectedComponentsCount = 0
  cycleCount = 0
  hasCycles = false
  hasNegativeCycles = false
  comparator: Comparator<V>

  constructor(
    options: GraphProperties = <GraphProperties>{},
    _comparator: Comparator<V>,
    private vertexType: new(options?: any) => V,
    private edgeType: new(options?: any) => E,
  ) {
    this.comparator = _comparator
    options = {
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
      isDirected: false,
      ...options
    }
    this.uuid = options.uuid as string
    this.title = options.title as string
    this.vertices = options.vertices as Set<V>
    this.edges = options.edges as Set<E>
    this.connectedComponentsCount = options.connectedComponentsCount as number
    this.strongConnectedComponentsCount = options.strongConnectedComponentsCount as number
    this.hasCycles = options.hasCycles as boolean
    this.cycleCount = options.cycleCount as number
    this.hasNegativeCycles = options.hasNegativeCycles as boolean
    this.connected = options.connected as boolean
    this.mixed = options.mixed as boolean
    this.directed = options.directed as boolean
    this.infer()
  }

  infer(): void {
    this.isDirected()
    this.checkForCycles()
  }

  depthFirstSearch(startVertex: V, L?: IStack<V>): DoublyLinkedList<V> {
    const stack: IStack<V> = new LinkedStack<V>()
    const neighbours: Map<V, DoublyLinkedList<V>> = new Map<V, DoublyLinkedList<V>>()
    const markedVertices: IStack<V> = new LinkedStack<V>()
    markedVertices.comparator = this.comparator

    stack.push(startVertex)
    markedVertices.push(startVertex)
    neighbours.set(startVertex, new DoublyLinkedList<V>(startVertex.getReachableNeighbours() as Set<V>))

    while (!stack.isEmpty()) {
      const topOfStack = stack.top()

      if (neighbours.get(topOfStack)!.size !== 0) {
        const v2 = neighbours.get(topOfStack)!.get(0)
        const _neighbours = neighbours.get(topOfStack)!
        _neighbours.comparator = this.comparator
        _neighbours.remove(_neighbours.indexOf(v2))

        if (!markedVertices.contains(v2)) {
          stack.push(v2)
          markedVertices.push(v2)
          neighbours.set(v2, new DoublyLinkedList<V>(v2.getReachableNeighbours() as Set<V>))
        }
      } else {
        stack.pop()
        if (L != null) L.push(topOfStack)
      }
    }

    const list = new DoublyLinkedList<V>(markedVertices, true)
    list.comparator = this.comparator
    return list
  }

  breadthFirstSearch(startVertex: V) {
    const stack: IStack<V> = new LinkedStack<V>()
    const neighbours: Map<V, Set<V>> = new Map()
    const markedVertices: IStack<V> = new LinkedStack<V>()
    markedVertices.comparator = this.comparator

    markedVertices.push(startVertex)

    stack.push(startVertex)
    neighbours.set(startVertex, startVertex.getReachableNeighbours() as Set<V>)

    while (!stack.isEmpty()) {
      const v = stack.top()

      if (neighbours.get(v)!.size !== 0) {
        const l = new DoublyLinkedList<V>(neighbours.get(v))
        const v2 = l.get(0)
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

    return new DoublyLinkedList<V>(markedVertices, true)
  }

  /**
     * shortest path (Moore-Bellman-Ford)
     *
     * @param from
     * @param to
     */
  shortestPath(from: V, to: V): DoublyLinkedList<V> {
    const { p } = this.shortestPathMooreBellmanFord(from)
    return this.constructShortestPath(from, to, p)
  }

  /**
     * Yen's k-shortest-paths
     *
     * @param from
     * @param to
     * @param K
     */
  kShortestPaths(from: V, to: V, K: number): DoublyLinkedList<DoublyLinkedList<V>> {
    if (K <= 0) throw new Error('count of wanted shortest paths must be greater then 0')
    const comparator = (l1: DoublyLinkedList<V>, l2: DoublyLinkedList<V>): Ordering => {
      if (l1.size < l2.size) return Ordering.LT
      if (l1.size > l2.size) return Ordering.GT

      let ordering = Ordering.EQ
      for (let i = 0; i < l1.size; i++) {
        const _ordering = this.comparator(l1.get(i), l2.get(i))
        if (_ordering !== Ordering.EQ) {
          ordering = _ordering
          break
        }
      }

      return ordering
    }
    const A: DoublyLinkedList<DoublyLinkedList<V>> = new DoublyLinkedList<DoublyLinkedList<V>>()
    const B: DoublyLinkedList<DoublyLinkedList<V>> = new DoublyLinkedList<DoublyLinkedList<V>>()
    A.comparator = comparator
    B.comparator = comparator
    const removedVertices: DoublyLinkedList<V> = new DoublyLinkedList<V>()
    const removedEdges: Map<E, number> = new Map()
    const shortestPath = this.shortestPath(from, to)

    A.add(shortestPath)

    for (let k = 1; k < K; k++) {
      for (let i = 0; i < A.get(k - 1).size - 2; i++) {
        const spurNode = A.get(k - 1).get(i)
        const rootPath = A.get(k - 1).slice(0, i)
        rootPath.comparator = this.comparator

        // remove edges
        for (const p of A) {
          if (rootPath.equals(p.slice(0, i))) {
            const v1 = p.get(i)
            const v2 = p.get(i + 1)
            const edgeTo = v1.getEdgeTo(v2)!
            const weight = edgeTo.weight!
            edgeTo.weight = Number.MAX_VALUE
            removedEdges.set(edgeTo as E, weight)
          }
        }

        // remove vertices
        for (const rootPathNode of rootPath) {
          if (rootPathNode.uuid === spurNode.uuid) continue
          this.vertices.delete(rootPathNode)
          removedVertices.add(rootPathNode)
        }
        const spurPath = this.shortestPath(spurNode, to)
        if (spurPath.size > 0) {
          rootPath.addAll(spurPath.slice(1, spurPath.size - 1))
        }
        if (rootPath.size > 1 && !B.includes(rootPath)) {
          B.add(rootPath)
        }

        // restore edge weights and vertices
        for (const removedVertex of removedVertices) {
          this.vertices.add(removedVertex)
        }

        for (const entry of removedEdges.entries()) {
          const [e, weight] = entry
          e.weight = weight
        }
        removedVertices.splice(0, removedVertices.size)
        removedEdges.clear()
      }

      if (B.size === 0) break

      B.sort((p1, p2) => this.sumUpPathCosts(p1) - this.sumUpPathCosts(p2))

      A.add(B.get(0))
      B.removeFirst()
    }

    return A
  }

  /**
     * Minimal spanning tree algorithmen (Kruskal) for undirected, connected and weighted graphs
     */
  minimalSpanningTree(): IGraph<V, E> {
    if (this.directed || !this.connected) throw new Error('graph must be undirected, connected and weighted')
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
      if (!ignores.has(edge.to as V) && ignores.has(edge.from as V)) {
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

  topologicalSorting(): DoublyLinkedList<V> {
    if (!this.directed || this.hasCycles) {
      throw new Error('graph must be directed and acyclic')
    }
    const sorting: DoublyLinkedList<V> = new DoublyLinkedList<V>()
    const indeg: Map<V, number> = new Map()
    for (const v of this.vertices) {
      indeg.set(v, 0)
    }
    for (const v of this.vertices) {
      const rn = v.getReachableNeighbours()
      for (const w of rn) {
        indeg.set(w as V, indeg.get(w as V)! + 1)
      }
    }
    const Q: Set<V> = new Set()
    for (const v of this.vertices) {
      if (indeg.get(v) == 0) {
        Q.add(v)
      }
    }

    while (!(Q.size === 0)) {
      const v = new DoublyLinkedList(Q).get(0)
      Q.delete(v)
      sorting.add(v)
      const rn = v.getReachableNeighbours()
      for (const w of rn) {
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
  parallelTopologicalSorting(): DoublyLinkedList<DoublyLinkedList<V>> {
    if (!this.directed || this.hasCycles) {
      throw new Error('graph must be directed and acyclic')
    }

    const backup = new Set(this.vertices)
    const result: DoublyLinkedList<DoublyLinkedList<V>> = new DoublyLinkedList<DoublyLinkedList<V>>()
    for (let i = 0; this.vertices.size > 0; i++) {
      result.add(new DoublyLinkedList<V>())
      const cloned = new DoublyLinkedList<V>(this.vertices)

      const toRemove: DoublyLinkedList<E> = new DoublyLinkedList<E>()
      for (let j = 0; j < cloned.size; j++) {
        if (cloned.get(j).indeg() === 0) {
          result.get(i).add(cloned.get(j))
          this.vertices.delete(cloned.get(j))

          cloned.get(j).outgoingEdges!.forEach(e => toRemove.add(e as E))
        }
      }
      for (const e of toRemove) {
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
      const m = this.edges.size

      this.hasCycles = !(m + p === this.vertices.size)
    }

    return this.hasCycles
  }

  checkForNegativeCycles(): boolean {
    this.hasNegativeCycles = false

    for (const v of this.vertices) {
      if (this.checkForNegativeCyclesFrom(v)) break
    }

    return this.hasNegativeCycles
  }

  protected getNeighbours(neighbours: Map<V, Array<V>>, currentVertex: V) {
    if (!neighbours.has(currentVertex)) {
      const _neighbours = [...currentVertex.getReachableNeighbours()] as Array<V>
      neighbours.set(currentVertex, _neighbours )
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
      for (const vertex of this.vertices) {
        const stack: Array<V> = []
        stack.splice(0, stack.length)
        stack.push(vertex)
        const startVertex: V = vertex
        const markedVertices: Set<V> = new Set([startVertex])
        let cycleFound = false

        for (let iterCount = 0; stack.length !== 0; iterCount++) {
          const currentVertex = stack[stack.length - 1]
          const _neighbours: Array<V> = this.getNeighbours(neighbours, currentVertex)

          let neighbour: V | null = null
          for (const neighbour1 of _neighbours) {
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
            iterCount -= 2
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
      for (const cycle of cyclesWithSameLength) {
        const contains: boolean[] = []
        for (const v of cycle) {
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

  connectedComponents(): DoublyLinkedList<IGraph<V, E>> {
    const connectedComponents: DoublyLinkedList<IGraph<V, E>> = new DoublyLinkedList<IGraph<V, E>>()
    if (this.directed) {
      for (const v of this.vertices) {
        const dfs = this.depthFirstSearch(v)
        const edges = new Set<E>()
        for (const _v of dfs) {
          _v.outgoingEdges?.forEach(e => edges.add(e as E))
        }
        connectedComponents.add(new AGraph<V, E>({
          vertices: new Set(dfs),
          edges
        }, this.comparator, this.vertexType, this.edgeType))
      }

      this.connectedComponentsCount = connectedComponents.size

      return connectedComponents
    }

    const visitedVertices = new Set<V>()
    const vertices = new Set<V>()
    const edges = new Set<E>()

    for (const v of this.vertices) {
      if (!visitedVertices.has(v)) {
        for (const _v of this.depthFirstSearch(v)) {
          vertices.add(_v)
        }
        vertices.forEach(_v => visitedVertices.add(_v))

        vertices.forEach(w => {
          w.outgoingEdges?.forEach(e => edges.add(e as E))
        })

        connectedComponents.add(new AGraph<V, E>({
          vertices,
          edges
        }, this.comparator, this.vertexType, this.edgeType))

        vertices.clear()
        edges.clear()
      }
    }

    this.connectedComponentsCount = connectedComponents.size

    return connectedComponents
  }

  strongConnectedComponents(): Array<IGraph<V, E>> {
    const components: Set<IGraph<V, E>> = new Set<IGraph<V, E>>()
    const cache = new Map()

    for (const a of this.vertices) {
      if (a.outgoingEdges!.size === 0 || a.incomingEdges!.size === 0) {
        components.add(new AGraph<V, E>({
          vertices: new Set([a]),
          edges: new Set()
        }, this.comparator, this.vertexType, this.edgeType))
        continue
      }

      for (const b of this.vertices) {
        if (a.uuid === b.uuid) continue

        let dfsv: DoublyLinkedList<V>, dfsw: DoublyLinkedList<V>
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

        if (dfsw.includes(a) && dfsv.includes(b)) {
          let first: IGraph<V, E> | null = null
          for (const component of components) {
            if (component.vertices?.has(a)) first = component
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
    for (const cc of components) {
      for (const v of cc.vertices!) {
        for (const e of v.outgoingEdges!) {
          if (cc.vertices?.has(e.to)) {
            cc.edges?.add(e)
          }
        }
      }
    }

    return [...components]
  }

  strongConnectedComponentCount(): number {
    const stack: IStack<V> = new LinkedStack<V>()
    stack.comparator = this.comparator
    let count = 0

    for (const v of this.vertices) {
      if (!stack.contains(v)) {
        this.depthFirstSearch(v, stack)
        count++
      }
    }

    return count
  }

  density(): number {
    const order = this.order()
    const density = 2.0 * this.size() / (order * (order - 1))
    if (this.directed) {
      return 1 / 2.0 * density
    }
    return density

  }

  order(): number {
    return this.vertices.size
  }

  size(): number {
    return this.edges.size
  }

  isCyclic(): boolean {
    return this.hasCycles
  }

  isAcyclic(): boolean {
    return !this.hasCycles
  }

  isTree(): boolean {
    if (!this.directed) return this.connected && !this.hasCycles

    const roots = [...this.vertices].filter(v => v.incomingEdges!.size === 0)

    if (roots.length !== 1) {
      return false
    }

    for (const v of this.vertices) {
      if (v.incomingEdges!.size > 1) return false
    }

    return this.isAcyclic()
  }

  isForest(): boolean {
    if (!this.directed) return this.connected && !this.hasCycles

    const roots = [...this.vertices].filter(v => v.incomingEdges!.size === 0)

    if (roots.length > 0)
      return this.isAcyclic()

    return false
  }

  isDirected(): boolean {
    let lastValue = false
    let isFirst = true

    for (const edge of this.edges) {
      if (isFirst) {
        isFirst = false
        this.directed = lastValue = edge.isDirected()
      } else if (edge.isDirected() != lastValue) {
        this.mixed = true
        this.directed = false
        break
      }
    }

    return this.directed
  }

  isConnected(): boolean {
    if (this.vertices.size < 1) return false
    if (this.vertices.size === 1) return true

    this.isDirected()
    if (this.mixed) throw Error('graph must be not mixed')

    if (this.directed) {
      return [...this.vertices]
        .map(this.isConnectedFrom.bind(this))
        .every(v => v)
    }

    let last: DoublyLinkedList<V> | null = null

    for (const currentVertex of this.vertices) {
      const reachableNeighbours = this.depthFirstSearch(currentVertex)

      if (last === null) last = reachableNeighbours
      else if (
        last.size !== reachableNeighbours.size
                || this.verticesArrayEquals([...last], [...reachableNeighbours])
      ) {
        return false
      }
    }

    return true
  }

  isConnectedFrom(v: V): boolean {
    if (!this.directed) {
      throw new Error('graph must be directed')
    }
    const cloned = new Set(this.vertices)
    cloned.delete(v)
    const reachableVertices = this.depthFirstSearch(v)

    for (const v2 of cloned) {
      if (!reachableVertices.includes(v2)) {
        return false
      }
    }

    return true
  }

  isStronglyConnectedFrom(v: V): boolean {
    if (!this.directed) {
      throw new Error('graph must be directed')
    }

    const cloned = new Set(this.vertices)
    cloned.delete(v)
    const reachableVertices = this.depthFirstSearch(v)
    reachableVertices.comparator = this.comparator
    for (const v2 of cloned) {
      if (reachableVertices.includes(v2)) {
        const reachableVerticesV2 = this.depthFirstSearch(v2)
        if (!reachableVerticesV2.includes(v)) {
          return false
        }
      }
    }

    return true
  }

  isMixed(): boolean {
    this.isDirected()
    return this.mixed
  }

  isDense(): boolean {
    return this.density() <= 0.5
  }

  isSparse(): boolean {
    return this.density() > 0.5
  }

  createEdge(from: V, to: V, title = 'new edge', directed = true, weight = 0): E {
    const e = this.createSingleEdge(title, directed, weight, from, to)
    this.addEdge(e)

    if (!directed) {
      const r = this.createSingleEdge(`${title} r`, directed, weight, to, from)
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
    if (e.from) {
      e.from.outgoingEdges.delete(e.from)
    }
    if (e.to) {
      e.to.incomingEdges.delete(e.to)
    }

    return sizeBefore != arr.length
  }

  createVertex(title = 'new vertex', point = undefined, object = {}): V {
    const vertex = new this.vertexType()
    vertex.title = title
    if (point) {
      vertex.point = point
    }
    if (object !== undefined) {
      vertex.object = object
    }

    return vertex
  }

  addVertex(v: V): boolean {
    this.vertices.add(v)
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

    return sizeBefore != arr.length
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

  protected sumUpPathCosts(p: DoublyLinkedList<V>): number {
    let sum = 0
    for (let i = 0; i < p.size - 1; i++) {
      const first = p.get(i)
      const second = p.get(i + 1)
      for (const e of first.outgoingEdges!) {
        if (e.to.uuid === second.uuid) {
          sum += e.weight!
          break
        }
      }
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
    return _e
  }

  protected getDeduplicatedEdges(): IEdge[] {
    if (this.directed) throw new Error('graph must be undirected')

    const edges: IEdge[] = []
    const ignores: IEdge[] = []
    for (const edge of this.edges) {
      const from = edge.from
      const to = edge.to

      if (!ignores.includes(edge)) {
        edges.push(edge)
      }

      const filtered = [...to.outgoingEdges!].filter(e => e.to.uuid === from.uuid)
      if (filtered.length > 0) {
        const first = filtered[0]
        ignores.push(first)
      }
    }

    return edges
  }

  protected constructShortestPath(from: V, to: V, predecessors: Map<V, V>): DoublyLinkedList<V> {
    const shortestPath: DoublyLinkedList<V> = new DoublyLinkedList<V>()

    let p = predecessors.get(to)!
    if (!p) return shortestPath

    shortestPath.addFirst(to)
    shortestPath.addFirst(p)

    while (!(p.uuid === from.uuid)) {
      const vertex = predecessors.get(p)!
      if (
        predecessors.get(vertex) !== null
                && predecessors.has(vertex)
                && predecessors.get(vertex)!.uuid === p.uuid
      ) {
        break // circle contained, so stop immediately
      }
      p = vertex
      shortestPath.addFirst(p)
    }

    return shortestPath
  }

  protected shortestPathMooreBellmanFord(from: V): SPPair<V> {
    const V: Set<V> = new Set(this.vertices)
    const k: Map<V, number> = new Map()
    const p: Map<V, V> = new Map()
    V.delete(from)

    for (const v of V) {
      k.set(v, 200000)
    }
    k.set(from, 0)
    V.add(from)

    for (let i = 1; i < V.size - 1; i++) {
      for (const e of this.edges) {
        const c = this.c(e.from as V, e.to as V)
        const c1 = k.get(e.from as V)! + c

        if (c1 < k.get(e.to as V)!) {
          k.set(e.to as V, c1)
          p.set(e.to as V, e.from as V)
        }
      }
    }

    return {
      p,
      k
    }
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

    return false
  }

  protected checkForNegativeCyclesFrom(s: V): boolean {
    this.hasNegativeCycles = false
    const { k } = this.shortestPathMooreBellmanFord(s)

    for (const e of this.edges) {
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
  constructor(props: GraphProperties = {}, comparator: Comparator<Vertex> = (v1, v2) => (v1.uuid === v2.uuid ? Ordering.EQ : v1.outdeg() < v2.outdeg() ? Ordering.LT : Ordering.GT)) {
    super(props, comparator, Vertex, Edge)
  }
}
