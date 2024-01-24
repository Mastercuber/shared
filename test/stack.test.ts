import {beforeEach, describe, expect, it} from 'vitest'
import {
  CyclicDoublyLinkedList,
  Dequeue,
  DoublyLinkedList,
  IStack,
  LinkedList,
  LinkedQueue,
  LinkedStack,
  List,
  numberComparator,
  PriorityQueue,
  Queue,
  Stack
} from '../src'

function stackTests(stack: IStack<number>, stackType: new (elements: Iterable<number>) => IStack<number>) {
  describe('common tests', () => {
    beforeEach(() => {
      stack.clear()
    })
    describe('construct new Stack', () => {
      it('from native Array', () => {
        const _stack = new stackType([-1, 0, 1])

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from native Set', () => {
        const _stack = new stackType(new Set([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from Queue', () => {
        const _stack = new stackType(new Queue([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from LinkedQueue', () => {
        const _stack = new stackType(new LinkedQueue([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from PriorityQueue', () => {
        const _stack = new stackType(new PriorityQueue(numberComparator, [-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from Dequeue', () => {
        const _stack = new stackType(new Dequeue([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from Stack', () => {
        const _stack = new stackType(new Stack([1, 0, -1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from LinkedStack', () => {
        const _stack = new stackType(new LinkedStack([1, 0, -1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from List', () => {
        const _stack = new stackType(new List([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from LinkedList', () => {
        const _stack = new stackType(new LinkedList([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from DoublyLinkedList', () => {
        const _stack = new stackType(new DoublyLinkedList([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
      it('from CyclicDoublyLinkedList', () => {
        const _stack = new stackType(new CyclicDoublyLinkedList([-1, 0, 1]))

        expect(_stack.size).toBe(3)
        expect(_stack.pop()).toBe(1)
        expect(_stack.pop()).toBe(0)
        expect(_stack.pop()).toBe(-1)
        expect(_stack.size).toBe(0)
      })
    })

    describe('add elements', () => {
      it('should add elements', () => {
        expect(stack.isEmpty()).toBeTruthy()
        expect(() => stack.pop()).toThrowError('no such element')

        stack.push(-1)
        stack.push(0)
        stack.push(1)
        stack.push(2)
        stack.push(3)
        stack.push(4)

        expect(stack.pop()).toBe(4)
        expect(stack.pop()).toBe(3)
        expect(stack.pop()).toBe(2)
        expect(stack.pop()).toBe(1)
        expect(stack.pop()).toBe(0)
        expect(stack.pop()).toBe(-1)
        expect(() => stack.pop()).toThrowError('no such element')

        stack.push(-100)
        stack.push(-10)
        stack.push(-1)

        expect(stack.pop()).toBe(-1)
        expect(stack.pop()).toBe(-10)
        expect(stack.pop()).toBe(-100)
        expect(() => stack.pop()).toThrowError('no such element')

        stack.push(1)
        stack.push(10)
        stack.push(100)

        expect(stack.pop()).toBe(100)
        expect(stack.pop()).toBe(10)
        expect(stack.pop()).toBe(1)
        expect(() => stack.pop()).toThrowError('no such element')
      })
      it('should add "null" elements', () => {
        stack.push(null!)
        expect(stack.size).toBe(1)
        expect(stack.top()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.size).toBe(0)

        stack.push(null!)
        stack.push(null!)
        expect(stack.size).toBe(2)
        expect(stack.top()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.size).toBe(0)

        stack.push(null!)
        stack.push(null!)
        stack.push(null!)
        expect(stack.size).toBe(3)
        expect(stack.top()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.pop()).toBeNull()
        expect(stack.size).toBe(0)

        expect(() => stack.top()).toThrowError('no such element')
      })
      it('should not add "undefined" elements', () => {
        stack.push(undefined!)
        expect(stack.size).toBe(0)
        expect(() => stack.top()).toThrowError('no such element')
      })
    })
    it('gets elements', () => {
      stack.push(0)
      stack.push(1)
      stack.push(2)
      stack.push(3)

      expect(stack.pop()).toBe(3)
      expect(stack.pop()).toBe(2)
      expect(stack.pop()).toBe(1)
      expect(stack.pop()).toBe(0)
    })
    it('has correct size', () => {
      expect(stack.isEmpty()).toBeTruthy()
      expect(stack.size).toBe(0)
      stack.push(1)
      expect(stack.size).toBe(1)
      stack.push(2)
      expect(stack.size).toBe(2)
      stack.push(3)
      expect(stack.size).toBe(3)
      stack.pop()
      expect(stack.size).toBe(2)
      stack.pop()
      expect(stack.size).toBe(1)
      stack.top()
      expect(stack.size).toBe(1)
      stack.pop()
      expect(stack.size).toBe(0)
      expect(() => stack.pop()).toThrowError('no such element')

      stack.push(-1)
      stack.push(0)
      stack.push(1)
      expect(stack.size).toBe(3)
      stack.pop()
      expect(stack.size).toBe(2)
      stack.top()
      expect(stack.size).toBe(2)
      stack.pop()
      expect(stack.size).toBe(1)
      stack.pop()
      expect(stack.size).toBe(0)
      expect(() => stack.pop()).toThrowError('no such element')
    })
    it('clears the stack', () => {
      expect(stack.isEmpty()).toBeTruthy()
      expect(() => stack.pop()).toThrowError('no such element')

      stack.push(1)
      stack.push(2)
      stack.push(3)

      expect(stack.size).toBe(3)
      stack.clear()
      expect(stack.isEmpty()).toBeTruthy()
      expect(() => stack.pop()).toThrowError('no such element')
    })
    it('contains elements', () => {
      stack.push(1)
      stack.push(-1)
      stack.push(0)
      stack.push(2)
      stack.push(-2)
      stack.push(-3)
      stack.push(3)
      stack.comparator = numberComparator
      expect(stack.contains(-4)).toBeFalsy()
      expect(stack.contains(-3)).toBeTruthy()
      expect(stack.contains(-2)).toBeTruthy()
      expect(stack.contains(-1)).toBeTruthy()
      expect(stack.contains(0)).toBeTruthy()
      expect(stack.contains(1)).toBeTruthy()
      expect(stack.contains(2)).toBeTruthy()
      expect(stack.contains(3)).toBeTruthy()
      expect(stack.contains(4)).toBeFalsy()
    })
  })
}

function iteratorTest(stack: IStack<number>) {
  beforeEach(() => {
    stack.clear()
  })
  it('iterates through stack LIFO', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    let results = [1, 2, 3]
    expect(stack.size).toBe(3)
    for (const number of stack) {
      expect(number).toBe(results.pop())
    }
    expect(stack.size).toBe(3)
    expect(results).toHaveLength(0)
    results = [1, 2, 3]
    for (const number of stack) {
      expect(number).toBe(results.pop())
    }
    expect(stack.size).toBe(3)
    expect(results).toHaveLength(0)
    stack.clear()
  })
}

describe('stacks', () => {
  describe('stack backed by native array', () => {
    const stack = new Stack<number>()
    stackTests(stack, Stack<number>)
    iteratorTest(stack)
  })
  describe('linked stack', () => {
    const stack = new LinkedStack<number>()
    stackTests(stack, LinkedStack<number>)
    iteratorTest(stack)
  })
})
