### About this package

This package contains a collection of essential data structures and graph algorithms written in TypeScript, with zero dependencies. It supports CommonJS, ESM, and browser environments, and includes several utility functions for practical everyday use.

The concept of organizing and structuring data reaches back long before the era of modern programming. In the **19th century**, mathematics introduced structured forms like **matrices** and **polynomials**. In **1854**, **George Boole** laid the foundations for logical structures with his algebra. By **1837**, **Charles Babbage** envisioned tabular memory structures in his design of the *Analytical Engine*. **Herman Hollerith** followed in **1890** with punched cards as a form of structured data storage. Later, in **1936**, **Alan Turing** described the *Turing machine*, which operated on an infinite tape – a conceptual precursor to modern abstractions like tapes, arrays, or queues.

Finally, in the 1940s, **Konrad Zuse** introduced the *Plankalkül*, one of the first formal programming languages, which explicitly defined typed data structures and operations – laying groundwork for modern abstractions as used in this package.

This library draws inspiration from these foundational ideas while focusing on clean implementation, type safety, and broad applicability in modern JavaScript and TypeScript projects.

Here are two examples of using the package directly in the browser:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>include npm package as IIFE</title>
    <script src="https://unpkg.com/@avensio/shared"></script>
  </head>
  <body>
  
    <script>
      const a = new Vertex('A')
      const b = new Vertex('B')
      const g = new Graph()
      g.addVertex(a)
      g.addVertex(b)
      g.addEdge(new Edge(a, b))
      console.debug(g)
    </script>
    
    <script type="module">
      import { Vertex, Edge, Graph } from 'https://unpkg.com/@avensio/shared@latest/dist/shared.es.js'
    </script>
  
  </body>
</html>
```
otherwise install it with `npm`/`pnpm`: `npm install @avensio/shared` and use the classes by importing them:
```javascript
import { Vertex, Edge, Graph } from '@avensio/shared'
```

The test coverage is about [90%](test/) and benchmarks for list, queue and stack tests are included.

A bulk of algorithms have asymptotic behavior described with the upper and the lower bound (time complexity).

All datastructures (except Graph, Vertex, Edge) can be passed an `Iterable` as constructor argument to initialize with.

1. [Graph](#graph)  
1.1 [GraphProperties](#graph-properties)  
1.2 [Algorithms](#algorithms)  
1.3 [Utility Functions](#utility-functions)  
2. [Lists](#lists)  
2.1 [List](#list)  
2.2 [LinkedList](#linkedlist)  
2.2.1 [DoublyLinkedList](#doublylinkedlist)  
2.2.2 [CyclicLinkedList](#cycliclinkedlist)  
3. [Queues](#queues)  
3.1 [Queue](#queue)  
3.2 [LinkedQueue](#linkedqueue)  
3.3 [PriorityQueue](#priorityqueue)  
3.4 [Dequeue](#dequeue)  
4. [Stacks](#stacks)  
4.1 [Stack](#stack)  
4.2 [LinkedStack](#linkedstack)  
5. [Heap](#heap)  
6. [Sorting](#sorting)   
6.1 [Quicksort](#quicksort)  
6.2 [Heapsort](#heapsort)  

# Graph
To use the Graph provided by this package some [GraphProperties](src/graph/graph.ts#L5) can be passed to the [Graph](src/graph/graph.ts#L1050) constructor as first argument, as second a *comparator* can be passed.

The comparator is needed for some algorithms to function properly and **must** return all [Ordering's](src/index.ts#L1) (-1 for LessThan, 0 for EQual and 1 for GreaterThan).

A minimal example of using the graph is as follows:
```typescript
import { Graph } from '@avensio/shared'

const graph = new Graph()
```

If a custom Graph with custom Vertex and Edge classes is needed, the Graph can extend [AGraph](src/graph/graph.ts#L72) like so:
```typescript
class CustomVertex extends Vertex {
  additionalVertexProp = 'prop'
}

class CustomEdge extends Edge {
  additionalEdgeProp = 'prop'
}

class Graph extends AGraph<CustomVertex, CustomEdge> {
  constructor(props: GraphProperties = {}, comparator?: Comparator<CustomVertex>)) {
    const _cmp = (v1: IVertex, v2: IVertex) => (v1.uuid === v2.uuid ?
      Ordering.EQ
      : v1.outdeg() < v2.outdeg() ?
        Ordering.LT
        : Ordering.GT)
    super(props, (comparator || _cmp), CustomVertex, CustomEdge)
  }
}
```
A custom comparator can be provided for CustomVertex or a default one (`_cmp`) could be used.

## Graph Properties

* `density(): number`
  * Calculates the [density](https://en.wikipedia.org/wiki/Dense_graph) of the graph. Density is the ratio of the number of actual edges to the maximum possible number of edges. A value close to 1 indicates a dense graph; a value close to 0 indicates a sparse graph.

* `order(): number`
  * Returns the number of vertices (nodes) in the graph.

* `size(): number`
  * Returns the number of edges in the graph.

* `isCyclic(): boolean`
  * Checks whether the graph contains at least one cycle (i.e., a path that starts and ends at the same node).

* `isAcyclic(): boolean`
  * Checks whether the graph is acyclic (i.e., contains no cycles).

* `isTree(): boolean`
  * Checks whether the graph is a tree, meaning it is connected and acyclic.

* `isForest(): boolean`
  * Checks whether the graph is a forest, meaning it consists of a collection of disjoint trees.

* `isDirected(): boolean`
  * Returns whether the graph is directed (i.e., edges have a direction).

* `isConnected(): boolean`
  * Checks whether the directed or undirected graph is connected, meaning there is a path between any two nodes.

* `isStronglyConnected(): boolean`
  * Checks if there is a path from `v` to every other node and a path from every other node back to `v` (strong connectivity).

* `isMixed(): boolean`
  * Returns whether the graph has both directed and undirected edges (mixed graph).

* `isDense(): boolean`
  * Checks whether the graph is considered dense based on a defined density threshold (density >= threshold).

* `isSparse(): boolean`
  * Checks whether the graph is considered sparse, meaning it has relatively few edges compared to the number of possible edges (density < threshold).


## Algorithms

* `depthFirstSearch(startVertex: V)`
  * Performs a **depth-first traversal** starting from `startVertex`. Explores as far as possible along each branch before backtracking.

* `breadthFirstSearch(startVertex: V)`
  * Performs a **breadth-first traversal** starting from `startVertex`. Visits all neighboring vertices before moving to the next level.

* `shortestPath(from: V, to: V)`
  * Computes the **shortest path** between `from` and `to` using a modified More-Bellman-Ford's algorithm. Returns the path as a list of vertices.

* `kShortestPaths(from: V, to: V, k: number)`
  * Finds the **k shortest simple paths** between `from` and `to` using a variation of Yen's algorithm. Returns a list of paths sorted by total cost.

* `minimalSpanningTree()`
  * Constructs a **minimal spanning tree** of the graph using Kruskal's algorithm (if undirected) or returns a minimum branching (if directed).

* `topologicalSorting()`
  * Performs a **topological sort** on the graph. Assumes the graph is a Directed Acyclic Graph (DAG) and returns an ordering of vertices.

* `parallelTopologicalSorting()`
  * Computes a **layered topological sort**, grouping vertices into levels based on dependencies. Useful for parallel execution scheduling.

* `connectedComponents()`
  * Identifies all **connected components** of the graph (for undirected graphs) and returns them as a list of graphs.

* `strongConnectedComponents()`
  * Finds all **strongly connected components** in a directed graph.

* `checkForCycles()`
  * Checks if the graph contains **any cycles** (works for both directed and undirected graphs).

* `checkForNegativeCycles()`
  * Checks if the graph contains **negative weight cycles** (applicable for weighted directed graphs; uses Bellman-Ford approach).

* `inferCycles()`
  * Identifies and returns **all detected cycles** within the graph. May return multiple cycles if the graph is highly interconnected.


## Utility functions

* `createEdge(from: V, to: V, title?: string, directed?: boolean, weight?: number): E`  
  Creates a new edge between two vertices, optionally specifying a title, direction, and weight.

* `addEdge(e: E): boolean`  
  Adds an edge to the graph if it does not already exist; returns `true` if successful, `false` if the edge is already contained.

* `removeEdge(e: E): boolean`  
  Removes an edge from the graph; returns `true` if the edge was found and removed, `false` otherwise.

* `createVertex(title?: string, point?: Point, object?: any): V`  
  Creates a new vertex with an optional title, a position (`Point`), and any additional associated data (`object`).

* `addVertex(v: V): boolean`  
  Adds a vertex to the graph if it does not already exist; returns `true` if successful, `false` if the vertex is already contained.

* `removeVertex(v: V): boolean`  
  Removes a vertex (and all connected edges) from the graph; returns `true` if the vertex was found and removed, `false` otherwise.

* `c(from: V, to: V): number`  
  Returns the cost (i.e., weight) of traveling from one vertex to another.  
  If no direct edge exists, typically returns `Infinity` or a sentinel value.

# Lists
All lists implement the interface `IList`:

```typescript
interface IList<E> extends ICollection<E>, IListFunctions<E> {
  comparator: Comparator<E>
  addAll(c: Iterable<E>): void
  get(index: number): E
  set(index: number, e: E | null): boolean
  remove(index: number): E
  equals(l: IList<E>): boolean
  indexOf(e: E): number
  includes(e: E): boolean
  reverseIterator(): Generator<E>
}
```
The interface `ICollection` adds the following to the lists:
```typescript
interface ICollection<E> extends ISortable<E>, Iterable<E>, IReverseIterable<E> {
  add(e: E): void
  size: number
  isEmpty(): boolean
  clear(): void
}
```
and further, `Iterable` adds:
```typescript
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
```
`ISortable` adds:
```typescript
export interface ISortable<V> {
  sort(cmp?: Comparator<V>): void
}
```
`IReverseIterable` adds:
```typescript
interface IReverseIterable<E> {
  reverseIterator(): Generator<E>
}
```
and `IListFunctions` adds some common functions:
```typescript
interface IListFunctions<E> {
  map<V>(fn: (e: E) => V): IList<V>
  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V
  filter(predicate: (e: E) => boolean): IList<E>
  every(predicate: (e: E) => boolean): boolean
  some(predicate: (e: E) => boolean): boolean
  slice(startIndex: number, endIndex: number): IList<E>
  slice2(startIndex: number, endIndex: number): IList<E>
  splice(startIndex: number, deleteCount: number): IList<E>
}
```

## List
List implementation using the **native array** as data structure _to have a reference_ when [**benchmarking**](test/benchmarks/list.bench.ts) some list methods.

```typescript
const list = new List<number>()
const list2 = new List<number>([1,2,3])
```

## LinkedList
A linked list consists of nodes, each with a **pointer to the next node**.

Additionally, to the interfaces in `IList`, LinkedLists also implement the following properties and functions:
```typescript
export interface ILinkedList<E> extends IList<E> {
  first: Node<E>
  last: Node<E>
  getNode(index: number): Node<E>
  addFirst(e: E): void
  addLast(e: E): void
  getFirst(): E
  getLast(): E
  removeFirst(): E
  removeLast(): E
}

const list = new LinkedList<number>()
```

### DoublyLinkedList
Linked lists hava one pointer to the next node, but that's it. No other pointers. Doubly linked lists have these second **pointer to the previous element**.

```typescript
const list = new DoublyLinkedList<number>()
```

### CyclicLinkedList
Doubly linked lists have 2 pointers: the first to the next, and the second to the previous element. But these kind of list is ending at the first and last elements. The doubly linked list kind of lists has **no previous pointer** at the _first element_ and **no next pointer** at the _last element_.

With this cyclic linked lists there is a new kind of list with exactly these 2 pointers. So a cyclic linked list is named this way, since the **first element** now _points to the last_ and the **last** to the _first element_, so the list is now **cyclic**. 

```typescript
const list = new CyclicLinkedList<number>()
```

# Queues
Queues are implementing the interface `IQueue` and extends `ICollection`:
```typescript
export interface IQueue<E> extends ICollection<E> {
  enqueue(e: E): void
  dequeue(): E
  head(): E
}
```
## Queue
Queues have a head (f.e. the first one in the queue) and a tail (where the new ones will enqueue).

Like the list, also the queue have an implementation using a native array as backing data structure for **[benchmarking](test/benchmarks/queue.bench.ts)**.

```typescript
const queue = new Queue<number>()
```

## LinkedQueue
A linked queue has like a linked list 2 pointers with **different names**. With queues the pointers are _head_ and _tail_, instead of _first_ and _last_.

```typescript
const queue = new LinkedQueue<number>()
```

## PriorityQueue
The priority queue uses the [fibonacci heap](src/heap.ts) implementation to store the elements.

```typescript
const queue = new PriorityQueue<number>()
```
## Dequeue
A Dequeue merge a Stack and a Queue, so both type of functions are usable (`enqueue`, `dequeue`, `push`, `pop`, `head`, `top`)

```typescript
export interface IDequeue<E> extends IQueue<E>, IStack<E> { }

const dequeue = new Dequeue<number>()
```

# Stacks
Stacks have the following interface:
```typescript
export interface IStack<E> extends ICollection<E> {
  comparator: Comparator<E>
  push(e: E): void
  pop(): E
  top(): E
  contains(e: E): boolean
}
```
## Stack
Like the list and queue, also the stack has a reference implementation with native arrays for **[benchmarking](test/benchmarks/stack.bench.ts)**.

```typescript
const stack = new Stack<number>()
```

## LinkedStack
The linked stack is an implementation with 1 pointer to the top of the stack. Each node knows the previous one in the stack.

```typescript
const stack = new LinkedStack<number>()
```

# Heap
This package provides a tested fibonacci heap implementation.

The fibonacci heap has the following interface:
```typescript
export interface IFibonacciHeap<E> extends ICollection<E> {
  rootList: HeapNode<E>
  minNode: HeapNode<E>
  insert(element: E): HeapNode<E>
  delete(node: HeapNode<E>): HeapNode<E>
  decreaseKey(node: HeapNode<E>, newValue: E): void
  minimum(): HeapNode<E>
  extractMin(): HeapNode<E>
  union(heap: IFibonacciHeap<E>): void
  extractNeighbours(node: HeapNode<E>, includeSelf?: boolean): CyclicDoublyLinkedList<HeapNode<E>>
  extractChildren(node: HeapNode<E>): CyclicDoublyLinkedList<HeapNode<E>>
}

const heap = new FibonacciHeap<number>()
```
and a heap node looks like:
```typescript
export type HeapNode<E> = {
  value: E
  degree: number
  marked: boolean
  left: HeapNode<E>
  right: HeapNode<E>
  parent?: HeapNode<E>
  child?: HeapNode<E>
}
```

# Sorting
There are 2 sorting algorithmen's provided with the implementation. One quicksort, and one heapsort variant using a fibonacci heap. The heapsort can be run on `Iterable`s and the quicksort on `ICollection`.

## Quicksort
The quicksort algorithm has the following function signature and returns a sorted collection, which creation must be passed as factory function (third parameter):
```typescript
function quicksort<V>(
        collection: ICollection<V>,
        comparator: Comparator<V>,
        factory: () => ICollection<V>
): ICollection<V> {}
```

A comparator like the following (for numbers) must be specified for sorting the collection:
```typescript
function numberComparatorASC(n1: number, n2: number) {
  if (n1 === n2) return Ordering.EQ // 0
  if (n1 < n2) return Ordering.LT // -1

  return Ordering.GT // 1
}
```
It's also possible to pass a comparator which returns bigger numbers.

## Heapsort
Sorting a list using a FibonacciHeap has the following function signature:

```typescript
function heapSort<V>(A: Iterable<V>, comparator: Comparator<V>): FibonacciHeap<V> {}
```
