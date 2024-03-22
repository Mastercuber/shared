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

This is a package containing multiple **datastructures** and some **graph algorithms** written in typescript.

The test coverage is about [90%](test/) and benchmarks for list, queue and stack tests are included.

A bulk of algorithms have asymptotic behavior described with the upper bound and the lower bound.

All datastructures (except Graph, Vertex, Edge) can be passed an `Iterable` as constructor argument to initialize with.

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
  * [Density](https://en.wikipedia.org/wiki/Dense_graph) of the graph
* `order(): number`
* `size(): number`
* `isCyclic(): boolean`
* `isAcyclic(): boolean`
* `isTree(): boolean`
* `isForest(): boolean`
* `isDirected(): boolean`
* `isConnected(): boolean`
* `isConnectedFrom(v: V): boolean`
* `isStronglyConnectedFrom(v: V): boolean`
* `isMixed(): boolean`
* `isDense(): boolean`
* `isSparse(): boolean`

## Algorithms
* `depthFirstSearch(startVertex: V)`
* `breadthFirstSearch(startVertex: V)`
* `shortestPath(from: V, to: V)`
* `kShortestPaths(from: V, to: V, k: number)`
* `minimalSpanningTree()`
* `topologicalSorting()`
* `parallelTopologicalSorting()`
* `connectedComponents()`
* `strongConnectedComponents()`
* `checkForCycles()`
* `checkForNegativeCycles()`
* `inferCycles()`

## Utility functions
* `createEdge(from: V, to: V, title?: string, directed?: boolean, weight?: number): E`
* `addEdge(e: E): boolean`
* `removeEdge(e: E): boolean`
* `createVertex(title?: string, point?: Point, object?: any): V`
* `addVertex(v: V): boolean`
* `removeVertex(v: V): boolean`
* `c(from: V, to: V): number`

# Lists
All lists implement the interface `IList`:
```typescript
export interface IList<E> extends ICollection<E>, ISortable<E> {
  comparator: Comparator<E>
  add(e: E): void
  addAll(c: Iterable<E>): void
  get(index: number): E
  set(index: number, e: E | null): boolean
  slice(startIndex: number, endIndex: number): IList<E>
  slice2(startIndex: number, endIndex: number): IList<E>
  splice(startIndex: number, deleteCount: number): IList<E>
  map<V>(fn: (e: E) => V): IList<V>
  filter(predicate: (e: E) => boolean): IList<E>
  remove(index: number): E
  includes(e: E): boolean
  equals(l: IList<E>): boolean
  indexOf(e: E): number
  reverseIterator(): Generator<E>
}
```
The interface `ICollection` adds the following to the lists:
```typescript
export interface ICollection<E> extends Iterable<E> {
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
and `ISortable` adds:
```typescript
export interface ISortable<V> {
  sort(cmp?: Comparator<V>): void
}
```
There are 2 sorting algorithmen's provided with the implementation. One quicksort, and one heapsort variante using a fibonacci heap.

## List
List implementation using the **native array** as data structure _to have a reference_ when [**benchmarking**](test/benchmarks/list.bench.ts) some list methods.

```typescript
const list = new List<number>()
const list = new List<number>([1,2,3])
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
const dequeue = new Dequeue<number>()
```

# Stacks
Stacks have the following interface:
```typescript
export interface IStack<E> extends ICollection<E> {
  push(e: E): void
  pop(): E
  top(): E
  contains(e: E): boolean
  comparator: Comparator<E>
}
```
## Stack
Linke the list and queue, also the stack has a reference implementation with native arrays for **[benchmarking](test/benchmarks/stack.bench.ts)**.

```typescript
const stack = new Stack<number>()
```

## LinkedStack
The linked stack is an implementation with 1 pointer to the top of the stack. Each node knows the previous one in the stack.

```typescript
const stack = new LinkedStack<number>()
```

# Heap
This package provides tested fibonacci heap implementation.

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
One of the quickest ways of sorting a collection is the quicksort. Additionally to this sorting algorithm a heapsort variant is provided by this package, using a FibonacciHeap for sorting.

## Quicksort
The quicksort has the following function signature:
```typescript
quicksort<V>(A: IList<V>, comparator: Comparator<V>): IList<V>
```

## Heapsort
Sorting a list using a FibonnaciHeap has the following function signature:
```typescript
heapSort<V>(A: IList<V>, comparator: Comparator<V>): FibonnaciHeap<V>
```
