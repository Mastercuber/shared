import { Comparator, FibonacciHeap, IList, Ordering } from '../index.ts'

export interface ISortable<V> {
  sort(cmp?: Comparator<V>): void
}

function choosePivot<V>(A: IList<V>): V {
  return A.get(Math.floor(A.size / 2))
}

export function quicksort<V>(A: IList<V>, comparator: Comparator<V>): IList<V> {
  if (A.size <= 1) return A
  const pivot = choosePivot(A)

  const smaller = A.splice(0, 0)
  const bigger = A.splice(0, 0)

  for (const v of A) {
    if (comparator(v, pivot) === Ordering.EQ) continue
    if (comparator(v, pivot) < Ordering.EQ) smaller.add(v)
    else bigger.add(v)
  }

  const sortedSmaller = quicksort(smaller, comparator)
  const sortedBigger = quicksort(bigger, comparator)
  const result = A.splice(0, 0)
  result.addAll(sortedSmaller)
  result.add(pivot)
  result.addAll(sortedBigger)
  return result
}

/**
 * Heapsort variant using a fibonacci heap
 *
 * @param A must have a comparator set!
 * @param comparator
 */
export function heapSort<V>(A: IList<V>, comparator: Comparator<V>) {
  return new FibonacciHeap<V>(comparator, A)
}
