import {ICollection, Collection, Node} from "./index";

export interface IStack<E> extends ICollection<E> {
  push(e: E): void
  pop(): E
  top(): E
}

export class Stack<E> implements IStack<E> {
  private arr: E[] = []
  size = 0
  constructor(collection?: Collection<E>) {
    if (collection) {
      for(const el of collection) {
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
    if (top === undefined) throw new Error("no such element")
    return top
  }

  pop(): E {
    const top = this.arr.pop()
    if (top === undefined) throw new Error("no such element")
    this.size--
    return top
  }

  push(e: E): void {
    if (e !== undefined) {
      this.arr.push(e)
      this.size++
    }
  }

  [Symbol.iterator](): Iterator<E> {
    const stack = this
    let index = this.size - 1
    return {
      next: () => {
        let top
        try {
          top = stack.arr[index--]
        } catch (e) {}
        return {
          done: index === -2,
          value: top!
        }
      }
    };
  }
}

export class LinkedStack<E> implements IStack<E> {
  private _top: Node<E>
  size = 0
  constructor(collection?: Collection<E>) {
    if (collection) {
      for(const el of collection) {
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
    if (node === undefined) throw new Error("no such element")
    this._top = node.prev
    this.size--
    return node.value
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
    if (this._top === undefined) throw new Error("no such element")
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
   * O(size - 1)
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
    };
  }
}
