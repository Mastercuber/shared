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
  tail(): E
  reverseIterator(): Generator<E>
}

export class Queue<E> implements IQueue<E> {
  private arr: E[] = []
  size = 0

  constructor(collection?: Collection<E> | Array<E> | Set<E>) {
    if (collection) {
      for(const el of collection) {
        this.enqueue(el)
      }
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
    let index = this.size - 1
    return {
      next: () => {
        let top
        try {
          top = queue.arr[index--]
        } catch (e) {}
        return {
          done: index === -2,
          value: top!
        }
      }
    };
  }
}

export class LinkedQueue<E> implements IQueue<E> {
  private head: Node<E>
  private tail: Node<E>
  size = 0

  constructor(collection?: Collection<E> | Array<E> | Set<E>) {
    if (collection) {
      for(const el of collection) {
        this.enqueue(el)
      }
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
    let head = this.head
    return {
      next: () => {
        const _head = head
        head = _head?.next
        return {
          done: _head == undefined,
          value: _head?.value!
        }
      }
    };
  }
}

export class PriorityQueue<E> implements IQueue<E> {
  size = 0;
  comparator: Comparator<E>
  heap: FibonacciHeap<E>

  constructor(comparator: Comparator<E>, collection?: Collection<E> | Array<E> | Set<E>) {
    this.comparator = comparator;
    this.heap = new FibonacciHeap<E>(comparator)
    if (collection) {
      for (let e of collection) {
        this.heap.insert(e)
      }
    }
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
  private _tail: Node<E>

  constructor(collection?: Collection<E> | Array<E> | Set<E>) {
    if (collection) {
      for(const el of collection) {
        this.enqueue(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  enqueue(e: E): void {
    if (e == undefined) return
    if (!this._head) {
      this._head = {
        value: e
      }
    } else if (!this._tail) {
      this._tail = {
        value: e,
        prev: this._head
      }
      this._head.next = this._tail
    } else {
      const newTail = {
        value: e,
        prev: this._tail
      }
      this._tail.next = newTail
      this._tail = newTail
    }
    this.size++
  }

  /**
   * O(1)
   */
  dequeue(): E {
    const head = this._head
    if (!this._head) throw new Error("no such element")
    this._head = head!.next
    if (this._head)
      this._head.prev = undefined
    this.size--
    if (this.isEmpty())
      this._tail = undefined
    return head!.value
  }

  /**
   * O(1)
   * @param e
   */
  push(e: E): void {
    if (e != undefined) {
      if (!this._head) {
        this._head = {
          value: e
        }
      } else if (!this._tail) {
        this._head = {
          value: e,
          next: this._head
        }
        this._head.next!.prev = this._head
        this._tail = this._head.next
      } else {
        this._head = {
          value: e,
          next: this._head
        }
        this._head.next!.prev = this._head
      }
      this.size++
    }
  }

  /**
   * O(1)
   */
  pop(): E {
    const currentTail = this._tail
    if (currentTail == undefined) throw new Error("no such element")
    this._tail = currentTail.prev
    if (this._tail?.next)
      this._tail.next = undefined
    this.size--
    return currentTail.value
  }

  /**
   * O(1)
   */
  top(): E {
    if (this._tail) return this._tail.value
    else if (this._head) return this._head.value
    throw new Error("no such element")
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
  tail(): E {
    return this.top()
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
    this._head = this._tail = undefined
    this.size = 0
  }

  /**
   * O(size)
   */
  *reverseIterator() {
    if (!this._tail && !this._head) return
    if (!this._tail) {
      yield this._head!.value
      return
    }
    let tail = this._tail
    yield tail?.value
    while (tail?.prev != undefined) {
      tail = tail.prev
      yield tail.value
    }
  }

  /**
   * O(size)
   */
  [Symbol.iterator](): Iterator<E> {
    let head = this._head
    return {
      next: () => {
        const _head = head
        head = _head?.next
        return {
          done: _head == undefined,
          value: _head?.value!
        }
      }
    };
  }
}
