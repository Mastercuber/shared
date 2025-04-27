import {ISortable} from "./sort";

export enum Ordering {
  LT = -1,
  EQ = 0,
  GT = 1
}

export type Comparator<E> = (e1: E, e2: E) => Ordering

export type Node<E> = undefined | {
  value: E
  prev?: Node<E>
  next?: Node<E>
}

export function numberComparatorASC(n1: number, n2: number) {
  if (n1 === n2) return Ordering.EQ // 0
  if (n1 < n2) return Ordering.LT // -1

  return Ordering.GT // 1
}

export function numberComparatorDESC(n1: number, n2: number) {
  if (n1 === n2) return Ordering.EQ
  if (n1 < n2) return Ordering.GT
  return Ordering.LT
}

export function stringComparator(s1: string, s2: string) {
  if (s1 === s2) return Ordering.EQ
  if (s1 < s2) return Ordering.LT
  return Ordering.GT
}

export interface IReverseIterable<E> {
  reverseIterator(): Generator<E>
}

export interface ICollection<E> extends ISortable<E>, Iterable<E>, IReverseIterable<E> {
  add(e: E): void
  size: number
  isEmpty(): boolean
  clear(): void
}

export * from './stack'
export * from './queue'
export * from './list'
export * from './heap'
export * from './graph'
export * from './sort'
export * from './math'
