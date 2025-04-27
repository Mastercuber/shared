import {Comparator, ICollection, Node, Ordering, quicksort} from './index'

export interface IStack<E> extends ICollection<E> {
  comparator: Comparator<E>
  push(e: E): void
  pop(): E
  top(): E
  contains(e: E): boolean
}

export class Stack<E> implements IStack<E> {
  private arr: E[] = []
  size = 0
  comparator: Comparator<E> = null!
  constructor(elements?: Iterable<E>) {
    if (elements) {
      for(const el of elements) {
        this.push(el)
      }
    }
  }

  clear(): void {
    this.arr.splice(0, this.arr.length)
    this.size = 0
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  top(): E {
    const top = this.arr[this.size - 1]
    if (top === undefined) throw new Error('no such element')
    return top
  }

  pop(): E {
    const top = this.arr.pop()
    if (top === undefined) throw new Error('no such element')
    this.size--
    return top
  }

  push(e: E): void {
    if (e !== undefined) {
      this.arr.push(e)
      this.size++
    }
  }

  /**
   * To use this method, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false
  }

  [Symbol.iterator](): Iterator<E> {
    const stack = this
    let index = this.size - 1
    return {
      next: () => {
        let top
        if (index > -2) top = stack.arr[index--]
        return {
          done: index === -2,
          value: top
        } as IteratorResult<E>
      }
    }
  }

  add(e: E): void {
    this.push(e)
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
    this.arr.sort(cmp || this.comparator)
  }
}

export class LinkedStack<E> implements IStack<E> {
  private _top: Node<E>
  size = 0
  comparator: Comparator<E> = null!
  constructor(elements?: Iterable<E>) {
    if (elements) {
      for(const el of elements) {
        this.push(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  push(e: E) {
    if (e !== undefined) {
      this._top = {
        value: e,
        prev: this._top
      }
      this.size++
    }
  }

  /**
   * O(1)
   */
  pop() {
    const node = this._top
    if (node === undefined) throw new Error('no such element')
    this._top = node.prev
    this.size--
    const value = node.value
    node.value = node.next = node.prev = undefined! // GC
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
  top() {
    if (this._top === undefined) throw new Error('no such element')
    return this._top.value
  }

  /**
   * O(1)
   */
  clear() {
    this._top = undefined
    this.size = 0
  }

  /**
   * To use this method, a comparator must be set
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
    let top = this._top
    return {
      next: () => {
        const _top = top
        top = _top?.prev
        return {
          done: _top === undefined,
          value: _top?.value!
        }
      }
    }
  }

  add(e: E): void {
    this.push(e)
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
    const sorted = quicksort(this, cmp || this.comparator, () => new LinkedStack())
    this.clear()
    for (const sortedElement of sorted) {
      this.push(sortedElement)
    }
  }
}
