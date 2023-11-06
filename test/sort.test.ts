import { describe, expect, it } from 'vitest'
import { DoublyLinkedList, heapSort, LinkedList, numberComparator, quicksort } from '../src'

describe('sorting algorithm tests', () => {
  describe('quicksort', () => {
    it('should sort a number doubly linked list', () => {
      const doublyLinkedList = new DoublyLinkedList<number>()
      doublyLinkedList.comparator = numberComparator
      doublyLinkedList.add(1)
      doublyLinkedList.add(3)
      doublyLinkedList.add(5)
      doublyLinkedList.add(-1)
      doublyLinkedList.add(2)
      doublyLinkedList.add(4)
      const sortedList = quicksort(doublyLinkedList, numberComparator)
      expect(sortedList.size).toBe(6)
      expect(sortedList.get(0)).toBe(-1)
      expect(sortedList.get(1)).toBe(1)
      expect(sortedList.get(2)).toBe(2)
      expect(sortedList.get(3)).toBe(3)
      expect(sortedList.get(4)).toBe(4)
      expect(sortedList.get(5)).toBe(5)
    })
  })

  describe('fibonacci heapsort', () => {
    describe('through sort()', () => {
      it('should sort a number doubly linked list', () => {
        const doublyLinkedList = new DoublyLinkedList<number>()
        doublyLinkedList.add(1)
        doublyLinkedList.add(3)
        doublyLinkedList.add(5)
        doublyLinkedList.add(-1)
        doublyLinkedList.add(2)
        doublyLinkedList.add(4)
        doublyLinkedList.comparator = numberComparator
        doublyLinkedList.sort()

        expect(doublyLinkedList.size).toBe(6)
        expect(doublyLinkedList.get(0)).toBe(-1)
        expect(doublyLinkedList.get(1)).toBe(1)
        expect(doublyLinkedList.get(2)).toBe(2)
        expect(doublyLinkedList.get(3)).toBe(3)
        expect(doublyLinkedList.get(4)).toBe(4)
        expect(doublyLinkedList.get(5)).toBe(5)
      })
      it('should sort a number linked list', () => {
        const linkedList = new LinkedList<number>()
        linkedList.add(1)
        linkedList.add(3)
        linkedList.add(5)
        linkedList.add(-1)
        linkedList.add(2)
        linkedList.add(4)
        linkedList.sort(numberComparator)
        expect(linkedList.size).toBe(6)
        expect(linkedList.get(0)).toBe(-1)
        expect(linkedList.get(1)).toBe(1)
        expect(linkedList.get(2)).toBe(2)
        expect(linkedList.get(3)).toBe(3)
        expect(linkedList.get(4)).toBe(4)
        expect(linkedList.get(5)).toBe(5)
      })
    })
    it('should sort a number doubly linked list', () => {
      const list = new DoublyLinkedList<number>()
      list.add(1)
      list.add(3)
      list.add(5)
      list.add(-1)
      list.add(2)
      list.add(4)
      list.comparator = numberComparator
      const heap = heapSort(list, list.comparator)
      expect(heap.size).toBe(6)
      expect(heap.extractMin().value).toBe(-1)
      expect(heap.extractMin().value).toBe(1)
      expect(heap.extractMin().value).toBe(2)
      expect(heap.extractMin().value).toBe(3)
      expect(heap.extractMin().value).toBe(4)
      expect(heap.extractMin().value).toBe(5)
    })
  })
})
