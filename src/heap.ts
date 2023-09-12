import {Collection, CyclicDoublyLinkedList} from "./index";

export type HeapNode<E> = {
  value: E
  degree: number
  marked: boolean
  left: HeapNode<E>
  right: HeapNode<E>
  parent?: HeapNode<E>
  child?: HeapNode<E>
}

export enum Ordering {
  LT = -1,
  EQ = 0,
  GT = 1
}

// The Comparator has one requirement: When the left value is a blank object the ordering must be Ordering.GT
export type Comparator<E> = (left: E, right: E) => Ordering

export interface IHeap<E> extends Collection<HeapNode<E>>{
  rootList: HeapNode<E>
  minNode: HeapNode<E>
  insert(element: E): HeapNode<E>
  remove(node: HeapNode<E>): HeapNode<E>
  decreaseKey(node: HeapNode<E>, newValue: E): void
  minimum(): HeapNode<E>
  extractMin(): HeapNode<E>
  union(heap: IHeap<E>): void
  extractNeighbours(node: HeapNode<E>, includeSelf?: boolean): CyclicDoublyLinkedList<HeapNode<E>>
  extractChildren(node: HeapNode<E>): CyclicDoublyLinkedList<HeapNode<E>>
}

export class FibonacciHeap<E> implements IHeap<E> {
  rootList!: HeapNode<E>
  minNode!: HeapNode<E>
  size = 0
  comparator: Comparator<E>
  private readonly goldenCut = (1 + Math.sqrt(5)) / 2

  constructor(comparator: Comparator<E>) {
    this.comparator = comparator
  }

  insert(e: E): HeapNode<E> {
    // @ts-ignore
    const node: HeapNode<E> = {
      value: e,
      degree: 0,
      marked: false
    }
    node.left = node
    node.right = node

    if (!this.minNode) {
      this.minNode = this.rootList = node
    } else {
      this.mergeWithRootList(node)
      if (this.comparator(node.value, this.minNode.value) === Ordering.LT) {
        this.minNode = node
      }
    }
    this.size++
    return node
  }

  remove(e: HeapNode<E>): HeapNode<E> {
    this.decreaseKey(e, {} as E)
    return this.extractMin()
  }

  decreaseKey(node: HeapNode<E>, newValue: E): void {
    if (newValue && this.comparator(newValue, node.value) === Ordering.GT) {
      throw new Error("new value is greater then old one")
    }
    node.value = newValue
    const parent = node.parent
    if (parent && this.comparator(node.value, parent.value) === Ordering.LT) {
      this.cut(node, parent)
      this.cascadingCut(parent)
    }
    if (this.comparator(node.value, this.minNode.value) === Ordering.LT) {
      this.minNode = node
    }
  }

  minimum(): HeapNode<E> {
    if (this.isEmpty()) throw new Error("no such element")
    return this.minNode;
  }

  extractMin(): HeapNode<E> {
    const min = this.minNode
    if (min) {
      if (min.child) {
        for (const child of this.extractChildren(min)) {
          this.mergeWithRootList(child)
          child!.parent = undefined
        }
      }

      this.removeFromRootList(min)

      if (this.comparator(min.value, min.right!.value) === Ordering.EQ) {
        this.minNode = this.rootList = undefined!
      } else {
        /*if (this.comparator(min.left.value, min.right.value) === Ordering.LT)
          this.minNode = min.left
        else
          this.minNode = min.right*/
        this.consolidate()
      }

      this.size--
    } else {
      throw new Error("no such element")
    }
    return min
  }

  union(heap: IHeap<E>): void {
    this.minNode = this.comparator(this.minNode.value, heap.minNode.value) === Ordering.LT
      ? this.minNode : heap.minNode
    const last = heap.rootList.left
    heap.rootList.left = this.rootList.left
    this.rootList.left.right = heap.rootList
    this.rootList.left = last
    this.rootList.left.right = this.rootList

    this.size = this.size + heap.size
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  clear(): void {
    this.rootList = this.minNode = undefined!
    this.size = 0
  }

  extractNeighbours(node: HeapNode<E>, includeSelf = false): CyclicDoublyLinkedList<HeapNode<E>> {
    const list = new CyclicDoublyLinkedList<HeapNode<E>>()
    includeSelf && list.add(node)
    let cursorNode = node

    do {
      list.add(cursorNode.right)
      cursorNode = cursorNode.right
    } while (this.comparator(cursorNode.right.value, node.value) !== Ordering.EQ)

    return list
  }
  extractChildren(node: HeapNode<E>): CyclicDoublyLinkedList<HeapNode<E>> {
    const nodes = new CyclicDoublyLinkedList<HeapNode<E>>()
    let _node = node.child!
    for (let i = 0; i < node.degree; i++) {
      nodes.add(_node)
      _node = _node.left
    }

    return nodes
  }

  private cut(x: HeapNode<E>, y: HeapNode<E>) {
    this.removeFromChildList(y, x)
    y.degree--
    this.mergeWithRootList(x)
    x.marked = false
  }

  private cascadingCut(y: HeapNode<E>) {
    const z = y.parent
    if (z) {
      if (!y.marked) {
        y.marked = true
      } else {
        this.cut(y, z)
        this.cascadingCut(z)
      }
    }
  }

  // sieht gut aus
  private mergeWithChildList(parent: HeapNode<E>, node: HeapNode<E>) {
    if (!parent.child) {
      parent.child = node
      parent.degree = 1
    } else {
      node.right = parent.child
      node.left = parent.child.left
      parent.child.left.right = node
      parent.child.left = node
      parent.degree++
    }
    node.parent = parent
  }

  private removeFromChildList(parent: HeapNode<E>, node: HeapNode<E>) {
    if (parent.degree === 0) return
    if (
      parent.degree === 1
      && this.comparator(node.right.value, node.value) === Ordering.EQ
    ) {
      parent.child = undefined
      parent.degree = 0
    } else {
      node.left.right = node.right
      node.right.left = node.left
      if (this.comparator(parent.child!.value, node.value) === Ordering.EQ) {
        parent.child = node.right
      }
    }
    node.parent = undefined
    node.marked = false
  }

  // sieht gut aus
  private mergeWithRootList(node: HeapNode<E>): void {
    if (!this.rootList) {
      this.rootList = node
      this.rootList.parent = this.rootList.child = undefined
      this.rootList.left = this.rootList.right = this.rootList
      this.rootList.degree = 0
      this.rootList.marked = false
    } else {
      node.right = this.rootList
      node.left = this.rootList.left
      node.parent = undefined
      this.rootList.left.right = node
      this.rootList.left = node
    }
  }

  // sieht gut aus
  private removeFromRootList(node: HeapNode<E>): void {
    if (this.comparator(node.value, this.rootList.value) === Ordering.EQ) {
      this.rootList = node.right
    }
    node.left.right = node.right
    node.right.left = node.left
  }

  private consolidate() {
    const Dh = Math.floor(this.logx(this.goldenCut, this.size))
    const A = new CyclicDoublyLinkedList<HeapNode<E>>()
    for (let i = 0; i < Dh; i++) {
      A.add(null!)
    }

    const nodes = this.extractNeighbours(this.rootList, true)
    for (let w of nodes) {
      let x = w
      let d = x.degree

      while (A.get(d) !== null) {
        let y = A.get(d)
        if (this.comparator(x.value, y.value) === Ordering.GT) {
          /*const temp = x
          x = y
          y = temp*/
          const l = x.left
          const r = x.right
          const p = x.parent
          const c = x.child
          const v = x.value
          const m = x.marked
          const d = x.degree
          x.left = y.left
          x.right = y.right
          x.parent = y.parent
          x.child = y.child
          x.value = y.value
          x.marked = y.marked
          x.degree = y.degree
          y.left = l
          y.right = r
          y.parent = p
          y.child = c
          y.value = v
          y.marked = m
          y.degree = d
        }
        this.heapLink(y, x) // prüfen
        A.set(d, null!)
        d++
      }
      A.set(d, x)
    }

    this.minNode = undefined!
    for (let i = 0; i < Dh; i++) {
      const ai = A.get(i)
      if (ai) {
        if (!this.minNode) {
          this.rootList = ai
          /*this.rootList.left = this.rootList.right = ai
          this.rootList.parent = this.rootList.child = undefined
          this.rootList.degree = 0
          this.rootList.marked = false*/
        } else {
          this.mergeWithRootList(ai)
          if (this.comparator(ai.value, this.minNode.value) === Ordering.LT) {
            this.minNode = ai
          }
        }
      }
    }
  }

  private heapLink(elementInRootList: HeapNode<E>, newParent: HeapNode<E>) {
    this.removeFromRootList(elementInRootList)
    this.mergeWithChildList(newParent, elementInRootList)
    elementInRootList.marked = false
  }

  /**
   * Base conversion
   *
   * @param x new base
   * @param y value to be converted
   * @return {number}
   */
  private logx(x: number, y: number) {
    return Math.log(y) / Math.log(x)
  }


  *valuesIterator() {
    if (this.size === 0) return
    while (this.size !== 0) {
      yield this.extractMin().value
    }
  }

  // @TODO wie verhält es sich wenn der Heap leer ist
  [Symbol.iterator](): Iterator<HeapNode<E>> {
    const heap = this
    return {
      next: () => {
        if (heap.isEmpty()) {
          return {
            done: true,
            value: null
          }
        }
        const min = heap.extractMin()
        return {
          done: this.isEmpty(),
          value: min
        }
      }
    };
  }
}
