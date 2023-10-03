import { Comparator, DoublyLinkedList, FibonacciHeap, Ordering } from '../index.ts'

export interface ISortable<V> {
  sort(cmp?: Comparator<V>): void
}

function choosePivot<V>(A: DoublyLinkedList<V>): V {
  return A.get(0)
}

export function quicksort<V>(A: DoublyLinkedList<V>, comparator: Comparator<V>): DoublyLinkedList<V> {
  if (A.size <= 1) return A
  const pivot = choosePivot(A)

  const smaller = new DoublyLinkedList<V>()
  const bigger = new DoublyLinkedList<V>()

  for (const v of A) {
    if (comparator(v, pivot) === Ordering.EQ) continue
    if (comparator(v, pivot) <= Ordering.EQ) smaller.add(v)
    else bigger.add(v)
  }

  const sortedSmaller = quicksort(smaller, comparator)
  const sortedBigger = quicksort(bigger, comparator)
  const result = new DoublyLinkedList<V>(sortedSmaller)
  result.add(pivot)
  result.addAll(sortedBigger)
  return result
}

/**
 * Heapsort variant using a fibonacci heap
 *
 * @param A must have a comparator set!
 */
export function heapSort<V>(A: DoublyLinkedList<V>) {
  return new FibonacciHeap<V>(A.comparator, A)
}
