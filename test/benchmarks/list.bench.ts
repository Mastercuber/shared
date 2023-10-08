import { bench, describe, expect } from 'vitest'
import {
  CyclicDoublyLinkedList,
  DoublyLinkedList,
  IList,
  LinkedList,
  List,
  numberComparator,
  quicksort,
} from '../../src'
import c from 'chalk'

function fill(list: IList<number>) {
  list.add(1)
  list.add(2)
  list.add(3)
  list.add(4)
  list.add(5)
}
const options = {
  time: 50,
  iterations: 1000,
  warmupTime: 100,
  warmupIterations: 1000,
}
describe(c.blue('sort (heap sort)'), () => {
  function listSortTest(listType: new(options?: any) => IList<number>) {
    const list = new listType()
    list.comparator = numberComparator
    list.add(5)
    list.add(3)
    list.add(4)
    list.add(2)
    list.add(1)

    list.sort()
    expect(list.get(0)).toBe(1)
    expect(list.get(1)).toBe(2)
    expect(list.get(2)).toBe(3)
    expect(list.get(3)).toBe(4)
    expect(list.get(4)).toBe(5)
  }

  bench('List (native sort)', () => {
    listSortTest(List)
  }, options)
  bench('LinkedList', () => {
    listSortTest(LinkedList)
  }, options)
  bench('DoublyLinkedList', () => {
    listSortTest(DoublyLinkedList)
  }, options)
  bench('CyclicDoublyLinkedList', () => {
    listSortTest(CyclicDoublyLinkedList)
  }, options)
})
describe(c.blue('sort (quick sort)'), () => {
  function listSortTest(listType: new(options?: any) => IList<number>) {
    const list = new listType()
    list.add(5)
    list.add(3)
    list.add(4)
    list.add(2)
    list.add(1)

    const sorted = quicksort(list, numberComparator)
    expect(sorted.get(0)).toBe(1)
    expect(sorted.get(1)).toBe(2)
    expect(sorted.get(2)).toBe(3)
    expect(sorted.get(3)).toBe(4)
    expect(sorted.get(4)).toBe(5)
  }
  bench('List (native sort)', () => {
    listSortTest(List)
  }, options)
  bench('LinkedList', () => {
    listSortTest(LinkedList)
  }, options)
  bench('DoublyLinkedList', () => {
    listSortTest(DoublyLinkedList)
  }, options)
  bench('CyclicDoublyLinkedList', () => {
    listSortTest(CyclicDoublyLinkedList)
  }, options)
})

describe(c.blue('add'), () => {
  function listAddTest(listType: new(options?: any) => IList<number>) {
    const list = new listType()
    fill(list)
    expect(list.size).toBe(5)
    expect(list.get(0)).toBe(1)
    expect(list.get(1)).toBe(2)
    expect(list.get(2)).toBe(3)
    expect(list.get(3)).toBe(4)
    expect(list.get(4)).toBe(5)
  }

  bench('List', () => {
    listAddTest(List)
  }, options)

  bench('LinkedList', () => {
    listAddTest(LinkedList)
  }, options)

  bench('DoublyLinkedList', () => {
    listAddTest(DoublyLinkedList)
  }, options)

  bench('CyclicDoublyLinkedList', () => {
    listAddTest(CyclicDoublyLinkedList)
  }, options)
})

describe(c.blue('remove'), () => {
  function listRemoveTest(listType: new (options?: any) => IList<number>) {
    const list = new listType()

    fill(list)
    expect(list.remove(0)).toBe(1)
    expect(list.remove(0)).toBe(2)
    expect(list.remove(0)).toBe(3)
    expect(list.remove(0)).toBe(4)
    expect(list.remove(0)).toBe(5)

    fill(list)
    expect(list.remove(4)).toBe(5)
    expect(list.remove(3)).toBe(4)
    expect(list.remove(2)).toBe(3)
    expect(list.remove(1)).toBe(2)
    expect(list.remove(0)).toBe(1)
  }

  bench('List', () => {
    listRemoveTest(List)
  }, options)

  bench('LinkedList', () => {
    listRemoveTest(LinkedList)
  }, options)

  bench('DoublyLinkedList', () => {
    listRemoveTest(DoublyLinkedList)
  }, options)

  bench('CyclicDoublyLinkedList', () => {
    listRemoveTest(CyclicDoublyLinkedList)
  }, options)
})

describe(c.blue('get'), () => {
  function listGetTest(listType: new (options?: any) => IList<number>) {
    const list = new listType()

    fill(list)
    expect(list.get(0)).toBe(1)
    expect(list.get(1)).toBe(2)
    expect(list.get(2)).toBe(3)
    expect(list.get(3)).toBe(4)
    expect(list.get(4)).toBe(5)

    fill(list)
    expect(list.get(4)).toBe(5)
    expect(list.get(3)).toBe(4)
    expect(list.get(2)).toBe(3)
    expect(list.get(1)).toBe(2)
    expect(list.get(0)).toBe(1)
  }

  bench('List', () => {
    listGetTest(List)
  }, options)

  bench('LinkedList', () => {
    listGetTest(LinkedList)
  }, options)

  bench('DoublyLinkedList', () => {
    listGetTest(DoublyLinkedList)
  }, options)

  bench('CyclicDoublyLinkedList', () => {
    listGetTest(CyclicDoublyLinkedList)
  }, options)
})
describe(c.blue('slice'), () => {
  function listSliceTest(listType: new (options?: any) => IList<number>) {
    const list = new listType()
    fill(list)
    let slice = list.slice(0, 0)
    expect(slice.size).toBe(1)
    expect(slice.get(0)).toBe(1)

    slice = list.slice(0, 1)
    expect(slice.size).toBe(2)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)

    slice = list.slice(0, 2)
    expect(slice.size).toBe(3)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(slice.get(2)).toBe(3)

    slice = list.slice(0, 3)
    expect(slice.size).toBe(4)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(slice.get(2)).toBe(3)
    expect(slice.get(3)).toBe(4)

    slice = list.slice(0, 4)
    expect(slice.size).toBe(5)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(slice.get(2)).toBe(3)
    expect(slice.get(3)).toBe(4)
    expect(slice.get(4)).toBe(5)
  }

  bench('List', () => {
    listSliceTest(List)
  }, options)

  bench('LinkedList', () => {
    listSliceTest(LinkedList)
  }, options)

  bench('DoublyLinkedList', () => {
    listSliceTest(DoublyLinkedList)
  }, options)

  bench('CyclicDoublyLinkedList', () => {
    listSliceTest(CyclicDoublyLinkedList)
  }, options)
})

describe(c.blue('splice'), () => {
  function listSpliceTest(listType: new (options?: any) => IList<number>) {
    const list = new listType()
    fill(list)
    let slice = list.splice(0, 0)
    expect(slice.size).toBe(0)
    expect(list.size).toBe(5)

    list.clear()
    fill(list)
    slice = list.splice(0, 1)
    expect(slice.size).toBe(1)
    expect(slice.get(0)).toBe(1)
    expect(list.size).toBe(4)

    list.clear()
    fill(list)
    slice = list.splice(0, 2)
    expect(slice.size).toBe(2)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(list.size).toBe(3)

    list.clear()
    fill(list)
    slice = list.splice(0, 3)
    expect(slice.size).toBe(3)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(slice.get(2)).toBe(3)
    expect(list.size).toBe(2)

    list.clear()
    fill(list)
    slice = list.splice(0, 4)
    expect(slice.size).toBe(4)
    expect(slice.get(0)).toBe(1)
    expect(slice.get(1)).toBe(2)
    expect(slice.get(2)).toBe(3)
    expect(slice.get(3)).toBe(4)
    expect(list.size).toBe(1)
  }

  bench('List', () => {
    listSpliceTest(List)
  }, options)

  bench('LinkedList', () => {
    listSpliceTest(LinkedList)
  }, options)

  bench('DoublyLinkedList', () => {
    listSpliceTest(DoublyLinkedList)
  }, options)

  bench('CyclicDoublyLinkedList', () => {
    listSpliceTest(CyclicDoublyLinkedList)
  }, options)
})
