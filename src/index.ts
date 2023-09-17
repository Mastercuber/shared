import {Ordering} from "./heap.ts";

export interface Collection<E> extends Iterable<E> {
  size: number
  isEmpty(): boolean
  clear(): void
/*  has(e: E): boolean*/
}

export type Node<E> = undefined | {
  value: E
  prev?: Node<E>
  next?: Node<E>
}

export function numberComparator(n1: number, n2: number) {
  if (typeof n1 === 'object' && n1['__empty']) return Ordering.GT
  if (n1 === n2) return Ordering.EQ
  if (n1 < n2) return Ordering.LT
  return Ordering.GT
}

export function stringComparator(s1: string, s2: string) {
  if (s1 === s2) return Ordering.EQ
  if (s1 < s2) return Ordering.LT
  return Ordering.GT
}

// @TODO optimize for Garbage Collection
// @TODO iterators without removing elements from collection
// @TODO correct all time complexities
export * from './stack'
export * from './queue'
export * from './list'
export * from './heap'
export * from './graph'
