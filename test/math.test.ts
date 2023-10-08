import {describe, expect, it} from 'vitest'
import {Point} from '../src'

describe('math tests', () => {
  it('should create a point', () => {
    const p = new Point()
    expect(p).not.toBeNull
    expect(p.x).toBe(0)
    expect(p.y).toBe(0)
    expect(p.z).toBe(0)

    const point = new Point(1, 2, 3)
    expect(point).not.toBeNull
    expect(point.x).toBe(1)
    expect(point.y).toBe(2)
    expect(point.z).toBe(3)
  })

});
