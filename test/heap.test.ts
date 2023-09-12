import {beforeAll, beforeEach, describe, expect, it} from "vitest";
import {FibonacciHeap, Ordering} from "../src";

describe("fibonacci heap", () => {
  let heap: FibonacciHeap<number>
  beforeAll(() => {
    const comparator = (n1: number, n2: number) => {
      if (typeof n1 === 'object') {
        return Ordering.GT
      }
      if (n1 === n2) return Ordering.EQ
      else if (n1 < n2) return Ordering.LT
      return Ordering.GT
    }
    heap = new FibonacciHeap<number>(comparator)
  })
  beforeEach(() => heap.clear())

  it('should create an empty heap', () => {
    expect(heap).not.toBeNull
  });
  describe("extract correct values", () => {
    it('should return correct values (bit bigger heap)', () => {
      heap.insert(-10)
      heap.insert(0)
      heap.insert(-20)
      heap.insert(-30)
      heap.insert(10)
      heap.insert(20)
      heap.insert(30)
      heap.insert(-40)
      heap.insert(40)
      heap.insert(-50)
      heap.insert(50)
      expect(heap.size).toBe(11)
      expect(heap.extractMin().value).toBe(-50)
      expect(heap.extractMin().value).toBe(-40)
      expect(heap.extractMin().value).toBe(-30)
      expect(heap.extractMin().value).toBe(-20)
      expect(heap.extractMin().value).toBe(-10)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.extractMin().value).toBe(10)
      expect(heap.extractMin().value).toBe(20)
      expect(heap.extractMin().value).toBe(30)
      expect(heap.size).toBe(0)
    });
    it('should return the correct values', () => {
      heap.insert(0)
      heap.insert(1)
      heap.insert(2)
      expect(heap.size).toBe(3)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.extractMin().value).toBe(1)
      expect(heap.extractMin().value).toBe(2)
      expect(heap.size).toBe(0)

      heap.insert(-1)
      heap.insert(0)
      heap.insert(-2)
      expect(heap.size).toBe(3)
      expect(heap.extractMin().value).toBe(-2)
      expect(heap.extractMin().value).toBe(-1)
      expect(heap.extractMin().value).toBe(0)
      expect(heap.size).toBe(0)

      heap.insert(-1) // {-1}
      heap.insert(1) // {-1, 1}
      expect(heap.extractMin().value).toBe(-1) // {1}
      heap.insert(-1) // {-1, 1}
      heap.insert(2) // {-1, 1, 2}
      expect(heap.extractMin().value).toBe(-1) // {1, 2}
      heap.insert(10) // {1, 2, 10}
      expect(heap.extractMin().value).toBe(1) // {2, 10}
      heap.insert(-10) // {-10, 2, 10}
      expect(heap.extractMin().value).toBe(-10) // {2, 10}
      expect(heap.extractMin().value).toBe(2) // {10}
      expect(heap.extractMin().value).toBe(10) // {}
    });
  })

  it('should have the correct size', () => {
    expect(() => heap.extractMin()).toThrowError("no such element")
    expect(heap.size).toBe(0)
    expect(heap.isEmpty()).toBeTruthy()

    heap.insert(0)
    expect(heap.size).toBe(1)
    expect(heap.isEmpty()).toBeFalsy()

    heap.insert(-1)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(2)


    heap.insert(-2)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(3)

    heap.insert(1)
    expect(heap.isEmpty()).toBeFalsy()
    expect(heap.size).toBe(4)
  });

  it('should clear the heap', () => {
    heap.insert(1)
    heap.insert(2)
    heap.insert(3)
    heap.insert(4)

    expect(heap.minNode).not.toBeUndefined
    expect(heap.rootList).not.toBeUndefined

    expect(heap.size).toBe(4)
    heap.clear()
    expect(heap.size).toBe(0)
    expect(heap.minNode).toBeUndefined()
    expect(heap.rootList).toBeUndefined()
    expect(typeof heap.comparator).toBe('function')
  });

  it.skip('should correctly iterate through the heap', () => {
    let e = [-100, -10, -1, 0, 1, 10, 100]
    heap.insert(0)
    heap.insert(1)
    heap.insert(-1)
    heap.insert(10)
    heap.insert(-10)
    heap.insert(100)
    heap.insert(-100)
    let index = 0
    for (let heapElement of heap) {
      expect(heapElement.value).toBe(e[index++])
    }
    index = 0
    for (let heapElement of heap.valuesIterator()) {
      expect(heapElement).toBe(e[index++])
    }
  });
})
