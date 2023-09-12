import {Collection, Comparator, FibonacciHeap, Node} from "./index";

export interface IQueue<E> extends Collection<E> {
  enqueue(e: E): void
  dequeue(): E
  peek(): E
}

export interface IDequeue<E> extends Collection<E> {
  enqueue(e: E): void
  dequeue(): E
  push(e: E): void
  pop(): E
  top(): E
  head(): E
  reverseIterator(): Generator<E>
}

export class Queue<E> implements IQueue<E> {
  private arr: E[] = []
  size = 0
  constructor(e?: E | E[] | Set<E>) {
    if (Array.isArray(e) || e instanceof Set) {
      e.forEach(_e => this.enqueue(_e))
    } else if (e != undefined) {
      this.enqueue(e)
    }
  }

  clear(): void {
    this.arr.splice(0, this.size)
    this.size = 0
  }

  dequeue(): E {
    const head = this.arr.pop()
    if (head == undefined) throw new Error("no such element")
    this.size--
    return head
  }

  enqueue(e: E): void {
    if (e != undefined) {
      this.arr.unshift(e)
      this.size++
    }
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  peek(): E {
    const head = this.arr[this.size - 1];
    if (head == undefined) throw new Error("no such element")
    return head
  }

  [Symbol.iterator](): Iterator<E> {
    const queue = this
    return {
      next: () => {
        const el = queue.dequeue()
        return {
          done: queue.isEmpty(),
          value: el
        }
      }
    };
  }
}

export class LinkedQueue<E> implements IQueue<E> {
  private head: Node<E>
  private tail: Node<E>
  size = 0
  constructor(e?: E | E[] | Set<E>) {
    if (Array.isArray(e) || e instanceof Set) {
      e.forEach(_e => this.enqueue(_e))
    } else if (e != undefined) {
      this.enqueue(e)
    }
  }

  /**
   * O(1)
   * @param e
   */
  enqueue(e: E) {
    if (e == undefined) return
    const oldTail = this.tail
    this.tail = {
      value: e,
      next: undefined
    }
    if (this.head)
      oldTail!.next = this.tail
    else
      this.head = this.tail
    this.size++
  }

  /**
   * O(1)
   */
  dequeue() {
    const head = this.head
    if (!this.head) throw new Error("no such element")
    this.head = head!.next
    this.size--
    if (this.isEmpty())
      this.tail = undefined
    return head!.value
  }

  /**
   * O(1)
   */
  isEmpty() {
    return this.size === 0
  }

  /**
   * O(1)
   */
  peek() {
    if (this.head) return this.head.value
    throw new Error("no such element")
  }

  /**
   * O(1)
   */
  clear() {
    this.head = undefined
    this.size = 0
  }

  /**
   * O(size - 1)
   */
  [Symbol.iterator](): Iterator<E> {
    const queue = this
    return {
      next: () => {
        const el = queue.dequeue()
        return {
          done: queue.isEmpty(),
          value: el
        }
      }
    };
  }
}

export class PriorityQueue<E> implements IQueue<E> {
  size = 0;
  comparator: Comparator<E>
  heap: FibonacciHeap<E>


  constructor(comparator: Comparator<E>) {
    this.comparator = comparator;
    this.heap = new FibonacciHeap<E>(comparator)
  }

  enqueue(e: E): void {
    if (e != undefined) {
      this.heap.insert(e)
      this.size++
    }
  }

  dequeue(): E {
    const minNode = this.heap.extractMin()
    this.size--
    return minNode.value
  }

  peek(): E {
    if (this.size === 0) throw new Error("no such element")
    return this.heap.minimum().value
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  clear(): void {
    this.heap.clear()
    this.size = 0
  }

  [Symbol.iterator](): Iterator<E> {
    return this.heap.valuesIterator()
  }
}

export class Dequeue<E> implements IDequeue<E> {
  size = 0
  private _head: Node<E>
  private tail: Node<E>

  constructor(e?: E | E[] | Set<E>) {
    if (Array.isArray(e) || e instanceof Set) {
      e.forEach(_e => this.enqueue(_e))
    } else if (e != undefined) {
      this.enqueue(e)
    }
  }

  /**
   * O(1)
   * @param e
   */
  enqueue(e: E): void {
    if (e == undefined) return
    const oldTail = this.tail
    this.tail = {
      value: e,
      next: undefined
    }
    if (this._head)
      oldTail!.next = this.tail
    else
      this._head = this.tail
    this.size++
  }

  /**
   * O(1)
   */
  dequeue(): E {
    const head = this._head
    if (!this._head) throw new Error("no such element")
    this._head = head!.next
    this.size--
    if (this.isEmpty())
      this.tail = undefined
    return head!.value
  }

  /**
   * O(1)
   * @param e
   */
  push(e: E): void {
    if (e != undefined) {
      this.tail = {
        value: e,
        prev: this.tail
      }
      this.size++
    }
  }

  /**
   * O(1)
   */
  pop(): E {
    const node = this.tail
    if (node == undefined) throw new Error("no such element")
    this.tail = node.prev
    this.size--
    return node.value
  }

  /**
   * O(1)
   */
  top(): E {
    if (this.tail == undefined) throw new Error("no such element")
    return this.tail.value
  }

  /**
   * O(1)
   */
  head(): E {
    if (this._head) return this._head.value
    throw new Error("no such element")
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * O(1)
   */
  clear() {
    this._head = this.tail = undefined
    this.size = 0
  }

  /**
   * O(size - 1)
   */
  *reverseIterator() {

  }

  /**
   * O(size - 1)
   */
  [Symbol.iterator](): Iterator<E> {
    const dequeue = this
    return {
      next: () => {
        const el = dequeue.dequeue()
        return {
          done: dequeue.isEmpty(),
          value: el
        }
      }
    };
  }
}
