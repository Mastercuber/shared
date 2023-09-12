import {beforeEach, describe, expect, it} from "vitest";
import {Dequeue, IDequeue, IQueue, LinkedQueue, Ordering, PriorityQueue, Queue} from "../src";
function queueTests(queue: IQueue<number> | Dequeue<number> & {peek: () => number}) {
  describe("common queue tests", () => {
    beforeEach(() => {
      queue.clear()
    })
    it("adds items", () => {
      expect(queue.isEmpty()).toBeTruthy()
      expect(() => queue.dequeue()).toThrowError("no such element")

      queue.enqueue(-1)
      queue.enqueue(0)
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      queue.enqueue(4)

      expect(queue.dequeue()).toBe(-1)
      expect(queue.peek()).toBe(0)
      expect(queue.dequeue()).toBe(0)
      expect(queue.dequeue()).toBe(1)
      expect(queue.dequeue()).toBe(2)
      expect(queue.dequeue()).toBe(3)
      expect(queue.dequeue()).toBe(4)
      expect(() => queue.dequeue()).toThrowError("no such element")

      queue.enqueue(-100)
      queue.enqueue(-10)
      queue.enqueue(-1)

      expect(queue.dequeue()).toBe(-100)
      expect(queue.dequeue()).toBe(-10)
      expect(queue.dequeue()).toBe(-1)
      expect(() => queue.dequeue()).toThrowError("no such element")

      queue.enqueue(1)
      queue.enqueue(10)
      queue.enqueue(100)

      expect(queue.dequeue()).toBe(1)
      expect(queue.dequeue()).toBe(10)
      expect(queue.dequeue()).toBe(100)
      expect(() => queue.dequeue()).toThrowError("no such element")
    })
    it('gets items', () => {
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      const results = [1, 2, 3]
      for (let number of queue) {
        expect(number).toBe(results.shift())
      }
    });
    it("has correct size", () => {
      expect(queue.isEmpty()).toBeTruthy()
      queue.enqueue(1)
      expect(queue.size).toBe(1)
      queue.enqueue(2)
      expect(queue.size).toBe(2)
      queue.enqueue(3)
      expect(queue.size).toBe(3)
      queue.dequeue()
      expect(queue.size).toBe(2)
      queue.dequeue()
      expect(queue.size).toBe(1)
      queue.peek()
      expect(queue.size).toBe(1)
      queue.dequeue()
      expect(queue.size).toBe(0)
      expect(() => queue.dequeue()).toThrowError("no such element")

      queue.enqueue(-1)
      queue.enqueue(0)
      queue.enqueue(1)
      expect(queue.size).toBe(3)
      queue.dequeue()
      expect(queue.size).toBe(2)
      queue.peek()
      expect(queue.size).toBe(2)
      queue.dequeue()
      expect(queue.size).toBe(1)
      queue.dequeue()
      expect(queue.size).toBe(0)
      expect(() => queue.dequeue()).toThrowError("no such element")
    })
    it("clears the queue", () => {
      expect(queue.isEmpty()).toBeTruthy()
      expect(() => queue.dequeue()).toThrowError("no such element")

      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)

      expect(queue.size).toBe(3)
      queue.clear()
      expect(queue.isEmpty()).toBeTruthy()
      expect(() => queue.dequeue()).toThrowError("no such element")
    })
  })
}

function iteratorTest(queue: IQueue<number> | IDequeue<number>) {
  it('iterates through queue FIFO', () => {
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)

    const results = [1, 2, 3]
    for (let number of queue) {
      expect(number).toBe(results.shift())
    }
  });
}

describe("queues", () => {
  describe("queue with native array", () => {
    const queue = new Queue<number>()
    queueTests(queue);
    iteratorTest(queue);
  })
  describe("linked queue", () => {
    const queue = new LinkedQueue<number>()
    queueTests(queue)
    iteratorTest(queue)
  })
  describe("priority queue", () => {
    const queue = new PriorityQueue((n1: number, n2: number) => {
      if (typeof n1 === 'object') {
        return Ordering.GT
      }
      if (n1 === n2) return Ordering.EQ
      else if (n1 < n2) return Ordering.LT
      return Ordering.GT
    })
    queueTests(queue)
    iteratorTest(queue)
  })
  describe("dequeue", () => {
    const dequeue = <Dequeue<number>& {peek: () => number}> new Dequeue<number>()
    dequeue.peek = () => dequeue.head()
    queueTests(dequeue)
    iteratorTest(dequeue)
  })
})
