import {Comparator, FibonacciHeap, ICollection, IList} from '../index.ts'

export interface ISortable<V> {
  sort(cmp?: Comparator<V>): void
}

export function quicksort<V>(
  collection: ICollection<V>,
  comparator: Comparator<V>,
  factory: () => ICollection<V>
): ICollection<V> {
  if (collection.size <= 1) return collection

  const iterator = collection[Symbol.iterator]()
  const pivot = iterator.next().value

  const smaller = factory()
  const bigger = factory()

  for (const v of collection) {
    if (v === pivot) continue // Skip pivot itself (optional behavior)
    const cmp = comparator(v, pivot)
    if (cmp < 0) smaller.add(v)
    else bigger.add(v)
  }

  const sortedSmaller = quicksort(smaller, comparator, factory)
  const sortedBigger = quicksort(bigger, comparator, factory)

  const result = factory()
  for (const v of sortedSmaller) result.add(v)
  result.add(pivot)
  for (const v of sortedBigger) result.add(v)

  return result
}


/**
 * Heapsort variant using a fibonacci heap
 *
 * @param A must have a comparator set!
 * @param comparator
 */
export function heapSort<V>(A: Iterable<V>, comparator: Comparator<V>) {
  return new FibonacciHeap<V>(comparator, A)
}
