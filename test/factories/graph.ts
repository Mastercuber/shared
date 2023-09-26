// @ts-ignore
import {Graph, Vertex} from "@/";
import {Comparator, Ordering} from "../../src";

export let comparator: Comparator<Vertex> = (v1, v2) => v1.uuid === v2.uuid ? Ordering.EQ : v1.outdeg() < v2.outdeg() ? Ordering.LT : Ordering.GT

export class GraphFactory {
    static createDirectedGraphA() {
        const a = new Vertex({ title: "A" })
        const b = new Vertex({ title: "B" })
        const c = new Vertex({ title: "C" })
        const d = new Vertex({ title: "D" })
        const e = new Vertex({ title: "E" })

        const graph = new Graph({
            vertices: new Set([a, b, c, d, e])
        }, comparator);
        graph.createEdge(a, c)
        graph.createEdge(c, d)
        graph.createEdge(c, b)
        graph.createEdge(b, a)
        graph.createEdge(d, a)
        graph.createEdge(c, e)
        graph.createEdge(e, a)

        graph.infer()
        return graph
    }

    static createDirectedGraphB() {
        const _1 = new Vertex({ title: "1" })
        const _2 = new Vertex({ title: "2" })
        const _3 = new Vertex({ title: "3" })
        const _4 = new Vertex({ title: "4" })
        const _5 = new Vertex({ title: "5" })
        const _6 = new Vertex({ title: "6" })
        const _7 = new Vertex({ title: "7" })
        const _8 = new Vertex({ title: "8" })
        const _9 = new Vertex({ title: "9" })
        const _10 = new Vertex({ title: "10" })
        const _11 = new Vertex({ title: "11" })
        const _12 = new Vertex({ title: "12" })
        const _13 = new Vertex({ title: "13" })

        const graph = new Graph({
            vertices: new Set([_1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13])
        }, comparator)
        graph.createEdge(_1, _2)
        graph.createEdge(_2, _4)
        graph.createEdge(_4, _3)
        graph.createEdge(_3, _1)
        graph.createEdge(_5, _3)
        graph.createEdge(_5, _4)
        graph.createEdge(_5, _6)
        graph.createEdge(_6, _7)
        graph.createEdge(_7, _5)
        graph.createEdge(_8, _10)
        graph.createEdge(_10, _9)
        graph.createEdge(_9, _8)
        graph.createEdge(_10, _11)
        graph.createEdge(_11, _10)
        graph.createEdge(_11, _13)
        graph.createEdge(_12, _11)

        graph.infer()
        return graph
    }

    static createDirectedGraph118() {
        const _1 = new Vertex({ title: "1" })
        const _2 = new Vertex({ title: "2" })
        const _3 = new Vertex({ title: "3" })
        const _4 = new Vertex({ title: "4" })
        const _5 = new Vertex({ title: "5" })
        const _6 = new Vertex({ title: "6" })
        const _7 = new Vertex({ title: "7" })

        const graph = new Graph({
            vertices: new Set([_1, _2, _3, _4, _5, _6, _7]),
            title: 'example graph 118'
        }, comparator)
        graph.createEdge(_1, _4)
        graph.createEdge(_4, _6)
        graph.createEdge(_7, _4)
        graph.createEdge(_7, _2)
        graph.createEdge(_4, _2)
        graph.createEdge(_2, _3)
        graph.createEdge(_5, _3)

        graph.infer()
        return graph
    }

    static createDirectedWeightedGraphG() {
        const C = new Vertex({ title: "C" })
        const D = new Vertex({ title: "D" })
        const E = new Vertex({ title: "E" })
        const F = new Vertex({ title: "F" })
        const G = new Vertex({ title: "G" })
        const H = new Vertex({ title: "H" })

        const graph = new Graph({
            vertices: new Set([C, D, E, F, G, H]),
            title: 'example graph G'
        }, comparator)

        graph.createEdge(C, D, 'C -> D', true, 3)
        graph.createEdge(C, E, 'C -> E', true, 2)
        graph.createEdge(D, F, 'D -> F', true, 4)
        graph.createEdge(E, D, 'E -> D', true, 1)
        graph.createEdge(E, F, 'E -> F', true, 2)
        graph.createEdge(E, G, 'E -> G', true, 3)
        graph.createEdge(F, G, 'F -> G', true, 2)
        graph.createEdge(F, H, 'F -> H', true, 1)
        graph.createEdge(G, H, 'G -> H', true, 2)

        graph.infer()
        return graph
    }

    static createUndirectedWeightedC() {
        const A = new Vertex({ title: 'A' })
        const B = new Vertex({ title: 'B' })
        const C = new Vertex({ title: 'C' })
        const D = new Vertex({ title: 'D' })
        const E = new Vertex({ title: 'E' })

        const graph = new Graph({
            vertices: new Set([A, B, C, D, E]),
            title: 'example graph G'
        }, comparator)

        graph.createEdge(D, C, 'D -> C', false, 1)
        graph.createEdge(C, E, 'C -> E', false, 1)
        graph.createEdge(C, B, 'C -> B', false, 2)
        graph.createEdge(C, A, 'C -> A', false, 3)
        graph.createEdge(B, E, 'B -> E', false, 5)
        graph.createEdge(A, B, 'A -> B', false, 2)

        graph.infer()

        return graph
    }
}
