import {Comparator, FibonacciHeap, ICollection, IReverseIterable, IStack, Node, Ordering, quicksort} from './index'

export interface IQueue<E> extends ICollection<E> {
  enqueue(e: E): void
  dequeue(): E
  head(): E
}

export interface IDequeue<E> extends IQueue<E>, IStack<E>, IReverseIterable<E> {
}

export class Queue<E> implements IQueue<E> {
  private arr: E[] = []
  size = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>, comparator?: Comparator<E>) {
    if (elements) {
      for(const el of elements) {
        this.enqueue(el)
      }
    }

    if (comparator) {
      this.comparator = comparator
      this.sort()
    }
  }

  clear(): void {
    this.arr.splice(0, this.size)
    this.size = 0
  }

  dequeue(): E {
    const head = this.arr.pop()
    if (head === undefined) throw new Error('no such element')
    this.size--
    return head
  }

  enqueue(e: E): void {
    if (e !== undefined) {
      this.arr.unshift(e)
      this.size++
    }
  }

  add(e: E): void {
    this.enqueue(e)
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  head(): E {
    const head = this.arr[this.size - 1]
    if (head === undefined) throw new Error('no such element')
    return head
  }

  [Symbol.iterator](): Iterator<E> {
    const queue = this
    let index = this.size - 1
    return {
      next: () => {
        let top
        if (index > -2) top = queue.arr[index--]
        return {
          done: index === -2,
          value: top
        } as IteratorResult<E>
      }
    }
  }

  *reverseIterator(): Generator<E> {
    for (let i = 0; i < this.size; i++) {
      yield this.arr[i]
    }
  }

  sort(cmp?: Comparator<E>): void {
    const backupCmp = this.comparator
    if (cmp) {
      this.comparator = cmp
    }
    this.arr
      .sort(this.comparator)
      .reverse()
    this.comparator = backupCmp
  }
}

export class LinkedQueue<E> implements IQueue<E> {
  private _head: Node<E>
  private tail: Node<E>
  size = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>, comparator?: Comparator<E>) {
    if (elements) {
      for(const el of elements) {
        this.enqueue(el)
      }
    }
    if (comparator) {
      this.comparator = comparator
    }
  }

  /**
   * O(1)
   * @param e
   */
  enqueue(e: E) {
    if (e === undefined) return
    const oldTail = this.tail
    this.tail = {
      value: e,
      next: undefined
    }
    if (this._head) oldTail!.next = this.tail
    else this._head = this.tail
    this.size++
  }

  add(e: E): void {
    this.enqueue(e)
  }

  /**
   * O(1)
   */
  dequeue() {
    const head = this._head
    if (!this._head) throw new Error('no such element')
    this._head = head!.next
    this.size--
    const value = head!.value
    if (this.isEmpty()) {
      this.tail = this.tail!.value = this.tail!.next = this.tail!.prev = undefined! // GC
    }

    head!.value = head!.prev = head!.next = undefined! // GC
    return value
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
  head() {
    if (this._head) return this._head.value
    throw new Error('no such element')
  }

  /**
   * O(1)
   */
  clear() {
    this._head = undefined
    this.size = 0
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
    }
  }

  *reverseIterator(): Generator<E> {
    const tmp = []
    for (const e of this) {
      tmp.push(e)
    }

    for (const e of tmp.reverse()) {
      yield e
    }
  }

  sort(cmp?: Comparator<E>): void {
    const sorted = quicksort(this, cmp || this.comparator, () => new LinkedQueue())
    this.clear()
    for (const sortedElement of sorted) {
      this.enqueue(sortedElement)
    }
  }
}

export class PriorityQueue<E> implements IQueue<E> {
  size = 0
  comparator: Comparator<E>
  heap: FibonacciHeap<E>

  constructor(comparator: Comparator<E>, elements?: Iterable<E>) {
    this.comparator = comparator
    this.heap = new FibonacciHeap<E>(comparator)
    if (elements) {
      for (const e of elements) {
        this.heap.insert(e)
        this.size++
      }
    }
  }

  enqueue(e: E): void {
    if (e !== undefined) {
      this.heap.insert(e)
      this.size++
    }
  }

  dequeue(): E {
    const minNode = this.heap.extractMin()
    this.size--
    const value = minNode.value
    minNode.value = minNode.parent = minNode.child = minNode.left = minNode.right = undefined! // GC
    return value
  }

  head(): E {
    if (this.size === 0) throw new Error('no such element')
    return this.heap.minimum().value
  }

  add(e: E): void {
    this.enqueue(e)
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  clear(): void {
    this.heap.clear()
    this.size = 0
  }

  [Symbol.iterator](): Iterator<E> {
    return this.heap[Symbol.iterator]()
  }

  *reverseIterator(): Generator<E> {
    const tmp = []
    for (const e of this) {
      tmp.push(e)
    }

    for (const e of tmp.reverse()) {
      yield e
    }
  }

  sort(cmp?: Comparator<E>): void {
    this.heap.sort(cmp || this.comparator)
  }
}

export class Dequeue<E> implements IDequeue<E> {
  size = 0
  private _head: Node<E>
  private tail: Node<E>
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>) {
    if (elements) {
      for(const el of elements) {
        this.enqueue(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  enqueue(e: E): void {
    if (e === undefined) return
    if (!this._head) {
      this._head = { value: e }
    } else if (!this.tail) {
      this.tail = {
        value: e,
        prev: this._head
      }
      this._head.next = this.tail
    } else {
      const newTail = {
        value: e,
        prev: this.tail
      }
      this.tail.next = newTail
      this.tail = newTail
    }
    this.size++
  }

  add(e: E): void {
    this.enqueue(e)
  }

  /**
   * O(1)
   */
  dequeue(): E {
    if (this.size === 0) throw new Error('no such element')
    const head = this._head
    this._head = head!.next
    if (this._head) this._head.prev = undefined
    this.size--
    if (this.isEmpty()) this.tail = undefined
    return head!.value
  }

  /**
   * O(1)
   * @param e
   */
  push(e: E): void {
    if (e !== undefined) {
      if (!this._head) {
        this._head = { value: e }
      } else if (!this.tail) {
        this.tail = this._head
        this.tail.next = undefined
        this._head = {
          value: e,
          next: this.tail
        }
        this.tail.prev = this._head
      } else {
        const newHead = {
          value: e,
          next: this._head
        }
        this._head.prev = newHead
        this._head = newHead
      }
      this.size++
    }
  }

  /**
   * O(1)
   */
  pop(): E {
    if (this.size === 0) throw new Error('no such element')
    let currentTail = this.tail
    if (!currentTail) {
      currentTail = this._head
      this._head = undefined
    }
    if (this.size === 2) {
      currentTail = this.tail
      this.tail = this._head!.next = undefined
    }

    this.tail = currentTail!.prev
    if (this.tail) this.tail.next = undefined
    this.size--

    return currentTail!.value
  }

  /**
   * O(1)
   */
  top(): E {
    if (this.tail) return this.tail.value
    if (this._head) return this._head.value
    throw new Error('no such element')
  }

  /**
   * O(1)
   */
  head(): E {
    if (this._head) return this._head.value
    throw new Error('no such element')
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * O(1)
   */
  clear() {
    this._head = this.tail = undefined
    this.size = 0
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false
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
    }
  }

  /**
   * O(size)
   */
  *reverseIterator() {
    if (!this.tail && !this._head) return
    if (!this.tail) {
      yield this._head!.value
      return
    }
    let tail = this.tail
    yield tail?.value
    while (tail?.prev != undefined) {
      tail = tail.prev
      yield tail.value
    }
  }

  sort(cmp?: Comparator<E>): void {
    const sorted = quicksort(this, cmp || this.comparator, () => new Dequeue())
    this.clear()
    for (const sortedElement of sorted) {
      this.enqueue(sortedElement)
    }
  }
}
