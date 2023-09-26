import {ICollection, Collection, Node, Ordering, Comparator, ISortable} from "./index";

export interface IList<E> extends ICollection<E>, ISortable<E> {
  add(e: E): void
  addAll(c: ICollection<E>): void
  get(index: number): E
  set(index: number, e: E | null): boolean
  slice(startIndex: number, endIndex: number): IList<E>
  remove(index: number): boolean
  contains(e: E): boolean
  comparator: Comparator<E>
  reverseIterator(): Generator<E>
}
export interface ILinkedList<E> extends IList<E> {
  first: Node<E>
  last: Node<E>
  getNode(index: number): Node<E>
  addFirst(e: E): void
  addLast(e: E): void
  getFirst(): E
  getLast(): E
  removeFirst(): boolean
  removeLast(): boolean
}

export class List<E> implements IList<E> {
  private arr: E[] = []
  size = 0;
  comparator: Comparator<E> = null!

  constructor(collection?: Collection<E>) {
    if (collection) {
      for (let el of collection) {
        this.add(el)
      }
    }
  }

  add(e: E): void {
    if (e !== undefined) {
      this.arr.push(e)
      this.size++
    }
  }
  addAll(c: ICollection<E>) {
    for (let e of c) {
      this.add(e)
    }
  }
  get(index: number): E {
    return this.arr[index]
  }

  set(index: number, e: E): boolean {
    if (index < 0 || index >= this.size || e === undefined) return false
    this.arr[index] = e
    return true
  }

  slice(startIndex: number, endIndex: number): List<E> {
    const slice = new List<E>()
    for (let i = startIndex; i <= endIndex; i++) {
      slice.add(this.get(i))
    }
    return slice;
  }

  clear(): void {
    this.arr.splice(0, this.arr.length)
    this.size = 0
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  remove(index: number): boolean {
    const removedSomething = this.arr.splice(index, 1).length !== 0;
    if (removedSomething) {
      this.size--
      return true
    }

    return false
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false;
  }

  sort(cmp: Comparator<E>): void {
    this.arr.sort(cmp)
  }

  *reverseIterator() {
    for (let i = this.arr.length - 1; i >= 0; i--) {
      yield this.arr[i]
    }
  }

  [Symbol.iterator](): Iterator<E> {
    const list = this
    let index = 0
    return {
      next: () => {
        let el
        try {
          el = list.get(index)
        } catch (e) {}
        return {
          done: index++ === list.size,
          value: el!
        }
      }
    };
  }
}

export class LinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size: number = 0
  comparator: Comparator<E> = null!

  constructor(collection?: Collection<E>, reverse = false) {
    if (collection) {
      for (let el of collection) {
        if (reverse) this.addFirst(el)
        else this.add(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  add(e: E): void {
    this.addLast(e)
  }

  addAll(c: ICollection<E>) {
    for (let e of c) {
      this.add(e)
    }
  }

  /**
   * O(1)
   * @param e
   */
  addFirst(e: E): void {
    if (e === undefined) return
    this.first = {
      value: e,
      next: this.first
    }
    if (this.size === 1) {
      this.last = this.first.next
    }
    this.size++
  }

  /**
   * O(1)
   * @param e
   */
  addLast(e: E): void {
    if (e === undefined) return
    const node = {
      value: e
    };
    if (!this.first) {
      this.first = node
    } else if (this.first && !this.last) {
      this.last = node
      this.first.next = this.last
    } else if (this.last) {
      this.last.next = node
      this.last = this.last.next
    }
    this.size++
  }

  /**
   * O(1)
   */
  clear(): void {
    this.first = this.last = undefined
    this.size = 0
  }

  /**
   * O(size)<br>
   * Ω(1)
   */
  get(index: number): E {
    try {
      const node = this.getNode(index)
      if (node) {
        return node.value
      }
    } catch (e) {}
    return undefined!
  }

  /**
   * O(size)<br>
   * Ω(1)
   */
  set(index: number, e: E): boolean {
    if (index < 0 || index >= this.size || e === undefined) return false
    this.getNode(index)!.value = e
    return true
  }

  slice(startIndex: number, endIndex: number): LinkedList<E> {
    const slice = new LinkedList<E>()
    for (let i = startIndex; i <= endIndex; i++) {
      slice.add(this.get(i))
    }
    return slice;
  }

  /**
   * O(1)
   */
  getFirst() {
    if (!this.first) throw new Error("no such element")
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast() {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error("no such element")
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * O(size)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): boolean {
    if (index >= this.size || index < 0) return false

    if (index === 0) {
      return this.removeFirst()
    }

    if (this.size === 2) {
      this.last = this.first!.next = undefined
    } else {
      // size >= 3
      if (index === 1) {
        const toRemove = this.getNode(index)
        this.first!.next = toRemove!.next
        this.first!.next!.prev = this.first
      } else if (index === this.size - 1) {
        return this.removeLast()
      } else {
        const prevNode = this.getNode(index - 1)
        prevNode!.next = prevNode?.next?.next
      }
    }

    this.size--
    return true
  }

  /**
   * O(1)
   */
  removeFirst(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first = undefined
        break
      case 2:
        this.first = this.last
        this.last = undefined
        break
      default:
        this.first = {
          value: this.first!.next!.value,
          next: this.first!.next!.next
        }
    }

    this.size--
    return true;
  }

  /**
   * O(size)<br>
   * Ω(1)
   */
  removeLast(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first = undefined
        break
      case 2:
        this.first!.next = this.last = undefined
        break
      default:
        this.last = this.getNode(this.size - 2)
        this.last!.next = undefined
    }

    this.size--
    return true;
  }

  /**
   * O(index + 1)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index < 0 || index >= this.size) throw new Error("no such element")
    let node = this.first
    for (let i = 0; i < index; i++) {
      node = node!.next
    }
    return node
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false;
  }

  sort(cmp: Comparator<E>): void {
    cmp(null!, null!)
  }

  /**
   * O(∑ i=1 to size (i))
   * Ω(1)
   */
  *reverseIterator() {
    for (let i = this.size - 1; i >= 0 ; i--) {
      yield this.getNode(i)!.value
    }
  }

  /**
   * O(size)
   */
  [Symbol.iterator](): Iterator<E> {
    let first = this.first
    return {
      next: () => {
        return {
          done: first === undefined,
          value: (() => {
            if (first) {
              const val = first.value
              first = first.next
              return val
            }
            return undefined!
          })()
        }
      }
    };
  }
}

export class DoublyLinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size = 0
  comparator: Comparator<E> = null!

  constructor(collection?: Collection<E>, reverse = false) {
    if (collection) {
      for (let el of collection) {
        if (reverse) this.addFirst(el)
        else this.add(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  add(e: E): void {
    this.addLast(e)
  }

  addAll(c: ICollection<E>) {
    for (let e of c) {
      this.add(e)
    }
  }

  /**
   * O(1)
   * @param e
   */
  addFirst(e: E): void {
    if (e === undefined) return

    const oldFirst = this.first
    this.first = {
      value: e,
      next: oldFirst
    }
    if (this.first.next) {
      this.first.next.prev = this.first
    }
    if (this.size === 1) {
      this.last = this.first.next
      this.last!.prev = this.first
    }
    this.size++
  }

  /**
   * O(1)
   * @param e
   */
  addLast(e: E): void {
    if (e === undefined) return

    const node = {
      value: e
    };
    if (!this.first) {
      this.first = node
    } else if (this.first && !this.last) {
      this.last = node
      this.first.next = this.last
      this.last.prev = this.first
    } else if (this.last) {
      const oldLast = this.last
      this.last.next = node
      this.last = node
      this.last.prev = oldLast
    }
    this.size++
  }

  /**
   * O(1)
   */
  clear(): void {
    this.first = this.last = undefined
    this.size = 0
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  get(index: number): E {
    try {
      const node = this.getNode(index)
      if (node) {
        return node.value
      }
    } catch (e) {}
    return undefined!
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   * @param e
   */
  set(index: number, e: E): boolean {
    if (index < 0 || index >= this.size || e === undefined) return false
    this.getNode(index)!.value = e
    return true
  }

  slice(startIndex: number, endIndex: number): DoublyLinkedList<E> {
    const slice = new DoublyLinkedList<E>()
    for (let i = startIndex; i <= endIndex; i++) {
      slice.add(this.get(i))
    }
    return slice;
  }

  /**
   * O(1)
   */
  getFirst(): E {
    if (!this.first) throw new Error("no such element")
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast(): E {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error("no such element")
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): boolean {
    if (index >= this.size || index < 0) return false

    if (index === 0) {
      return this.removeFirst()
    }

    if (this.size === 2) {
      this.last!.next = this.last!.prev = undefined // GC
      this.last = undefined
      this.first!.next = this.first!.prev = undefined
    } else {
      if (index === 1) {
        const toRemove = this.getNode(index)
        this.first!.next = toRemove!.next
        this.first!.next!.prev = this.first
      } else if (index === this.size - 1) {
        return this.removeLast()
      } else {
        const toRemove = this.getNode(index)
        toRemove!.prev!.next = toRemove!.next
        toRemove!.next!.prev = toRemove!.prev
        toRemove!.next = toRemove!.prev = undefined // GC
      }
    }

    this.size--
    return true
  }

  /**
   * O(1)
   */
  removeFirst(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first = undefined
        break
      case 2:
        this.first = this.last
        this.first!.next = this.first!.prev = undefined
        this.last = undefined
        break
      default:
        this.first = {
          value: this.first!.next!.value,
          next: this.first!.next!.next
        }
        this.first.next!.prev = this.first
    }

    this.size--
    return true;
  }

  /**
   * O(1)
   */
  removeLast(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first = undefined
        break
      case 2:
        this.first!.next = this.last = this.last!.prev = undefined
        break
      default:
        this.last = this.getNode(this.size - 2)
        this.last!.next = undefined
    }

    this.size--
    return true;
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index >= this.size || index < 0) throw new Error("no such element")
    let node = this.first
    if (index > this.size / 2) {
      // start from last
      node = this.last
      for (let i = this.size - 1; i > index; i--) {
        node = node!.prev
      }
    } else {
      // start from first
      for (let i = 0; i < index; i++) {
        node = node!.next
      }
    }

    return node
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false;
  }

  sort(cmp: Comparator<E>): void {
    cmp(null!, null!)
  }

  /**
   * In even cases: O(∑ i=1 to &lfloor;size&divide;2&rfloor; (i*2))<br>
   * In odd cases: O((∑ i=1 to &lfloor;size&divide;2&rfloor; (i*2)) + &lceil;size&divide;2&rceil;)<br>
   * Ω(1)
   */
  *reverseIterator() {
    for (let i = this.size - 1; i >= 0 ; i--) {
      yield this.getNode(i)!.value
    }
  }

  /**
   * O(size)
   */
  [Symbol.iterator](): Iterator<E> {
    let first = this.first
    return {
      next: () => {
        return {
          done: first === undefined,
          value: (() => {
            if (first) {
              const val = first.value
              first = first.next
              return val
            }
            return undefined!
          })()
        }
      }
    };
  }
}

export class CyclicDoublyLinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size = 0;
  comparator: Comparator<E> = null!

  constructor(collection?: Collection<E>, reverse = false) {
    if (collection) {
      for (let el of collection) {
        if (reverse) this.addFirst(el)
        else this.add(el)
      }
    }
  }

  /**
   * O(1)
   * @param e
   */
  add(e: E): void {
    this.addLast(e)
  }

  addAll(c: ICollection<E>) {
    for (let e of c) {
      this.add(e)
    }
  }

  /**
   * O(1)
   * @param e
   */
  addFirst(e: E): void {
    if (e === undefined) return

    const oldFirst = this.first
    this.first = {
      value: e,
      next: oldFirst,
      prev: this.last
    }
    if (oldFirst){
      oldFirst.prev = this.first
    } else {
      this.first.next = this.first
    }
    if (!this.first.prev) {
      this.first.prev = this.first
    } else {
      this.last!.next = this.first
    }

    if (this.size === 1) {
      this.last = this.first.next
      this.last!.prev = this.first
    }
    this.size++
  }

  /**
   * O(1)
   * @param e
   */
  addLast(e: E): void {
    if (e === undefined) return

    const node = {
      value: e
    };
    if (!this.first) {
      this.first = node
      this.first.next = this.first.prev = this.first
    } else if (this.first && !this.last) {
      this.last = node
      this.last.prev = this.last.next = this.first
      this.first.next = this.first.prev = this.last
    } else if (this.last) {
      const oldLast = this.last
      this.last.next = node
      this.last = node
      this.last.prev = oldLast
      this.last.next = this.first
      this.first.prev = this.last
    }
    this.size++
  }

  /**
   * O(1)
   */
  clear(): void {
    this.first = this.last = undefined
    this.size = 0
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  get(index: number): E {
    try {
      const node = this.getNode(index)
      if (node) {
        return node.value
      }
    } catch (e) {}
    return undefined!
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   * @param e
   */
  set(index: number, e: E): boolean {
    if (index < 0 || index >= this.size || e === undefined) return false
    this.getNode(index)!.value = e
    return true
  }

  slice(startIndex: number, endIndex: number): CyclicDoublyLinkedList<E> {
    const slice = new CyclicDoublyLinkedList<E>()
    for (let i = startIndex; i <= endIndex; i++) {
      slice.add(this.get(i))
    }
    return slice;
  }

  /**
   * O(1)
   */
  getFirst(): E {
    if (!this.first) throw new Error("no such element")
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast(): E {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error("no such element")
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): boolean {
    if (index >= this.size || index < 0) return false

    if (index === 0) {
      return this.removeFirst()
    }

    if (this.size === 2) {
      this.last!.next = this.last!.prev = undefined // GC
      this.last = undefined
      this.first!.next = this.first!.prev = this.first
    } else {
      if (index === 1) {
        const toRemove = this.getNode(index)
        this.first!.next = toRemove!.next
        this.first!.next!.prev = this.first
        toRemove!.next = toRemove!.prev = undefined // GC
      } else if (index === this.size - 1) {
        return this.removeLast()
      } else {
        const toRemove = this.getNode(index)
        toRemove!.prev!.next = toRemove!.next
        toRemove!.next!.prev = toRemove!.prev
        toRemove!.next = toRemove!.prev = undefined // GC
      }
    }

    this.size--
    return true
  }

  /**
   * O(1)
   */
  removeFirst(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first!.next = this.first!.prev = undefined // GC
        this.first = undefined
        break
      case 2:
        this.last!.next = this.last!.prev = undefined
        this.first = this.last
        this.last = undefined
        this.first!.next = this.first!.prev = this.first
        break
      default:
        this.first = {
          value: this.first!.next!.value,
          next: this.first!.next!.next,
          prev: this.first!.next!.prev
        }
        this.first.next!.prev = this.first
    }

    this.size--
    return true;
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   */
  removeLast(): boolean {
    switch (this.size) {
      case 0:
        return false
      case 1:
        this.first!.next = this.first!.prev = undefined // GC
        this.first = undefined
        break
      case 2:
        this.last!.prev = this.last!.next = undefined // GC
        this.last = undefined
        this.first!.prev = this.first
        this.first!.next = this.first
        break
      default:
        this.last = this.getNode(this.size - 2)
        this.last!.next = this.first
    }

    this.size--
    return true;
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index >= this.size || index < 0) throw new Error("no such element")
    let node = this.first
    if (index > this.size / 2) {
      // start from last
      node = this.last
      for (let i = this.size - 1; i > index; i--) {
        node = node?.prev
      }
    } else {
      // start from first
      for (let i = 0; i < index; i++) {
        node = node?.next
      }
    }

    return node
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  contains(e: E): boolean {
    for (const _e of this) {
      if (this.comparator(e, _e) === Ordering.EQ) return true
    }
    return false;
  }

  sort(cmp: Comparator<E>): void {
    cmp(null!, null!)
  }

  /**
   * In even cases: O(∑ i=1 to &lfloor;size&divide;2&rfloor; (i*2))<br>
   * In odd cases: O((∑ i=1 to &lfloor;size&divide;2&rfloor; (i*2)) + &lceil;size&divide;2&rceil;)<br>
   * Ω(1)
   */
  *reverseIterator() {
    for (let i = this.size - 1; i >= 0 ; i--) {
      yield this.getNode(i)!.value
    }
  }

  /**
   * O(size)
   */
  [Symbol.iterator](): Iterator<E> {
    let first = this.first
    let i = this.size - 1
    return {
      next: () => {
        return {
          done: i === -1,
          value: (() => {
            if (first && i >= 0) {
              const val = first.value
              first = first.next
              i--
              return val
            }
            return undefined!
          })()
        }
      }
    };
  }
}
