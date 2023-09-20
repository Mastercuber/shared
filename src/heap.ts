import {ICollection, CyclicDoublyLinkedList, LinkedList} from "./index";

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

// The Comparator has one requirement: When the "left" value is "null" the ordering must be Ordering.GT
// This is needed for delete to function
export type Comparator<E> = (left: E, right: E) => Ordering

export interface IFibonacciHeap<E> extends ICollection<HeapNode<E>>{
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

export class FibonacciHeap<E> implements IFibonacciHeap<E> {
  rootList!: HeapNode<E>
  minNode!: HeapNode<E>
  size = 0
  comparator: Comparator<E>
  private readonly goldenCut = (1 + Math.sqrt(5)) / 2

  constructor(comparator: Comparator<E>) {
    this.comparator = comparator
  }

  insert(e: E): HeapNode<E> {
    if (e === undefined) return undefined!
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

  delete(e: HeapNode<E>): HeapNode<E> {
    this.decreaseKey(e, null!)
    return this.extractMin()
  }

  /**
   * Decreases a nodes key. When the newValue is null or undefined, node will get the new minNode
   *
   * @param node
   * @param newValue
   */
  decreaseKey(node: HeapNode<E>, newValue: E): void {
    if (!node) throw new Error("node to decrease is null!")
    if (newValue && node && this.comparator(newValue, node.value) === Ordering.GT) {
      throw new Error("new value is greater then old one")
    }
    if ((typeof newValue !== 'number') && !newValue) {
      this.minNode = node
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

      if (this.size === 1) {
        this.minNode = this.rootList = undefined!
      } else {
        if (this.comparator(min.left.value, min.right.value) === Ordering.LT)
          this.minNode = min.left
        else
          this.minNode = min.right
        this.consolidate()
      }

      this.size--
    } else {
      throw new Error("no such element")
    }
    return min
  }

  /**
   * O(1)
   *
   * @param heap heap to merge in the current one
   */
  union(heap: IFibonacciHeap<E>): void {
    if (!this.minNode) {
      this.minNode = heap.minNode
    } else {
      this.minNode = this.comparator(this.minNode.value, heap.minNode.value) === Ordering.LT
        ? this.minNode : heap.minNode
    }

    if (!this.rootList) {
      this.rootList = heap.rootList
    } else {
      const last = heap.rootList.left
      heap.rootList.left = this.rootList.left
      this.rootList.left.right = heap.rootList
      this.rootList.left = last
      this.rootList.left.right = this.rootList
    }

    this.size = this.size + heap.size
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  clear(): void {
    this.rootList = this.minNode = undefined!
    this.size = 0
  }

  extractNeighbours(node: HeapNode<E>, includeSelf: boolean = false): CyclicDoublyLinkedList<HeapNode<E>> {
    const list = new CyclicDoublyLinkedList<HeapNode<E>>()
    includeSelf && list.add(node)
    let cursorNode = node

    while (this.comparator(cursorNode.right.value, node.value) !== Ordering.EQ) {
      list.add(cursorNode.right)
      cursorNode = cursorNode.right
    }

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
  private addToChildList(parent: HeapNode<E>, newChild: HeapNode<E>) {
    if (!parent.child) {
      newChild.left = newChild.right = newChild
      parent.child = newChild
      parent.degree = 1
    } else {
      newChild.right = parent.child
      newChild.left = parent.child.left
      parent.child.left.right = newChild
      parent.child.left = newChild
      parent.degree++
    }
    newChild.parent = parent
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
    if (node.parent) return
    if (this.comparator(node.value, this.rootList.value) === Ordering.EQ) {
      this.rootList = node.right
    }
    node.left.right = node.right
    node.right.left = node.left
  }

  private consolidate() {
    const Dh = Math.floor(this.log(this.goldenCut, this.size))
    const A = new CyclicDoublyLinkedList<HeapNode<E>>()
    for (let i = 0; i < Dh; i++) {
      A.add(null!)
    }

    const nodes = this.extractNeighbours(this.rootList, true)
    for (let w of nodes) {
      let x = w
      let d = x.degree

      while (A.get(d) != null) {
        let y = A.get(d)
        if (this.comparator(x.value, y.value) === Ordering.GT) {
          const temp = x
          x = y
          y = temp
        }
        this.heapLink(y, x)
        A.set(d, null!)
        d++
      }
      A.set(d, x)
    }

    for (let i = 0; i < A.size; i++) {
      const ai = A.get(i)
      if (ai) {
        if (this.comparator(ai.value, this.minNode.value) === Ordering.LT) {
          this.minNode = ai
        }
      }
    }
  }

  private heapLink(elementInRootList: HeapNode<E>, newParent: HeapNode<E>) {
    this.removeFromRootList(elementInRootList)
    this.addToChildList(newParent, elementInRootList)
    elementInRootList.marked = false
  }

  /**
   * Base conversion
   *
   * @param base
   * @param x value to be converted
   * @return {number}
   */
  private log(base: number, x: number): number {
    return Math.log(x) / Math.log(base)
  }


  *valuesIterator() {
    if (this.size === 0) return
    const values = new LinkedList<E>()
    while (this.size !== 0) {
      const e = this.extractMin().value
      yield e
      values.add(e)
    }
    for (let value of values) {
      this.insert(value)
    }
  }

  [Symbol.iterator](): Iterator<HeapNode<E>> {
    const heap = this
    const values = new LinkedList<E>()
    return {
      next: () => {
        if (heap.isEmpty()) {
          return {
            done: true,
            value: null
          }
        }
        const min = heap.extractMin()
        values.add(min.value)
        return {
          done: this.isEmpty() && (() => {
            for (let value of values) {
              heap.insert(value)
            }
            return true
          })(),
          value: min
        }
      }
    };
  }
}
