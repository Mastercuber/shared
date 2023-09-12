export interface Collection<E> extends Iterable<E> {
  size: number
  isEmpty(): boolean
  clear(): void
}

export type Node<E> = undefined | {
  value: E
  prev?: Node<E>
  next?: Node<E>
}

// @TODO optimize for Garbage Collection
// @TODO iterators without removing elements from collection
export * from './stack'
export * from './queue'
export * from './list'
export * from './heap'
