import {Collection, Node} from "./index";

export interface IStack<E> extends Collection<E> {
  push(e: E): void
  pop(): E
  peek(): E
}

export class Stack<E> implements IStack<E> {
  private arr: E[] = []
  size = 0
  constructor(collection?: Collection<E> | Array<E> | Set<E>) {
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

  peek(): E {
    const top = this.arr[this.size - 1]
    if (top == undefined) throw new Error("no such element")
    return top
  }

  pop(): E {
    const top = this.arr.pop()
    if (top == undefined) throw new Error("no such element")
    this.size--
    return top
  }

  push(e: E): void {
    if (e != undefined) {
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
  private top: Node<E>
  size = 0
  constructor(collection?: Collection<E> | Array<E> | Set<E>) {
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
    if (e != undefined) {
      this.top = {
        value: e,
        prev: this.top
      }
      this.size++
    }
  }

  /**
   * O(1)
   */
  pop() {
    const node = this.top
    if (node == undefined) throw new Error("no such element")
    this.top = node.prev
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
  peek() {
    if (this.top == undefined) throw new Error("no such element")
    return this.top.value
  }

  /**
   * O(1)
   */
  clear() {
    this.top = undefined
    this.size = 0
  }

  /**
   * O(size - 1)
   */
  [Symbol.iterator](): Iterator<E> {
    let top = this.top
    return {
      next: () => {
        const _top = top
        top = _top?.prev
        return {
          done: _top == undefined,
          value: _top?.value!
        }
      }
    };
  }
}
