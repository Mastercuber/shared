import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {
  CyclicDoublyLinkedList,
  Dequeue,
  DoublyLinkedList,
  FibonacciHeap,
  ILinkedList,
  IList,
  LinkedList,
  LinkedQueue,
  LinkedStack,
  List, numberComparatorASC,
  PriorityQueue,
  Queue,
  Stack
} from '../src'

function linkedListTests(list: ILinkedList<number>, listType: new (elements?: Iterable<number>, reverse?: boolean) => IList<number>) {
  commonListTests(list, listType)
  describe('common linked list tests', () => {
    beforeEach(() => {
      list.clear()
    })
    it('adds first and last elements correctly', () => {
      expect(list.size).toBe(0)
      list.addFirst(5)
      expect(list.getLast()).toBe(5)
      list.addFirst(4)
      list.addFirst(3)
      list.addFirst(2)
      list.addFirst(1)
      expect(list.size).toBe(5)
      expect(list.getFirst()).toBe(1)
      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
      expect(list.get(3)).toBe(4)
      expect(list.get(4)).toBe(5)
      expect(list.getLast()).toBe(5)
      list.clear()

      expect(list.size).toBe(0)
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)
      list.addLast(4)
      list.addLast(5)
      expect(list.size).toBe(5)
      expect(list.getFirst()).toBe(1)
      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
      expect(list.get(3)).toBe(4)
      expect(list.get(4)).toBe(5)
      expect(list.getLast()).toBe(5)
      list.clear()

      expect(list.size).toBe(0)
      list.add(3)
      list.add(4)
      list.addFirst(2)
      list.addFirst(1)
      list.addLast(5)
      list.addFirst(0)
      list.addLast(6)
      expect(list.size).toBe(7)
      expect(list.getFirst()).toBe(0)
      expect(list.get(0)).toBe(0)
      expect(list.get(1)).toBe(1)
      expect(list.get(2)).toBe(2)
      expect(list.get(3)).toBe(3)
      expect(list.get(4)).toBe(4)
      expect(list.get(5)).toBe(5)
      expect(list.get(6)).toBe(6)
      expect(list.getLast()).toBe(6)
    })
    it('removes first and last elements correctly', () => {
      list.add(1)
      list.add(2)
      list.add(3)
      list.add(4)
      list.add(5)
      expect(list.size).toBe(5)
      expect(list.removeFirst()).toBe(1)
      expect(list.size).toBe(4)
      expect(list.getFirst()).toBe(2)
      expect(list.removeFirst()).toBe(2)
      expect(list.getFirst()).toBe(3)
      expect(list.removeFirst()).toBe(3)
      expect(list.getFirst()).toBe(4)
      expect(list.getLast()).toBe(5)
      expect(list.removeFirst()).toBe(4)
      expect(list.getFirst()).toBe(5)
      expect(list.getLast()).toBe(5)
      expect(list.removeFirst()).toBe(5)
      expect(() => list.removeFirst()).toThrowError("no such element")
      expect(() => list.removeLast()).toThrowError("no such element")
      expect(() => list.getFirst()).toThrowError('no such element')
      expect(() => list.getLast()).toThrowError('no such element')
      expect(list.size).toBe(0)

      list.add(1)
      list.add(2)
      list.add(3)
      list.add(4)
      list.add(5)
      expect(list.size).toBe(5)
      expect(list.removeLast()).toBe(5)
      expect(list.getLast()).toBe(4)
      expect(list.removeLast()).toBe(4)
      expect(list.getLast()).toBe(3)
      expect(list.removeLast()).toBe(3)
      expect(list.getLast()).toBe(2)
      expect(list.removeLast()).toBe(2)
      expect(list.getLast()).toBe(1)
      list.add(2)
      expect(list.getLast()).toBe(2)
      expect(list.removeLast()).toBe(2)
      expect(list.removeLast()).toBe(1)
      expect(() => list.removeLast()).toThrowError("no such element")
      expect(() => list.removeFirst()).toThrowError("no such element")
      expect(() => list.getFirst()).toThrowError('no such element')
      expect(() => list.getLast()).toThrowError('no such element')
      expect(list.size).toBe(0)
      list.clear()

      list.add(1)
      list.add(2)
      expect(list.size).toBe(2)
      expect(list.removeLast()).toBe(2)
      expect(list.size).toBe(1)
      expect(list.removeLast()).toBe(1)
      expect(list.size).toBe(0)
      expect(() => list.removeLast()).toThrowError("no such element")
      list.clear()

      list.add(1)
      list.add(2)
      expect(list.size).toBe(2)
      expect(list.removeFirst()).toBe(1)
      expect(list.size).toBe(1)
      expect(list.removeFirst()).toBe(2)
      expect(list.size).toBe(0)
      expect(() => list.removeFirst()).toThrowError("no such element")
    })
    it('should construct new list from collections in reverse order', () => {
      let _list = new listType([1, 2, 3], true)
      expect(_list.get(0)).toBe(3)
      expect(_list.get(1)).toBe(2)
      expect(_list.get(2)).toBe(1)

      _list = new listType(new Set([1, 2, 3]), true)
      expect(_list.get(0)).toBe(3)
      expect(_list.get(1)).toBe(2)
      expect(_list.get(2)).toBe(1)

      _list = new listType(new Stack([1, 2, 3]), true)
      expect(_list.get(0)).toBe(1)
      expect(_list.get(1)).toBe(2)
      expect(_list.get(2)).toBe(3)

      _list = new listType(new Queue([1, 2, 3]), true)
      expect(_list.get(0)).toBe(3)
      expect(_list.get(1)).toBe(2)
      expect(_list.get(2)).toBe(1)
    });
    it('should not add "undefined"', () => {
      list.addFirst(undefined!)
      list.addLast(undefined!)
      expect(list.size).toBe(0)
    })
  })
}

function commonListTests(list: IList<number>, listType: new (elements?: Iterable<number>) => IList<number>) {
  describe('common list tests', () => {
    beforeEach(() => {
      list.clear()
      list.comparator = null!
    })
    describe('construct new List', () => {
      it('from native Array', () => {
        const _list = new listType([1, 2])
        expect(_list.size).toBe(2)
        expect(_list.get(0)).toBe(1)
        expect(_list.get(1)).toBe(2)
      })
      it('from native Set', () => {
        const _list = new listType(new Set([-1, 0, 1]))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from List of same type as new List', () => {
        const _list = new listType(new listType([-1, 0, 1]))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from List', () => {
        const _list = new listType(new List([-1, 0, 1]))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from LinkedList', () => {
        list.add(-1)
        list.add(0)
        list.add(1)
        const _list = new listType(new LinkedList(list))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from DoublyLinkedList', () => {
        list.add(-1)
        list.add(0)
        list.add(1)
        const _list = new listType(new DoublyLinkedList(list))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from CyclicDoublyLinkedList', () => {
        list.add(-1)
        list.add(0)
        list.add(1)
        const _list = new listType(new CyclicDoublyLinkedList(list))
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from Stack', () => {
        const stack = new Stack<number>()
        stack.push(1)
        stack.push(0)
        stack.push(-1)
        const _list = new listType(stack)
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from LinkedStack', () => {
        const stack = new LinkedStack<number>()
        stack.push(1)
        stack.push(0)
        stack.push(-1)
        const _list = new listType(stack)
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from Queue', () => {
        const queue = new Queue<number>([], numberComparatorASC)
        queue.enqueue(-1)
        queue.enqueue(0)
        queue.enqueue(1)
        const _list = new listType(queue)
        expect(_list.size).toBe(3)
        expect([..._list]).toEqual([-1,0,1])
      })
      it('from LinkedQueue', () => {
        const queue = new LinkedQueue<number>()
        queue.enqueue(-1)
        queue.enqueue(0)
        queue.enqueue(1)
        const _list = new listType(queue)
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from PriorityQueue', () => {
        const queue = new PriorityQueue<number>(numberComparatorASC)
        queue.enqueue(-1)
        queue.enqueue(0)
        queue.enqueue(1)
        const _list = new listType(queue)
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)
      })
      it('from Dequeue', () => {
        const queue = new Dequeue<number>()
        queue.enqueue(-1)
        queue.enqueue(0)
        queue.enqueue(1)
        const _list = new listType(queue)
        expect(_list.size).toBe(3)
        expect(_list.get(0)).toBe(-1)
        expect(_list.get(1)).toBe(0)
        expect(_list.get(2)).toBe(1)

        const queue2 = new Dequeue<number>()
        queue2.push(1)
        queue2.push(0)
        queue2.push(-1)
        const _list2 = new listType(queue2)
        expect(_list2.size).toBe(3)
        expect(_list2.get(0)).toBe(-1)
        expect(_list2.get(1)).toBe(0)
        expect(_list2.get(2)).toBe(1)
      })
      it('from FibonacciHeap', () => {
        const heap = new FibonacciHeap<number>(numberComparatorASC)
        heap.insert(0)
        heap.insert(1)
        heap.insert(-1)
        const _list2 = new listType(heap)
        expect(_list2.size).toBe(3)
        expect(_list2.get(0)).toBe(-1)
        expect(_list2.get(1)).toBe(0)
        expect(_list2.get(2)).toBe(1)
      })
    })
    describe('add elements', () => {
      it('should add "null" elements', () => {
        list.add(null!)
        list.add(undefined!)
        expect(list.size).toBe(1)
        expect(list.get(0)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.size).toBe(0)

        list.add(null!)
        list.add(null!)
        expect(list.size).toBe(2)
        expect(list.get(0)).toBeNull()
        expect(list.get(1)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.size).toBe(0)

        list.add(null!)
        list.add(null!)
        list.add(null!)
        expect(list.size).toBe(3)
        expect(list.get(0)).toBeNull()
        expect(list.get(1)).toBeNull()
        expect(list.get(2)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.remove(0)).toBeNull()
        expect(list.size).toBe(0)
      })
      it('should not add "undefined"', () => {
        list.add(undefined!)
        expect(list.size).toBe(0)
      })
      it('adds elements (3)', () => {
        list.add(-100)
        list.add(-10)
        list.add(-1)

        expect(list.get(0)).toBe(-100)
        expect(list.get(1)).toBe(-10)
        expect(list.get(2)).toBe(-1)
        expect(list.size).toBe(3)
        list.clear()

        list.add(1)
        list.add(10)
        list.add(100)

        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(10)
        expect(list.get(2)).toBe(100)
        expect(list.size).toBe(3)
      })
      it('adds elements (6)', () => {
        expect(list.isEmpty()).toBeTruthy()
        expect(list.get(0)).toBeUndefined()

        list.add(-1)
        list.add(0)
        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)

        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(0)
        expect(list.get(2)).toBe(1)
        expect(list.get(3)).toBe(2)
        expect(list.get(4)).toBe(3)
        expect(list.get(5)).toBe(4)
        expect(list.size).toBe(6)
      })
      it('adds elements (alternating)', () => {
        expect(list.isEmpty()).toBeTruthy()
        expect(list.get(0)).toBeUndefined()

        list.add(-1)
        list.add(1)
        list.add(0)
        list.add(-2)
        list.add(2)
        list.add(-3)
        list.add(3)
        list.add(-4)
        list.add(4)
        list.add(-5)
        list.add(5)
        list.add(-6)
        list.add(6)

        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(1)
        expect(list.get(2)).toBe(0)
        expect(list.get(3)).toBe(-2)
        expect(list.get(4)).toBe(2)
        expect(list.get(5)).toBe(-3)
        expect(list.get(6)).toBe(3)
        expect(list.get(7)).toBe(-4)
        expect(list.get(8)).toBe(4)
        expect(list.get(9)).toBe(-5)
        expect(list.get(10)).toBe(5)
        expect(list.get(11)).toBe(-6)
        expect(list.get(12)).toBe(6)
        expect(list.size).toBe(13)
      })
      it('should add all elements of a collection to the list', () => {
        const l = new List<number>()
        l.add(1)
        l.add(2)
        const ll = new LinkedList<number>()
        ll.add(3)
        ll.add(4)
        const dll = new DoublyLinkedList<number>()
        dll.add(5)
        dll.add(6)
        const cdll = new CyclicDoublyLinkedList<number>()
        cdll.add(7)
        cdll.add(8)

        expect(list.isEmpty()).toBeTruthy()
        list.addAll(l)
        expect(list.size).toBe(2)
        list.addAll(ll)
        expect(list.size).toBe(4)
        list.addAll(dll)
        expect(list.size).toBe(6)
        list.addAll(cdll)
        expect(list.size).toBe(8)

        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(2)
        expect(list.get(2)).toBe(3)
        expect(list.get(3)).toBe(4)
        expect(list.get(4)).toBe(5)
        expect(list.get(5)).toBe(6)
        expect(list.get(6)).toBe(7)
        expect(list.get(7)).toBe(8)
      })
    })
    describe('get elements', () => {
      it('should get elements', () => {
        list.add(1)
        list.add(2)
        list.add(3)
        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(2)
        expect(list.get(2)).toBe(3)
        list.clear()

        list.add(-1)
        list.add(0)
        list.add(1)
        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(0)
        expect(list.get(2)).toBe(1)
        list.clear()

        list.add(-1)
        list.add(-2)
        list.add(-3)
        expect(list.get(0)).toBe(-1)
        expect(list.get(1)).toBe(-2)
        expect(list.get(2)).toBe(-3)
      })
      it('should get "null" values', () => {
        list.add(null!)
        list.add(null!)
        list.add(2)
        list.add(null!)
        list.add(null!)
        expect(list.size).toBe(5)
        expect(list.get(0)).toBeNull()
        expect(list.get(1)).toBeNull()
        expect(list.get(2)).toBe(2)
        expect(list.get(3)).toBeNull()
        expect(list.get(4)).toBeNull()
      })
    })
    describe('set elements', () => {
      it('should set "null" values', () => {
        list.add(10)
        list.add(-10)
        expect(list.set(0, null)).toBeTruthy()
        expect(list.get(0)).toBeNull()
        expect(list.size).toBe(2)
      })
      it('should not set "undefined" values', () => {
        list.add(0)
        list.add(-1)
        expect(list.set(1, undefined!)).toBeFalsy()
        expect(list.size).toBe(2)
        expect(list.get(1)).toBe(-1)
      })
      it('should set elements', () => {
        list.add(-2)
        list.add(-1)
        list.add(0)
        list.add(1)
        list.add(2)

        expect(list.set(2, 10)).toBeTruthy()
        expect(list.set(1, 1)).toBeTruthy()
        expect(list.set(0, -4)).toBeTruthy()

        expect(list.get(2)).toBe(10)
        expect(list.get(1)).toBe(1)
        expect(list.get(0)).toBe(-4)
      })
      it('should return false on unknown index', () => {
        expect(list.set(-1, null)).toBeFalsy()
        expect(list.set(0, null)).toBeFalsy()
        expect(list.set(1, null)).toBeFalsy()
      })
    })
    describe('remove elements', () => {
      it('should remove elements', () => {
        list.add(1)
        expect(list.size).toBe(1)
        expect(list.remove(0)).toBeTruthy()
        expect(list.size).toBe(0)

        list.add(1)
        list.add(2)
        expect(list.size).toBe(2)
        expect(list.remove(0)).toBeTruthy()
        expect(list.remove(0)).toBeTruthy()
        expect(() => list.remove(0)).toThrowError("no such element")
        expect(list.size).toBe(0)

        list.add(1)
        list.add(2)
        expect(list.size).toBe(2)
        expect(list.get(1)).toBe(2)
        expect(list.remove(1)).toBe(2)
        expect(list.get(0)).toBe(1)
        list.add(2)
        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(2)
        expect(list.remove(1)).toBe(2)
        expect(list.get(0)).toBe(1)
        expect(list.size).toBe(1)
        expect(list.remove(0)).toBe(1)
        expect(list.get(0)).toBeUndefined()

        list.add(1)
        list.add(2)
        list.add(3)
        expect(list.size).toBe(3)
        expect(list.remove(2)).toBe(3)
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(2)
        expect(list.remove(0)).toBe(1)
        expect(list.size).toBe(1)
        list.clear()

        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)
        expect(list.size).toBe(4)
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.remove(2)).toBe(3)
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.remove(1)).toBe(2)
        expect(list.get(0)).toBe(1)
        expect(list.get(list.size - 1)).toBe(4)
        expect(list.size).toBe(2)
      })
    })
    describe('equality', () => {
      it('should unequal another list', () => {
        list.add(1)
        list.add(2)
        list.add(3)

        list.comparator = numberComparatorASC
        const otherListUnequal = new listType([1,2,2])
        expect(list.equals(otherListUnequal)).toBeFalsy()
      });
      it('should equal another list', () => {
        list.add(1)
        list.add(2)
        list.add(3)

        list.comparator = numberComparatorASC
        let otherList = new listType([1,2,3])
        expect(list.equals(otherList)).toBeTruthy()
        list.clear()

        list.add(0)
        list.add(-10)
        list.add(10)
        list.add(-2)
        list.add(2)
        list.add(0)

        otherList = new listType([0, -10, 10, -2, 2, 0])
        expect(list.equals(otherList)).toBeTruthy()
        otherList.add(2)
        expect(list.equals(otherList)).toBeFalsy()
      });
    });
    function commonSliceTests(_slice: (startIndex: number, endIndex: number) => IList<number>) {
      beforeEach(() => {
        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)
        list.add(5)
        list.add(6)
      })
      afterEach(() => {
        expect(list.size).toBe(6)
        list.clear()
      })
      // n = 6
      // Y := y mod n
      // (x element of [|Y|] | x,y element of Z and x kongruent Y)
      // this means, that x is in equivalence class [|Y|] when x and y are integer and x kongruent y mod n
      describe('6 residue classes for n = 6: [0], [1], [2], [3], [4], [5]', () => {
        describe('should slice (start = 0, end = [0,5])', () => {
          it('should slice (start = 0, end = 0)', () => {
            const slice = _slice.call(list, 0, 0)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(1)
          });
          it('should slice (start = 0, end = 1)', () => {
            const slice = _slice.call(list, 0, 1)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
          });
          it('should slice (start = 0, end = 2)', () => {
            const slice = _slice.call(list, 0, 2)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
          });
          it('should slice (start = 0, end = 3)', () => {
            const slice = _slice.call(list, 0, 3)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
          });
          it('should slice (start = 0, end = 4)', () => {
            const slice = _slice.call(list, 0, 4)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(5)
          });
          it('should slice (start = 0, end = 5)', () => {
            const slice = _slice.call(list, 0, 5)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(5)
            expect(slice.get(5)).toBe(6)
          });
        })
        describe('should slice (start = 1, end = [0,5])', () => {
          it('should slice (start = 1, end = 0)', () => {
            const slice = _slice.call(list, 1, 0)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(6)
            expect(slice.get(5)).toBe(1)
          });
          it('should slice (start = 1, end = 1)', () => {
            const slice = _slice.call(list, 1, 1)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(2)
          });
          it('should slice (start = 1, end = 2)', () => {
            const slice = _slice.call(list, 1, 2)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
          });
          it('should slice (start = 1, end = 3)', () => {
            const slice = _slice.call(list, 1, 3)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
          });
          it('should slice (start = 1, end = 4)', () => {
            const slice = _slice.call(list, 1, 4)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
          });
          it('should slice (start = 1, end = 5)', () => {
            const slice = _slice.call(list, 1, 5)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(6)
          });
        })
        describe('should slice (start = 2, end = [0,5])', () => {
          it('should slice (start = 2, end = 0)', () => {
            const slice = _slice.call(list, 2, 0)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(1)
          });
          it('should slice (start = 2, end = 1)', () => {
            const slice = _slice.call(list, 2, 1)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(1)
            expect(slice.get(5)).toBe(2)
          });
          it('should slice (start = 2, end = 2)', () => {
            const slice = _slice.call(list, 2, 2)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(3)
          });
          it('should slice (start = 2, end = 3)', () => {
            const slice = _slice.call(list, 2, 3)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
          });
          it('should slice (start = 2, end = 4)', () => {
            const slice = _slice.call(list, 2, 4)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
          });
          it('should slice (start = 2, end = 5)', () => {
            const slice = _slice.call(list, 2, 5)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
          });
        })
        describe('should slice (start = 3, end = [0,5])', () => {
          it('should slice (start = 3, end = 0)', () => {
            const slice = _slice.call(list, 3, 0)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
          });
          it('should slice (start = 3, end = 1)', () => {
            const slice = _slice.call(list, 3, 1)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(2)
          });
          it('should slice (start = 3, end = 2)', () => {
            const slice = _slice.call(list, 3, 2)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(2)
            expect(slice.get(5)).toBe(3)
          });
          it('should slice (start = 3, end = 3)', () => {
            const slice = _slice.call(list, 3, 3)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(4)
          });
          it('should slice (start = 3, end = 4)', () => {
            const slice = _slice.call(list, 3, 4)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
          });
          it('should slice (start = 3, end = 5)', () => {
            const slice = _slice.call(list, 3, 5)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
          });
        })
        describe('should slice (start = 4, end = [0,5])', () => {
          it('should slice (start = 4, end = 0)', () => {
            const slice = _slice.call(list, 4, 0)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
          });
          it('should slice (start = 4, end = 1)', () => {
            const slice = _slice.call(list, 4, 1)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
          });
          it('should slice (start = 4, end = 2)', () => {
            const slice = _slice.call(list, 4, 2)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(3)
          });
          it('should slice (start = 4, end = 3)', () => {
            const slice = _slice.call(list, 4, 3)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(3)
            expect(slice.get(5)).toBe(4)
          });
          it('should slice (start = 4, end = 4)', () => {
            const slice = _slice.call(list, 4, 4)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(5)
          });
          it('should slice (start = 4, end = 5)', () => {
            const slice = _slice.call(list, 4, 5)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
          });
        })
        describe('should slice (start = 5, end = [0,5])', () => {
          it('should slice (start = 5, end = 0)', () => {
            const slice = _slice.call(list, 5, 0)
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
          });
          it('should slice (start = 5, end = 1)', () => {
            const slice = _slice.call(list, 5, 1)
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
          });
          it('should slice (start = 5, end = 2)', () => {
            const slice = _slice.call(list, 5, 2)
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
          });
          it('should slice (start = 5, end = 3)', () => {
            const slice = _slice.call(list, 5, 3)
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(4)
          });
          it('should slice (start = 5, end = 4)', () => {
            const slice = _slice.call(list, 5, 4)
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(4)
            expect(slice.get(5)).toBe(5)
          });
          it('should slice (start = 5, end = 5)', () => {
            const slice = _slice.call(list, 5, 5)
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(6)
          });
        })
      });
    }
    describe('slice', () => {
      describe('slice variant 1', () => {
        commonSliceTests(list.slice)
      });
      describe('slice variant 2 (with left direction per negative end index)', () => {
        commonSliceTests(list.slice2)
        describe('same 6 residue classes but with a slice direction change on negative end index', () => {
          describe('should slice (start = -5, end = [0,-5])', () => {
            it('should slice (start = -5, end = 0)', () => {
              const slice = list.slice2(-5, 0)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(3)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(6)
              expect(slice.get(5)).toBe(1)
            });
            it('should slice (start = -5, end = -1)', () => {
              const slice = list.slice2(-5, -1)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
            });
            it('should slice (start = -5, end = -2)', () => {
              const slice = list.slice2(-5, -2)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
            });
            it('should slice (start = -5, end = -3)', () => {
              const slice = list.slice2(-5, -3)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(4)
            });
            it('should slice (start = -5, end = -4)', () => {
              const slice = list.slice2(-5, -4)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(4)
              expect(slice.get(5)).toBe(3)
            });
            it('should slice (start = -5, end = -5)', () => {
              const slice = list.slice2(-5, -5)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(2)
            });
          })
          describe('should slice (start = -4, end = [0,-5])', () => {
            it('should slice (start = -4, end = 0)', () => {
              const slice = list.slice2(-4, 0)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(5)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(1)
            });
            it('should slice (start = -4, end = -1)', () => {
              const slice = list.slice2(-4, -1)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
            });
            it('should slice (start = -4, end = -2)', () => {
              const slice = list.slice2(-4, -2)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(5)
            });
            it('should slice (start = -4, end = -3)', () => {
              const slice = list.slice2(-4, -3)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(5)
              expect(slice.get(5)).toBe(4)
            });
            it('should slice (start = -4, end = -4)', () => {
              const slice = list.slice2(-4, -4)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(3)
            });
            it('should slice (start = -4, end = -5)', () => {
              const slice = list.slice2(-4, -5)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
            });
          })
          describe('should slice (start = -3, end = [0,-5])', () => {
            it('should slice (start = -3, end = 0)', () => {
              const slice = list.slice2(-3, 0)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
            });
            it('should slice (start = -3, end = 1)', () => {
              const slice = list.slice2(-3, 1)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
              expect(slice.get(4)).toBe(2)
            });
            it('should slice (start = -3, end = 2)', () => {
              const slice = list.slice2(-3, 2)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
              expect(slice.get(4)).toBe(2)
              expect(slice.get(5)).toBe(3)
            });
            it('should slice (start = -3, end = 3)', () => {
              const slice = list.slice2(-3, 3)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(4)
            });
            it('should slice (start = -3, end = 4)', () => {
              const slice = list.slice2(-3, 4)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
            });
            it('should slice (start = -3, end = 5)', () => {
              const slice = list.slice2(-3, 5)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
            });
          })
          describe('should slice (start = -2, end = [0,-5])', () => {
            it('should slice (start = -2, end = 0)', () => {
              const slice = list.slice2(-2, 0)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(1)
            });
            it('should slice (start = -2, end = -1)', () => {
              const slice = list.slice2(-2, -1)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
              expect(slice.get(3)).toBe(2)
              expect(slice.get(4)).toBe(1)
              expect(slice.get(5)).toBe(6)
            });
            it('should slice (start = -2, end = -2)', () => {
              const slice = list.slice2(-2, -2)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(5)
            });
            it('should slice (start = -2, end = -3)', () => {
              const slice = list.slice2(-2, -3)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
            });
            it('should slice (start = -2, end = -4)', () => {
              const slice = list.slice2(-2, -4)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
            });
            it('should slice (start = -2, end = -5)', () => {
              const slice = list.slice2(-2, -5)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
              expect(slice.get(3)).toBe(2)
            });
          })
          describe('should slice (start = -1, end = [0,-5])', () => {
            it('should slice (start = -1, end = 0)', () => {
              const slice = list.slice2(-1, 0)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(1)
            });
            it('should slice (start = -1, end = -1)', () => {
              const slice = list.slice2(-1, -1)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(6)
            });
            it('should slice (start = -1, end = -2)', () => {
              const slice = list.slice2(-1, -2)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
            });
            it('should slice (start = -1, end = -3)', () => {
              const slice = list.slice2(-1, -3)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
            });
            it('should slice (start = -1, end = -4)', () => {
              const slice = list.slice2(-1, -4)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(3)
            });
            it('should slice (start = -1, end = -5)', () => {
              const slice = list.slice2(-1, -5)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(3)
              expect(slice.get(4)).toBe(2)
            });
          })
          describe('should slice (start = 0, end = [0,-5])', () => {
            it('should slice (start = 0, end = 0)', () => {
              const slice = list.slice2(0, 0)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(1)
            });
            it('should slice (start = 0, end = -1)', () => {
              const slice = list.slice2(0, -1)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(1)
              expect(slice.get(1)).toBe(6)
            });
            it('should slice (start = 0, end = -2)', () => {
              const slice = list.slice2(0, -2)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(1)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(5)
            });
            it('should slice (start = 0, end = -3)', () => {
              const slice = list.slice2(0, -3)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(1)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(5)
              expect(slice.get(3)).toBe(4)
            });
            it('should slice (start = 0, end = -4)', () => {
              const slice = list.slice2(0, -4)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(1)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(5)
              expect(slice.get(3)).toBe(4)
              expect(slice.get(4)).toBe(3)
            });
            it('should slice (start = 0, end = -5)', () => {
              const slice = list.slice2(0, -5)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(1)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(5)
              expect(slice.get(3)).toBe(4)
              expect(slice.get(4)).toBe(3)
              expect(slice.get(5)).toBe(2)
            });
          })
          describe('should slice (start = 1, end = [0,-5])', () => {
            it('should slice (start = 1, end = 0)', () => {
              const slice = list.slice2(1, 0)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(3)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(6)
              expect(slice.get(5)).toBe(1)
            });
            it('should slice (start = 1, end = -1)', () => {
              const slice = list.slice2(1, -1)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
            });
            it('should slice (start = 1, end = -2)', () => {
              const slice = list.slice2(1, -2)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
            });
            it('should slice (start = 1, end = -3)', () => {
              const slice = list.slice2(1, -3)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(4)
            });
            it('should slice (start = 1, end = -4)', () => {
              const slice = list.slice2(1, -4)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(2)
              expect(slice.get(1)).toBe(1)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(5)
              expect(slice.get(4)).toBe(4)
              expect(slice.get(5)).toBe(3)
            });
            it('should slice (start = 1, end = -5)', () => {
              const slice = list.slice2(1, -5)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(2)
            });
          })
          describe('should slice (start = 2, end = [0,-5])', () => {
            it('should slice (start = 2, end = 0)', () => {
              const slice = list.slice2(2, 0)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(5)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(1)
            });
            it('should slice (start = 2, end = -1)', () => {
              const slice = list.slice2(2, -1)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
            });
            it('should slice (start = 2, end = -2)', () => {
              const slice = list.slice2(2, -2)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(5)
            });
            it('should slice (start = 2, end = -3)', () => {
              const slice = list.slice2(2, -3)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
              expect(slice.get(2)).toBe(1)
              expect(slice.get(3)).toBe(6)
              expect(slice.get(4)).toBe(5)
              expect(slice.get(5)).toBe(4)
            });
            it('should slice (start = 2, end = -4)', () => {
              const slice = list.slice2(2, -4)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(3)
            });
            it('should slice (start = 2, end = -5)', () => {
              const slice = list.slice2(2, -5)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(3)
              expect(slice.get(1)).toBe(2)
            });
          })
          describe('should slice (start = 3, end = [0,-5])', () => {
            it('should slice (start = 3, end = 0)', () => {
              const slice = list.slice2(3, 0)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
            });
            it('should slice (start = 3, end = 1)', () => {
              const slice = list.slice2(3, 1)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
              expect(slice.get(4)).toBe(2)
            });
            it('should slice (start = 3, end = 2)', () => {
              const slice = list.slice2(3, 2)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
              expect(slice.get(3)).toBe(1)
              expect(slice.get(4)).toBe(2)
              expect(slice.get(5)).toBe(3)
            });
            it('should slice (start = 3, end = 3)', () => {
              const slice = list.slice2(3, 3)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(4)
            });
            it('should slice (start = 3, end = 4)', () => {
              const slice = list.slice2(3, 4)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
            });
            it('should slice (start = 3, end = 5)', () => {
              const slice = list.slice2(3, 5)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(4)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(6)
            });
          })
          describe('should slice (start = 4, end = [0,-5])', () => {
            it('should slice (start = 4, end = 0)', () => {
              const slice = list.slice2(4, 0)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(6)
              expect(slice.get(2)).toBe(1)
            });
            it('should slice (start = 4, end = -1)', () => {
              const slice = list.slice2(4, -1)
              expect(slice.size).toBe(6)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
              expect(slice.get(3)).toBe(2)
              expect(slice.get(4)).toBe(1)
              expect(slice.get(5)).toBe(6)
            });
            it('should slice (start = 4, end = -2)', () => {
              const slice = list.slice2(4, -2)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(5)
            });
            it('should slice (start = 4, end = -3)', () => {
              const slice = list.slice2(4, -3)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
            });
            it('should slice (start = 4, end = -4)', () => {
              const slice = list.slice2(4, -4)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
            });
            it('should slice (start = 4, end = -5)', () => {
              const slice = list.slice2(4, -5)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(5)
              expect(slice.get(1)).toBe(4)
              expect(slice.get(2)).toBe(3)
              expect(slice.get(3)).toBe(2)
            });
          })
          describe('should slice (start = 5, end = [0,-5])', () => {
            it('should slice (start = 5, end = 0)', () => {
              const slice = list.slice2(5, 0)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(1)
            });
            it('should slice (start = 5, end = -1)', () => {
              const slice = list.slice2(5, -1)
              expect(slice.size).toBe(1)
              expect(slice.get(0)).toBe(6)
            });
            it('should slice (start = 5, end = -2)', () => {
              const slice = list.slice2(5, -2)
              expect(slice.size).toBe(2)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
            });
            it('should slice (start = 5, end = -3)', () => {
              const slice = list.slice2(5, -3)
              expect(slice.size).toBe(3)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
            });
            it('should slice (start = 5, end = -4)', () => {
              const slice = list.slice2(5, -4)
              expect(slice.size).toBe(4)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(3)
            });
            it('should slice (start = 5, end = -5)', () => {
              const slice = list.slice2(5, -5)
              expect(slice.size).toBe(5)
              expect(slice.get(0)).toBe(6)
              expect(slice.get(1)).toBe(5)
              expect(slice.get(2)).toBe(4)
              expect(slice.get(3)).toBe(3)
              expect(slice.get(4)).toBe(2)
            });
          })
        });
      })
    });
    describe('splice (slice and remove)', () => {
      beforeEach(() => {
        list.add(1)
        list.add(2)
        list.add(3)
        list.add(4)
        list.add(5)
        list.add(6)
      });
      it('should get and remove a slice of the list', () => {
        expect(list.size).toBe(6)

        let slice = list.splice(0, 1)
        expect(slice.size).toBe(1)
        expect(slice.get(0)).toBe(1)

        slice = list.splice(0, 2)
        expect(slice.size).toBe(2)
        expect(slice.get(0)).toBe(2)
        expect(slice.get(1)).toBe(3)

        slice = list.splice(0, 3)
        expect(slice.size).toBe(3)
        expect(slice.get(0)).toBe(4)
        expect(slice.get(1)).toBe(5)
        expect(slice.get(2)).toBe(6)

        expect(list.size).toBe(0)
      });
      it('should return empty list (startIndex [-5, 5], deleteCount = 0)', () => {
        expect(list.splice(-5, 0).size).toBe(0)
        expect(list.splice(-4, 0).size).toBe(0)
        expect(list.splice(-3, 0).size).toBe(0)
        expect(list.splice(-2, 0).size).toBe(0)
        expect(list.splice(-1, 0).size).toBe(0)
        expect(list.splice(0, 0).size).toBe(0)
        expect(list.splice(1, 0).size).toBe(0)
        expect(list.splice(2, 0).size).toBe(0)
        expect(list.splice(3, 0).size).toBe(0)
        expect(list.splice(4, 0).size).toBe(0)
        expect(list.splice(5, 0).size).toBe(0)
      });
      describe('splice (startIndex = [0, 5], deleteCount = [-6, 6]', () => {
        describe('(startIndex = 0, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -6)', () => {
            const slice = list.splice(0, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(3)
            expect(slice.get(5)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -5)', () => {
            const slice = list.splice(0, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -4)', () => {
            const slice = list.splice(0, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -3)', () => {
            const slice = list.splice(0, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -2)', () => {
            const slice = list.splice(0, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = -1)', () => {
            const slice = list.splice(0, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 0)', () => {
            const slice = list.splice(0, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 1)', () => {
            const slice = list.splice(0, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 2)', () => {
            const slice = list.splice(0, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 3)', () => {
            const slice = list.splice(0, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 4)', () => {
            const slice = list.splice(0, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 5)', () => {
            const slice = list.splice(0, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 0, deleteCount = 6)', () => {
            const slice = list.splice(0, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(1)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(4)
            expect(slice.get(4)).toBe(5)
            expect(slice.get(5)).toBe(6)
          });
        });
        describe('(startIndex = 1, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -6)', () => {
            const slice = list.splice(1, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(4)
            expect(slice.get(5)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -5)', () => {
            const slice = list.splice(1, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -4)', () => {
            const slice = list.splice(1, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -3)', () => {
            const slice = list.splice(1, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -2)', () => {
            const slice = list.splice(1, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = -1)', () => {
            const slice = list.splice(1, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 0)', () => {
            const slice = list.splice(1, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 1)', () => {
            const slice = list.splice(1, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 2)', () => {
            const slice = list.splice(1, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 3)', () => {
            const slice = list.splice(1, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 4)', () => {
            const slice = list.splice(1, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 5)', () => {
            const slice = list.splice(1, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 1, deleteCount = 6)', () => {
            const slice = list.splice(1, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(2)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(5)
            expect(slice.get(4)).toBe(6)
            expect(slice.get(5)).toBe(1)
          });
        });
        describe('(startIndex = 2, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -6)', () => {
            const slice = list.splice(2, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(5)
            expect(slice.get(5)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -5)', () => {
            const slice = list.splice(2, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -4)', () => {
            const slice = list.splice(2, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -3)', () => {
            const slice = list.splice(2, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(2)
            expect(slice.get(2)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -2)', () => {
            const slice = list.splice(2, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = -1)', () => {
            const slice = list.splice(2, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 0)', () => {
            const slice = list.splice(2, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 1)', () => {
            const slice = list.splice(2, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 2)', () => {
            const slice = list.splice(2, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 3)', () => {
            const slice = list.splice(2, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 4)', () => {
            const slice = list.splice(2, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 5)', () => {
            const slice = list.splice(2, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 2, deleteCount = 6)', () => {
            const slice = list.splice(2, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(3)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(5)
            expect(slice.get(3)).toBe(6)
            expect(slice.get(4)).toBe(1)
            expect(slice.get(5)).toBe(2)
          });
        });
        describe('(startIndex = 3, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -6)', () => {
            const slice = list.splice(3, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(6)
            expect(slice.get(5)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -5)', () => {
            const slice = list.splice(3, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -4)', () => {
            const slice = list.splice(3, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -3)', () => {
            const slice = list.splice(3, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(3)
            expect(slice.get(2)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -2)', () => {
            const slice = list.splice(3, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = -1)', () => {
            const slice = list.splice(3, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 0)', () => {
            const slice = list.splice(3, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 1)', () => {
            const slice = list.splice(3, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 2)', () => {
            const slice = list.splice(3, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 3)', () => {
            const slice = list.splice(3, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 4)', () => {
            const slice = list.splice(3, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 5)', () => {
            const slice = list.splice(3, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 3, deleteCount = 6)', () => {
            const slice = list.splice(3, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(4)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(6)
            expect(slice.get(3)).toBe(1)
            expect(slice.get(4)).toBe(2)
            expect(slice.get(5)).toBe(3)
          });
        });
        describe('(startIndex = 4, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -6)', () => {
            const slice = list.splice(4, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(1)
            expect(slice.get(5)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -5)', () => {
            const slice = list.splice(4, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -4)', () => {
            const slice = list.splice(4, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(3)
            expect(slice.get(3)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -3)', () => {
            const slice = list.splice(4, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(4)
            expect(slice.get(2)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -2)', () => {
            const slice = list.splice(4, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = -1)', () => {
            const slice = list.splice(4, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 0)', () => {
            const slice = list.splice(4, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 1)', () => {
            const slice = list.splice(4, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 2)', () => {
            const slice = list.splice(4, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 3)', () => {
            const slice = list.splice(4, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 4)', () => {
            const slice = list.splice(4, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 5)', () => {
            const slice = list.splice(4, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 4, deleteCount = 6)', () => {
            const slice = list.splice(4, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(5)
            expect(slice.get(1)).toBe(6)
            expect(slice.get(2)).toBe(1)
            expect(slice.get(3)).toBe(2)
            expect(slice.get(4)).toBe(3)
            expect(slice.get(5)).toBe(4)
          });
        });
        describe('(startIndex = 5, deleteCount = [-6, 6])', () => {
          beforeEach(() => {
            list.clear()
            list.add(1)
            list.add(2)
            list.add(3)
            list.add(4)
            list.add(5)
            list.add(6)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -6)', () => {
            const slice = list.splice(5, -6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(2)
            expect(slice.get(5)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -5)', () => {
            const slice = list.splice(5, -5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -4)', () => {
            const slice = list.splice(5, -4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(4)
            expect(slice.get(3)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -3)', () => {
            const slice = list.splice(5, -3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(5)
            expect(slice.get(2)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -2)', () => {
            const slice = list.splice(5, -2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(5)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = -1)', () => {
            const slice = list.splice(5, -1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 0)', () => {
            const slice = list.splice(5, 0);
            expect(slice.size).toBe(0)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 1)', () => {
            const slice = list.splice(5, 1);
            expect(slice.size).toBe(1)
            expect(slice.get(0)).toBe(6)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 2)', () => {
            const slice = list.splice(5, 2);
            expect(slice.size).toBe(2)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 3)', () => {
            const slice = list.splice(5, 3);
            expect(slice.size).toBe(3)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 4)', () => {
            const slice = list.splice(5, 4);
            expect(slice.size).toBe(4)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 5)', () => {
            const slice = list.splice(5, 5);
            expect(slice.size).toBe(5)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(4)
          });
          it('should get and remove a slice of the list (startIndex = 5, deleteCount = 6)', () => {
            const slice = list.splice(5, 6);
            expect(slice.size).toBe(6)
            expect(slice.get(0)).toBe(6)
            expect(slice.get(1)).toBe(1)
            expect(slice.get(2)).toBe(2)
            expect(slice.get(3)).toBe(3)
            expect(slice.get(4)).toBe(4)
            expect(slice.get(5)).toBe(5)
          });
        });
      });
    });
    it('should have correct size', () => {
      expect(list.isEmpty()).toBeTruthy()
      expect(list.size).toBe(0)
      list.add(1)
      expect(list.size).toBe(1)
      list.add(2)
      expect(list.size).toBe(2)
      list.add(3)
      expect(list.size).toBe(3)
      list.remove(0)
      expect(list.size).toBe(2)
      list.remove(0)
      expect(list.size).toBe(1)
      list.get(0)
      expect(list.size).toBe(1)
      list.remove(0)
      expect(list.size).toBe(0)
      expect(() => list.remove(0)).toThrowError("no such element")

      list.add(-1)
      list.add(0)
      list.add(1)
      expect(list.size).toBe(3)
      list.remove(0)
      expect(list.size).toBe(2)
      list.get(0)
      expect(list.size).toBe(2)
      list.remove(0)
      expect(list.size).toBe(1)
      list.remove(0)
      expect(list.size).toBe(0)
      expect(list.get(0)).toBeUndefined()
    })
    it('should clear the list', () => {
      expect(list.size).toBe(0)
      expect(list.get(0)).toBeUndefined()

      list.add(1)
      list.add(2)
      list.add(3)

      expect(list.size).toBe(3)
      list.clear()
      expect(list.isEmpty()).toBeTruthy()
      expect(list.get(0)).toBeUndefined()
    })
    it('should sort the list', () => {
      function fillList() {
        list.add(1)
        list.add(-1)
        list.add(0)
        list.add(-2)
        list.add(2)
      }

      function assertValues() {
        expect(list.get(0)).toBe(1)
        expect(list.get(1)).toBe(-1)
        expect(list.get(2)).toBe(0)
        expect(list.get(3)).toBe(-2)
        expect(list.get(4)).toBe(2)
      }

      function assertSortedValues() {
        expect(list.get(0)).toBe(-2)
        expect(list.get(1)).toBe(-1)
        expect(list.get(2)).toBe(0)
        expect(list.get(3)).toBe(1)
        expect(list.get(4)).toBe(2)
      }

      fillList()
      assertValues()
      list.comparator = numberComparatorASC
      list.sort()
      assertSortedValues()
      list.clear()

      fillList()
      assertValues()
      list.comparator = null!
      list.sort(numberComparatorASC)
      assertSortedValues()
    })
    it('should find indices for list elements', () => {
      list.add(1)
      list.add(-1)
      list.add(0)
      list.add(2)
      list.add(-2)
      list.comparator = numberComparatorASC

      expect(list.indexOf(1)).toBe(0)
      expect(list.indexOf(-1)).toBe(1)
      expect(list.indexOf(0)).toBe(2)
      expect(list.indexOf(2)).toBe(3)
      expect(list.indexOf(-2)).toBe(4)
      expect(list.indexOf(Number.MIN_VALUE)).toBe(-1)
      expect(list.indexOf(Number.MAX_VALUE)).toBe(-1)

      expect(list.indexOf(1)).toBe(0)
      list.add(1)
      expect(list.indexOf(1)).toBe(0)
      list.add(1)
      expect(list.indexOf(1)).toBe(0)
      list.add(1)
      expect(list.indexOf(1)).toBe(0)
    })
    it('should contains elements', () => {
      list.add(0)
      list.add(1)
      list.add(-1)
      list.comparator = numberComparatorASC
      expect(list.includes(1)).toBeTruthy()
      expect(list.includes(-1)).toBeTruthy()
      expect(list.includes(0)).toBeTruthy()
      expect(list.includes(2)).toBeFalsy()
      expect(list.includes(-2)).toBeFalsy()
    });
    describe('some', () => {
      it('contains no element equal to 1', () => {
        list.add(0)
        expect(list.some(n => n === 1)).toBeFalsy()
      })
      it('contains at least one element equal to 1', () => {
        list.add(0)
        list.add(1)
        expect(list.some(n => n === 1)).toBeTruthy()
      })
    })
    describe('every', () => {
      it('every element matches the predicate', () => {
        list.add(0)
        expect(list.every(_ => true)).toBeTruthy()
      })
      it("at least one element doesn't match the predicate", () => {
        list.add(0)
        expect(list.every(_ => false)).toBeFalsy()
      })
      it('list size: 0; an empty list resolves to true (predicate: all true)', () => {
        expect(list.every(_ => true)).toBeTruthy()
      })
    })
  })
}

function iteratorTests(list: IList<number>) {
  describe('iterator tests', () => {
    beforeEach(() => list.clear())
    it('iterates through list like a queue (FIFO)', () => {
      list.add(1)
      list.add(2)
      list.add(3)

      let results = [1, 2, 3]
      for (const number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      results = [1, 2, 3]
      for (const number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      list.clear()
      list.add(30)
      list.add(-30)
      list.add(10)
      list.add(40)

      expect(list.size).toBe(4)
      results = [30, -30, 10, 40]
      for (const number of list) {
        expect(number).toBe(results.shift())
      }
      expect(list.size).toBe(4)
      expect(results).toHaveLength(0)
    })
    it('iterates through list like a stack (LIFO) with a reverse iterator', () => {
      list.add(-1)
      list.add(-2)
      list.add(-3)
      let results = [-1, -2, -3]
      expect(list.size).toBe(3)
      for (const number of list.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(list.size).toBe(3)
      expect(results).toHaveLength(0)

      list.clear()
      list.add(30)
      list.add(-30)
      list.add(10)
      list.add(40)

      results = [30, -30, 10, 40]
      expect(list.size).toBe(4)
      for (const number of list.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(list.size).toBe(4)
      expect(results).toHaveLength(0)
    })
  })
}


describe('list backed by native array', () => {
  const list = new List<number>()
  commonListTests(list, List<number>)
  iteratorTests(list)
})
describe('linked list', () => {
  const list = new LinkedList<number>()
  linkedListTests(list, LinkedList<number>)
  iteratorTests(list)
})
describe('doubly linked list', () => {
  const list = new DoublyLinkedList<number>()
  linkedListTests(list, DoublyLinkedList<number>)
  iteratorTests(list)
})
describe('cyclic linked list', () => {
  const list = new CyclicDoublyLinkedList<number>()
  linkedListTests(list, CyclicDoublyLinkedList<number>)
  iteratorTests(list)
})
