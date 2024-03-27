import { Comparator, heapSort, ISortable, Node, Ordering } from './index'
export interface IListFunctions<E> {
  map<V>(fn: (e: E) => V): IList<V>
  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V
  filter(predicate: (e: E) => boolean): IList<E>
  every(predicate: (e: E) => boolean): boolean
  some(predicate: (e: E) => boolean): boolean
  slice(startIndex: number, endIndex: number): IList<E>
  slice2(startIndex: number, endIndex: number): IList<E>
  splice(startIndex: number, deleteCount: number): IList<E>
}

export interface IList<E> extends ISortable<E>, Iterable<E>, IListFunctions<E> {
  comparator: Comparator<E>
  size: number
  isEmpty(): boolean
  clear(): void
  add(e: E): void
  addAll(c: Iterable<E>): void
  get(index: number): E
  set(index: number, e: E | null): boolean
  remove(index: number): E
  equals(l: IList<E>): boolean
  indexOf(e: E): number
  includes(e: E): boolean
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
  removeFirst(): E
  removeLast(): E
}

export class List<E> implements IList<E> {
  private arr: E[] = []
  size = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>) {
    if (elements) {
      for (const el of elements) {
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
  addAll(c: Iterable<E>) {
    for (const e of c) {
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

  /**
   * A positive end index will result in slicing to the right, a negative end index in slicing to the left
   * @param startIndex
   * @param endIndex
   */
  slice(startIndex: number, endIndex: number): List<E> {
    const slice = new List<E>()
    // @ts-ignore
    let {start, end} = calculateStartAndEnd.call(this, startIndex, endIndex);

    // @ts-ignore
    const count = calculateCount.call(this, start, end, true)
    for (let i = 0; i < count; i++) {
      slice.add(this.get(start % this.size))
      start++
    }

    return slice
  }

  /**
   * <p>With this variant of slice, the end index can be used as a direction value.</p>
   * <p>When the end index is negative, then it will be sliced to the left.</p>
   *
   * @param startIndex
   * @param endIndex
   */
  slice2(startIndex: number, endIndex: number): List<E> {
    const slice = new List<E>()
    if (startIndex < 0) {
    let start = (this.size + (startIndex % this.size === 0 ? -this.size : startIndex % this.size))
    if (endIndex < 0) {
      // slice to the left
      const end = (this.size + (endIndex % this.size === 0 ? -this.size : endIndex % this.size))
      // @ts-ignore
      const count = calculateCount.call(this, start, end)
      for (let i = 0; i < count; i++) {
        slice.add(this.get(start))
        start--
        if (start < 0) {
          start = this.size - 1
        }
      }
    } else {
      // slice to the right
      const end = endIndex % this.size
      // @ts-ignore
      const count = calculateCount.call(this, start, end, true)
      for (let i = 0; i < count; i++) {
        slice.add(this.get(start % this.size))
        start++
      }
    }
    } else {
      let start = startIndex % this.size
      if (endIndex < 0) {
        // slice to the left
        const end = this.size + (endIndex % this.size)
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        for (let i = 0; i < count; i++) {
          if (start < 0) {
            slice.add(this.get(this.size + start))
          } else {
            slice.add(this.get(start))
          }
          start--
        }
      } else {
        const end = endIndex % this.size
        // slice to the right
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        for (let i = 0; i < count; i++) {
          slice.add(this.get(start % this.size))
          start++
        }
      }
    }
    return slice
  }

  /**
   * <p>A negative delete count will result in slicing to the left</p>
   * <p>A negative start count will be mapped to <code>this.size - startIndex</code></p>
   * <p>f.e. (size = 6) -1 -> 5, -2 -> 4, ...</p>
   * @param startIndex
   * @param deleteCount
   */
  splice(startIndex: number, deleteCount: number): List<E> {
    // @ts-ignore
    return _splice.call(this, startIndex, deleteCount, new List<E>())
  }

  map<V>(fn: (e: E) => V): List<V> {
    const list = new List<V>()
    for (const e of this) {
      list.add(fn(e))
    }
    return list
  }

  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V {
    return this.arr.reduce(fn, initialValue || {} as V)
  }

  filter(predicate: (e: E) => boolean): List<E> {
    const list = new List<E>()
    for (const e of this) {
      if (predicate(e)) {
        list.add(e)
      }
    }
    return list
  }

  every(predicate: (e: E) => boolean): boolean {
    let all = true
    for (const e of this.arr) {
      if (!predicate(e)) {
        all = false
        break
      }
    }

    return all
  }

  some(predicate: (e: E) => boolean): boolean {
    let someMatches = false
    for (const e of this.arr) {
      if (predicate(e)) {
        someMatches = true
        break
      }
    }
    return someMatches
  }

  isEmpty(): boolean {
    return this.size === 0
  }
  clear(): void {
    this.arr.splice(0, this.arr.length)
    this.size = 0
  }

  remove(index: number): E {
    const slice = this.arr.splice(index, 1)
    if (slice.length === 1) {
      this.size--
      return slice[0]
    }
    throw new Error("no such element")
  }

  /**
   * For this method to work, a comparator must be set
   * @param e
   */
  includes(e: E): boolean {
    return this.indexOf(e) > -1
  }

  /**
   * For this method to work, a comparator must be set
   * @param l
   */
  equals(l: IList<E>): boolean {
    for (let i = 0; i < l.size; i++) {
      if (this.comparator(l.get(i), this.get(i)) !== Ordering.EQ) {
        return false
      }
    }
    return true
  }

  /**
   * Finds the first index of the element
   * @param e
   */
  indexOf(e: E): number {
    for (let i = 0; i < this.size; i++) {
      if (this.comparator(e, this.get(i)) === Ordering.EQ) return i
    }

    return -1
  }

  sort(cmp?: Comparator<E>): void {
    const backupCmp = this.comparator
    if (cmp) {
      this.comparator = cmp
    }
    this.arr.sort(this.comparator)
    this.comparator = backupCmp
  }

  *reverseIterator() {
    for (let i = this.arr.length - 1; i >= 0; i--) {
      yield this.arr[i]
    }
  }

  [Symbol.iterator](): Iterator<E> {
    let index = 0
    return {
      next: () => {
        let el
        try {
          el = this.get(index)
        } catch (e) {}
        return {
          done: index++ === this.size,
          value: el
        } as IteratorResult<E>
      }
    }
  }
}

export class LinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size: number = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>, reverse = false) {
    if (elements) {
      for (const el of elements) {
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

  addAll(c: Iterable<E>) {
    for (const e of c) {
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
    const node = { value: e }
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
    // @ts-ignore
    return _slice.call(this, startIndex, endIndex, new LinkedList<E>());
  }

  slice2(startIndex: number, endIndex: number): LinkedList<E> {
    const slice = new LinkedList<E>()
    if (startIndex < 0) {
      let start = (this.size + (startIndex % this.size === 0 ? -this.size : startIndex % this.size))
      if (endIndex < 0) {
        // slice to the left
        const end = (this.size + (endIndex % this.size === 0 ? -this.size : endIndex % this.size))
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        for (let i = 0; i < count; i++) {
          if (start < 0) {
            slice.add(this.get(this.size + start))
          } else {
            slice.add(this.get(start))
          }
          start--
        }
      } else {
        // slice to the right
        const end = endIndex % this.size
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next || this.first
          start++
        }
      }
    } else {
      let start = startIndex % this.size
      if (endIndex < 0) {
        // slice to the left
        const end = this.size + (endIndex % this.size)
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        for (let i = 0; i < count; i++) {
          if (start < 0) {
            slice.add(this.get(this.size + start))
          } else {
            slice.add(this.get(start))
          }
          start--
        }
      } else {
        const end = endIndex % this.size
        // slice to the right
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next || this.first
          start++
        }
      }
    }
    return slice
  }

  splice(startIndex: number, deleteCount: number): LinkedList<E> {
    // @ts-ignore
    return _splice.call(this, startIndex, deleteCount, new LinkedList<E>());
  }

  map<V>(fn: (e: E) => V): LinkedList<V> {
    const list = new LinkedList<V>()
    for (const e of this) {
      list.add(fn(e))
    }
    return list
  }

  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V {
    let result = initialValue || {} as V
    for (const e of this) {
      result = fn(result, e)
    }
    return result
  }

  filter(predicate: (e: E) => boolean): LinkedList<E> {
    const list = new LinkedList<E>()
    for (const e of this) {
      if (predicate(e)) {
        list.add(e)
      }
    }
    return list
  }

  every(predicate: (e: E) => boolean): boolean {
    let all = true
    for (const el of this) {
      if (!predicate(el)) {
        all = false
        break
      }
    }

    return all
  }

  some(predicate: (e: E) => boolean): boolean {
    let someMatches = false
    for (const e of this) {
      if (predicate(e)) {
        someMatches = true
        break
      }
    }
    return someMatches
  }

  /**
   * O(1)
   */
  getFirst() {
    if (!this.first) throw new Error('no such element')
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast() {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error('no such element')
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * O(size)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): E {
    if (index >= this.size || index < 0)
      throw new Error("no such element")

    let toRemove
    let value
    switch (index) {
      case 0:
        return this.removeFirst()
      case this.size - 1:
        return this.removeLast()
      case 1:
        toRemove = this.getNode(1)
        this.first!.next = toRemove.next
        value = toRemove.value
        toRemove.next = toRemove.value = undefined! // GC
        break
      default:
        const prevNode = this.getNode(index - 1)
        toRemove = prevNode?.next
        prevNode!.next = prevNode?.next?.next
        value = toRemove.value
        toRemove.next = toRemove.value = undefined! // GC
        break
    }
    this.size--
    return value
  }

  /**
   * O(1)
   */
  removeFirst(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error('no such element')
      case 1:
        const _first1 = this.first
        this.first = undefined // GC
        value = _first1!.value
        _first1!.next = _first1!.value = undefined! // GC
        break
      case 2:
        const _first2 = this.first
        this.first = this.last
        this.last = undefined // GC
        value = _first2!.value
        _first2!.next = _first2!.value = undefined! // GC
        break
      default:
        const _first3 = this.first
        this.first = {
          value: _first3!.next!.value,
          next: _first3!.next!.next
        }
        value = _first3!.value
        _first3!.next = _first3!.value = undefined! // GC
    }
    this.size--
    return value
  }

  /**
   * O(size)<br>
   * Ω(1)
   */
  removeLast(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error("no such element")
      case 1:
        const _last1 = this.first
        this.first = undefined
        value = _last1!.value
        _last1!.value = _last1!.next = undefined! // GC
        break
      case 2:
        const _last2 = this.last
        this.first!.next = this.last = undefined
        value = _last2!.value
        _last2!.value = _last2!.next = undefined! // GC
        break
      default:
        const _last3 = this.last
        this.last = this.getNode(this.size - 2)
        this.last!.next = undefined
        value = _last3!.value
        _last3!.value = _last3!.next = undefined! // GC
    }

    this.size--
    return value
  }

  /**
   * O(index + 1)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index < 0 || index >= this.size) throw new Error('no such element')
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
  includes(e: E): boolean {
    return this.indexOf(e) > -1
  }

  /**
   * For this method to work, a comparator must be set
   * @param l
   */
  equals(l: IList<E>): boolean {
    for (let i = 0; i < l.size; i++) {
      if (this.comparator(l.get(i), this.get(i)) !== Ordering.EQ) {
        return false
      }
    }
    return true
  }

  indexOf(e: E): number {
    for (let i = 0; i < this.size; i++) {
      if (this.comparator(e, this.get(i)) === Ordering.EQ) return i
    }

    return -1
  }

  sort(cmp?: Comparator<E>): void {
    const backupCmp = this.comparator
    if (cmp) {
      this.comparator = cmp
    }
    const sorted = heapSort(this, this.comparator)
    this.clear()
    for (const sortedElement of sorted) {
      this.add(sortedElement)
    }
    this.comparator = backupCmp
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
    }
  }
}

export class DoublyLinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>, reverse = false) {
    if (elements) {
      for (const el of elements) {
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

  addAll(c: Iterable<E>) {
    for (const e of c) {
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

    const node = { value: e }
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
    // @ts-ignore
    return _slice.call(this, startIndex, endIndex, new DoublyLinkedList<E>());
  }

  slice2(startIndex: number, endIndex: number): DoublyLinkedList<E> {
    const slice = new DoublyLinkedList<E>()
    if (startIndex < 0) {
      let start = (this.size + (startIndex % this.size === 0 ? -this.size : startIndex % this.size))
      if (endIndex < 0) {
        // slice to the left
        const end = (this.size + (endIndex % this.size === 0 ? -this.size : endIndex % this.size))
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.prev || this.last
        }
      } else {
        // slice to the right
        const end = endIndex % this.size
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next || this.first
          start++
        }
      }
    } else {
      let start = startIndex % this.size
      if (endIndex < 0) {
        // slice to the left
        const end = this.size + (endIndex % this.size)
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.prev || this.last
          start--
        }
      } else {
        const end = endIndex % this.size
        // slice to the right
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next || this.first
          start++
        }
      }
    }
    return slice
  }

  splice(startIndex: number, deleteCount: number): DoublyLinkedList<E> {
    // @ts-ignore
    return _splice.call(this, startIndex, deleteCount, new DoublyLinkedList<E>())
  }

  map<V>(fn: (e: E) => V): DoublyLinkedList<V> {
    const list = new DoublyLinkedList<V>()
    for (const e of this) {
      list.add(fn(e))
    }
    return list
  }

  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V {
    let result = initialValue || {} as V
    for (const e of this) {
      result = fn(result, e)
    }
    return result
  }

  filter(predicate: (e: E) => boolean): DoublyLinkedList<E> {
    const list = new DoublyLinkedList<E>()
    for (const e of this) {
      if (predicate(e)) {
        list.add(e)
      }
    }
    return list
  }

  every(predicate: (e: E) => boolean): boolean {
    let all = true
    for (const el of this) {
      if (!predicate(el)) {
        all = false
        break
      }
    }

    return all
  }

  some(predicate: (e: E) => boolean): boolean {
    let someMatches = false
    for (const e of this) {
      if (predicate(e)) {
        someMatches = true
        break
      }
    }
    return someMatches
  }

  /**
   * O(1)
   */
  getFirst(): E {
    if (!this.first) throw new Error('no such element')
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast(): E {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error('no such element')
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): E {
    if (index >= this.size || index < 0) throw new Error("no such element")
    let value
    switch (index) {
      case 0:
        return this.removeFirst()
      case this.size - 1:
        return this.removeLast()
      case 1:
        const toRemove = this.getNode(index)
        this.first!.next = toRemove!.next
        this.first!.next!.prev = this.first
        value = toRemove!.value
        toRemove!.prev = toRemove!.next = toRemove!.value = undefined! // GC
        break
      default:
        const toRemove2 = this.getNode(index)
        toRemove2!.prev!.next = toRemove2!.next
        toRemove2!.next!.prev = toRemove2!.prev
        value = toRemove2!.value
        toRemove2!.next = toRemove2!.prev = toRemove2!.value = undefined! // GC
    }

    this.size--
    return value
  }

  /**
   * O(1)
   */
  removeFirst(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error('no such element')
      case 1:
        const _first1 = this.first
        this.first = undefined
        value = _first1!.value
        _first1!.value = _first1!.next = _first1!.prev = undefined! // GC
        break
      case 2:
        const _first2 = this.first
        this.first = this.last
        this.first!.next = this.first!.prev = undefined
        this.last = undefined
        value = _first2!.value
        _first2!.value = _first2!.next = _first2!.prev = undefined! // GC
        break
      default:
        const _first3 = this.first
        this.first = {
          value: this.first!.next!.value,
          next: this.first!.next!.next
        }
        this.first.next!.prev = this.first
        value = _first3!.value
        _first3!.value = _first3!.next = _first3!.prev = undefined! // GC
    }
    this.size--
    return value
  }

  /**
   * O(1)
   */
  removeLast(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error("no such element")
      case 1:
        value = this.first!.value
        this.first = this.first!.value = undefined! // GC
        break
      case 2:
        value = this.last!.value
        this.first!.next = this.last = this.last!.prev = undefined // GC
        break
      default:
        value = this.last!.value
        this.last = this.getNode(this.size - 2)
        this.last!.next = this.last!.next!.prev = undefined // GC
    }

    this.size--
    return value
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index >= this.size || index < 0) throw new Error('no such element')
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
  includes(e: E): boolean {
    return this.indexOf(e) > -1
  }

  /**
   * For this method to work, a comparator must be set
   * @param l
   */
  equals(l: IList<E>): boolean {
    for (let i = 0; i < l.size; i++) {
      if (this.comparator(l.get(i), this.get(i)) !== Ordering.EQ) {
        return false
      }
    }
    return true
  }

  indexOf(e: E): number {
    for (let i = 0; i < this.size; i++) {
      if (this.comparator(e, this.get(i)) === Ordering.EQ) return i
    }

    return -1
  }

  sort(cmp?: Comparator<E>): void {
    const backupCmp = this.comparator
    if (cmp) {
      this.comparator = cmp
    }
    const sorted = heapSort(this, this.comparator)
    this.clear()
    for (const sortedElement of sorted) {
      this.add(sortedElement)
    }
    this.comparator = backupCmp
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
    }
  }
}

export class CyclicDoublyLinkedList<E> implements ILinkedList<E> {
  first: Node<E>
  last: Node<E>
  size = 0
  comparator: Comparator<E> = null!

  constructor(elements?: Iterable<E>, reverse = false) {
    if (elements) {
      for (const el of elements) {
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

  addAll(c: Iterable<E>) {
    for (const e of c) {
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
    if (oldFirst) {
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

    const node = { value: e }
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
    // @ts-ignore
    return _slice.call(this, startIndex, endIndex, new CyclicDoublyLinkedList<E>());
  }

  slice2(startIndex: number, endIndex: number): CyclicDoublyLinkedList<E> {
    const slice = new CyclicDoublyLinkedList<E>()
    if (startIndex < 0) {
      const start = (this.size + (startIndex % this.size === 0 ? -this.size : startIndex % this.size))
      if (endIndex < 0) {
        // slice to the left
        const end = (this.size + (endIndex % this.size === 0 ? -this.size : endIndex % this.size))
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.prev
        }
      } else {
        // slice to the right
        const end = endIndex % this.size
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next
        }
      }
    } else {
      const start = startIndex % this.size
      if (endIndex < 0) {
        // slice to the left
        const end = this.size + (endIndex % this.size)
        // @ts-ignore
        const count = calculateCount.call(this, start, end)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.prev
        }
      } else {
        const end = endIndex % this.size
        // slice to the right
        // @ts-ignore
        const count = calculateCount.call(this, start, end, true)
        let startNode = this.getNode(start)
        for (let i = 0; i < count; i++) {
          slice.add(startNode?.value!)
          startNode = startNode?.next
        }
      }
    }
    return slice
  }

  splice(startIndex: number, deleteCount: number): CyclicDoublyLinkedList<E> {
    // @ts-ignore
    return _splice.call(this, startIndex, deleteCount, new CyclicDoublyLinkedList<E>())
  }

  map<V>(fn: (e: E) => V): CyclicDoublyLinkedList<V> {
    const list = new CyclicDoublyLinkedList<V>()
    for (const e of this) {
      list.add(fn(e))
    }
    return list
  }

  reduce<V>(fn: (accumulator: V, element: E) => V, initialValue?: V): V {
    let result = initialValue || {} as V
    for (const e of this) {
      result = fn(result, e)
    }
    return result
  }

  filter(predicate: (e: E) => boolean): CyclicDoublyLinkedList<E> {
    const list = new CyclicDoublyLinkedList<E>()
    for (const e of this) {
      if (predicate(e)) {
        list.add(e)
      }
    }
    return list
  }

  every(predicate: (e: E) => boolean): boolean {
    let all = true
    for (const el of this) {
      if (!predicate(el)) {
        all = false
        break
      }
    }

    return all
  }

  some(predicate: (e: E) => boolean): boolean {
    let someMatches = false
    for (const e of this) {
      if (predicate(e)) {
        someMatches = true
        break
      }
    }
    return someMatches
  }

  /**
   * O(1)
   */
  getFirst(): E {
    if (!this.first) throw new Error('no such element')
    return this.first.value
  }

  /**
   * O(1)
   */
  getLast(): E {
    if (this.size === 1) return this.first!.value
    if (!this.last) throw new Error('no such element')
    return this.last.value
  }

  /**
   * O(1)
   */
  isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  remove(index: number): E {
    if (index >= this.size || index < 0) throw new Error("no such element")

    let value
    switch (index) {
      case 0:
        return this.removeFirst()
      case this.size - 1:
        return this.removeLast()
      case 1:
        const toRemove = this.getNode(index)
        this.first!.next = toRemove!.next
        this.first!.next!.prev = this.first
        value = toRemove!.value
        toRemove!.next = toRemove!.prev = toRemove!.value = undefined! // GC
        break
      default:
        const toRemove2 = this.getNode(index)
        toRemove2!.prev!.next = toRemove2!.next
        toRemove2!.next!.prev = toRemove2!.prev
        value =  toRemove2!.value
        toRemove2!.next = toRemove2!.prev = toRemove2!.value = undefined! // GC
    }
    this.size--
    return value
  }

  /**
   * O(1)
   */
  removeFirst(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error("no such element")
      case 1:
        const _first1 = this.first
        this.first = undefined // GC
        value = _first1!.value
        _first1!.value = _first1!.next = _first1!.prev = undefined! // GC
        break
      case 2:
        const _first2 = this.first
        this.last!.next = this.last!.prev = undefined // GC
        this.first = this.last
        this.last = undefined // GC
        this.first!.next = this.first!.prev = this.first
        value = _first2!.value
        _first2!.value = _first2!.next = _first2!.prev = undefined! // GC
        break
      default:
        const _first3 = this.first
        this.first = {
          value: _first3!.next!.value,
          next: _first3!.next!.next,
          prev: _first3!.next!.prev
        }
        this.first.next!.prev = this.first
        value = _first3!.value
        _first3!.prev = _first3!.next = _first3!.value = undefined! // GC
    }

    this.size--
    return value
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   */
  removeLast(): E {
    let value
    switch (this.size) {
      case 0:
        throw new Error("no such element")
      case 1:
        value = this.first!.value
        this.first!.value = this.first!.next = this.first!.prev = undefined! // GC
        this.first  = undefined// GC
        break
      case 2:
        value = this.last!.value
        this.last!.prev = this.last!.next = this.last!.value = undefined! // GC
        this.last = undefined // GC
        this.first!.prev = this.first
        this.first!.next = this.first
        break
      default:
        const _last3 = this.last
        value = _last3!.value
        this.last = this.getNode(this.size - 2)
        this.last!.next = this.first
        _last3!.value = _last3!.next = _last3!.prev = undefined! // GC
    }

    this.size--
    return value
  }

  /**
   * O(size / 2)<br>
   * Ω(1)
   * @param index
   */
  getNode(index: number): Node<E> {
    if (index >= this.size || index < 0) throw new Error('no such element')
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
  includes(e: E): boolean {
    return this.indexOf(e) > -1
  }

  /**
   * For this method to work, a comparator must be set
   * @param l
   */
  equals(l: IList<E>): boolean {
    for (let i = 0; i < l.size; i++) {
      if (this.comparator(l.get(i), this.get(i)) !== Ordering.EQ) {
        return false
      }
    }
    return true
  }

  indexOf(e: E): number {
    for (let i = 0; i < this.size; i++) {
      if (this.comparator(e, this.get(i)) === Ordering.EQ) return i
    }

    return -1
  }

  sort(cmp?: Comparator<E>): void {
    const backupCmp = this.comparator
    if (cmp) {
      this.comparator = cmp
    }
    const sorted = heapSort(this, this.comparator)
    this.clear()
    for (const sortedElement of sorted) {
      this.add(sortedElement)
    }
    this.comparator = backupCmp
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
    }
  }
}


/**
 * <p>Calculates the element count from a start to an end index on a list in a specified direction.</p>
 * <p>Start and end must be in the interval [0,this.size-1] (x mod this.size)</p>
 * @param start startIndex
 * @param end endIndex
 * @param right count to the right (default: false)
 */
function calculateCount<E>(this: IList<E>, start: number, end: number, right = false): number {
  if (start === end) return 1
  if (right) {
    if (start < end) {
      return end - start + 1
    }
    return this.size - start + end + 1
  }
  if (start < end) {
    return this.size - (end - start) + 1
  }
  return start - end + 1
}

function calculateStartAndEnd<E>(this: IList<E>, startIndex: number, endIndex: number) {
  let start, end
  if (startIndex < 0)
    start = this.size + (startIndex % this.size)
  else
    start = startIndex % this.size
  if (endIndex < 0)
    end = this.size + (endIndex % this.size)
  else
    end = endIndex % this.size
  return {start, end};
}

function _splice<E>(this: IList<E>, startIndex: number, deleteCount: number, slice: IList<E>): IList<E> {
  if (deleteCount === 0) return slice
  const deleteC = deleteCount % this.size
  const size = this.size
  let start = startIndex < 0 ?
    this.size + (startIndex % this.size === 0 ? -this.size : startIndex % this.size)
    : startIndex % this.size

  if (deleteCount < 0) {
    let toIndex = Math.abs(deleteCount)
    if (deleteCount === -this.size || (deleteCount < -this.size && deleteC === 0)) {
      toIndex = size
    }

    // slice and remove to the left
    for (let i = 0, j = start; i < toIndex; i++, j--) {
      if (j < 0) {
        slice.add(this.remove(this.size - 1))
        j = this.size
      } else {
        slice.add(this.remove(j))
      }
    }
    this.size -= slice.size
    slice.comparator = this.comparator
    return slice
  }

  let toIndex = Math.abs(deleteC) + start
  if (deleteCount === this.size || (deleteCount > this.size && deleteC === 0)) {
    toIndex = size + start
  }

  // slice and remove to the right
  for (let i = start; i < toIndex; i++) {
    slice.add(this.remove(start % this.size))
    if (this.size < start) {
      start--
    }
  }
  return slice
}

function _slice<E>(this: ILinkedList<E>, startIndex: number, endIndex: number, slice: ILinkedList<E>) {
  // @ts-ignore
  let {start, end} = calculateStartAndEnd.call(this, startIndex, endIndex);
  // @ts-ignore
  const count = calculateCount.call(this, start, end, true)
  let startNode = this.getNode(start)
  for (let i = 0; i < count; i++) {
    slice.add(startNode?.value!)
    startNode = startNode?.next || this.first
    start++
  }
  return slice
}
