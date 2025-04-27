import { bench, describe, expect } from 'vitest'
import c from 'chalk'
import { Dequeue, IQueue, LinkedQueue, numberComparatorASC, PriorityQueue, Queue } from '../../src'

const options = {
  time: 50,
  iterations: 1000,
  warmupTime: 100,
  warmupIterations: 1000,
}

function fill(queue: IQueue<number>) {
  queue.enqueue(5)
  queue.enqueue(4)
  queue.enqueue(3)
  queue.enqueue(2)
  queue.enqueue(1)
}
describe(c.blue('queue (enqueue)'), () => {
  function queueAddTest(queueType: new(options?: any) => IQueue<number>, isPriorityQueueTested = false) {
    let queue
    if (isPriorityQueueTested) {
      queue = new queueType(numberComparatorASC)
    } else {
      queue = new queueType()
    }
    fill(queue)
  }

  bench('Queue', () => {
    queueAddTest(Queue)
  }, options)
  bench('LinkedQueue', () => {
    queueAddTest(LinkedQueue)
  }, options)
  bench('PriorityQueue', () => {
    queueAddTest(PriorityQueue, true)
  }, options)
  bench('Dequeue', () => {
    queueAddTest(Dequeue)
  }, options)
})
describe(c.blue('queue (dequeue)'), () => {
  function queueDequeueTest(queueType: new(options?: any) => IQueue<number>, isPriorityQueueTested = false) {
    let queue
    if (isPriorityQueueTested) {
      queue = new queueType(numberComparatorASC)
    } else {
      queue = new queueType()
    }
    fill(queue)

    if (isPriorityQueueTested) {
      expect(queue.dequeue()).toBe(1)
      expect(queue.dequeue()).toBe(2)
      expect(queue.dequeue()).toBe(3)
      expect(queue.dequeue()).toBe(4)
      expect(queue.dequeue()).toBe(5)
    } else {
      expect(queue.dequeue()).toBe(5)
      expect(queue.dequeue()).toBe(4)
      expect(queue.dequeue()).toBe(3)
      expect(queue.dequeue()).toBe(2)
      expect(queue.dequeue()).toBe(1)
    }
  }

  bench('Queue', () => {
    queueDequeueTest(Queue)
  }, options)
  bench('LinkedQueue', () => {
    queueDequeueTest(LinkedQueue)
  }, options)
  bench('PriorityQueue', () => {
    queueDequeueTest(PriorityQueue, true)
  }, options)
  bench('Dequeue', () => {
    queueDequeueTest(Dequeue)
  }, options)
})
