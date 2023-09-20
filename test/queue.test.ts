import {beforeEach, describe, expect, it} from "vitest";
import {
  Collection, Comparator,
  Dequeue,
  IDequeue,
  IQueue,
  LinkedQueue,
  numberComparator,
  Ordering,
  PriorityQueue,
  Queue
} from "../src";
type QueueType = (new (collection: Collection<number>) => IQueue<number>) | (new (comparator: Comparator<number>, collection?: Collection<number>) => IQueue<number>)
function queueTests(queue: IQueue<number>, queueType: QueueType, priorityQueueTests = false) {
  describe("common queue tests", () => {
    beforeEach(() => {
      queue.clear()
    })
    it('should construct a new Queue from given collection', () => {
      let _queue
      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, [1, 2, 3])
      } else {
        // @ts-ignore
        _queue = new queueType([1,2,3])
      }
      expect(_queue.size).toBe(3)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.dequeue()).toBe(2)
      expect(_queue.dequeue()).toBe(3)
      expect(_queue.size).toBe(0)

      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, new Set([-1, 1, 0]))
      } else {
        // @ts-ignore
        _queue = new queueType(new Set([-1, 0, 1]))
      }

      expect(_queue.size).toBe(3)
      expect(_queue.dequeue()).toBe(-1)
      expect(_queue.dequeue()).toBe(0)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.size).toBe(0)

      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, new Queue([1, -1, 0, 2]))
      } else {
        // @ts-ignore
        _queue = new queueType(new Queue([-1, 0, 1, 2]))
      }

      expect(_queue.size).toBe(4)
      expect(_queue.dequeue()).toBe(-1)
      expect(_queue.dequeue()).toBe(0)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.dequeue()).toBe(2)
      expect(_queue.size).toBe(0)

      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, new LinkedQueue([0, 1, 2, -1]))
      } else {
        // @ts-ignore
        _queue = new queueType(new LinkedQueue([-1, 0, 1, 2]))
      }

      expect(_queue.size).toBe(4)
      expect(_queue.dequeue()).toBe(-1)
      expect(_queue.dequeue()).toBe(0)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.dequeue()).toBe(2)
      expect(_queue.size).toBe(0)

      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, new PriorityQueue(numberComparator, [0, 2, -1, 1]))
      } else {
        // @ts-ignore
        _queue = new queueType(new PriorityQueue(numberComparator, [2, 0, -1, 1]))
      }

      expect(_queue.size).toBe(4)
      expect(_queue.dequeue()).toBe(-1)
      expect(_queue.dequeue()).toBe(0)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.dequeue()).toBe(2)
      expect(_queue.size).toBe(0)

      if (priorityQueueTests) {
        // @ts-ignore
        _queue = new queueType(numberComparator, new Dequeue([0, 2, -1, 1]))
      } else {
        // @ts-ignore
        _queue = new queueType(new Dequeue([-1, 0, 1, 2]))
      }

      expect(_queue.size).toBe(4)
      expect(_queue.dequeue()).toBe(-1)
      expect(_queue.dequeue()).toBe(0)
      expect(_queue.dequeue()).toBe(1)
      expect(_queue.dequeue()).toBe(2)
      expect(_queue.size).toBe(0)
    })
    it('should be possible to add "null" values to the queue', () => {
      queue.enqueue(null!)
      expect(queue.size).toBe(1)
      expect(queue.head()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.size).toBe(0)

      queue.enqueue(null!)
      queue.enqueue(null!)
      expect(queue.size).toBe(2)
      expect(queue.head()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.size).toBe(0)

      queue.enqueue(null!)
      queue.enqueue(null!)
      queue.enqueue(null!)
      expect(queue.size).toBe(3)
      expect(queue.head()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.dequeue()).toBeNull()
      expect(queue.size).toBe(0)
    });
    it('should not be possible to add "undefined" values to the queue', () => {
      queue.enqueue(undefined!)
      expect(queue.size).toBe(0)
    });
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
      expect(queue.head()).toBe(0)
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
      queue.clear()

      expect(() => queue.head()).toThrowError("no such element")
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
      queue.head()
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
      queue.head()
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

    expect(queue.size).toBe(3)
    let results = [1, 2, 3]
    for (let number of queue) {
      expect(number).toBe(results.shift())
    }
    expect(queue.size).toBe(3)
    expect(results).toHaveLength(0)
    results = [1, 2, 3]
    for (let number of queue) {
      expect(number).toBe(results.shift())
    }
    expect(queue.size).toBe(3)
    expect(results).toHaveLength(0)

    queue.clear()
    let count = 0
    for (let {} of queue) {
      count++
    }
    expect(count).toBe(0)

    if (queue instanceof Dequeue) {
      queue.clear()
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      results = [1, 2, 3]
      for (let number of queue.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(queue.size).toBe(3)
      expect(results).toHaveLength(0)
      queue.clear()

      let count = 0
      for (let {} of queue.reverseIterator()) {
        count++
      }
      expect(count).toBe(0)

      results = [1]
      queue.push(1)
      for (let number of queue.reverseIterator()) {
        expect(number).toBe(results.pop())
      }
      expect(queue.size).toBe(1)
      expect(results).toHaveLength(0)
    }
  });
}

describe("queues", () => {
  describe("queue backed by native array", () => {
    const queue = new Queue<number>()
    queueTests(queue, Queue<number>);
    iteratorTest(queue);
  })
  describe("linked queue", () => {
    const queue = new LinkedQueue<number>()
    queueTests(queue, LinkedQueue<number>)
    iteratorTest(queue)
  })
  describe("priority queue", () => {
    const queue = new PriorityQueue((n1: number, n2: number) => {
      if (n1 === n2) return Ordering.EQ
      else if (n1 < n2) return Ordering.LT
      return Ordering.GT
    })
    queueTests(queue, PriorityQueue<number>, true)
    iteratorTest(queue)
  })
  describe("dequeue", () => {
    const dequeue = new Dequeue<number>()
    queueTests(dequeue, Dequeue<number>)
    iteratorTest(dequeue)
    beforeEach(() => {
      dequeue.clear()
    })
    it('should enqueue, push, dequeue and pop items to and from the dequeu', () => {
      dequeue.push(-1)
      dequeue.push(0)
      dequeue.push(1)
      expect(dequeue.size).toBe(3)
      expect(dequeue.top()).toBe(-1)
      expect(dequeue.dequeue()).toBe(1)
      expect(dequeue.top()).toBe(-1)
      expect(dequeue.pop()).toBe(-1)
      expect(dequeue.top()).toBe(0)
      expect(dequeue.head()).toBe(0)
      expect(dequeue.size).toBe(1)
      expect(dequeue.dequeue()).toBe(0)
      expect(dequeue.size).toBe(0)
    });
    it('should push and pop items to and from the dequeue', () => {
      dequeue.push(-1)
      dequeue.push(0)
      dequeue.push(1)
      expect(dequeue.size).toBe(3)
      expect(dequeue.top()).toBe(-1)
      expect(dequeue.pop()).toBe(-1)
      expect(dequeue.top()).toBe(0)
      expect(dequeue.pop()).toBe(0)
      expect(dequeue.top()).toBe(1)
      expect(dequeue.size).toBe(1)
      expect(dequeue.pop()).toBe(1)
      expect(dequeue.size).toBe(0)
      dequeue.clear()

      dequeue.push(1)
      expect(dequeue.size).toBe(1)
      expect(dequeue.top()).toBe(1)
      expect(dequeue.pop()).toBe(1)
      expect(dequeue.size).toBe(0)

      expect(() => dequeue.top()).toThrowError("no such element")
      expect(() => dequeue.head()).toThrowError("no such element")
    });
    it('should peek the top and head elements', () => {
      dequeue.enqueue(-10)
      dequeue.enqueue(0)
      dequeue.enqueue(10)
      expect(dequeue.size).toBe(3)

      expect(dequeue.head()).toBe(-10)
      expect(dequeue.top()).toBe(10)
      expect(dequeue.pop()).toBe(10)

      expect(dequeue.head()).toBe(-10)
      expect(dequeue.top()).toBe(0)
      expect(dequeue.pop()).toBe(0)

      expect(dequeue.head()).toBe(-10)
      expect(dequeue.top()).toBe(-10)
      expect(dequeue.pop()).toBe(-10)
      expect(() => dequeue.pop()).toThrowError("no such element")
      expect(() => dequeue.dequeue()).toThrowError("no such element")
      expect(dequeue.size).toBe(0)

    });
  })
})
