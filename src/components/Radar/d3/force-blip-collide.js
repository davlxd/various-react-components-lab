import { quadtree } from "d3-quadtree"
import * as d3 from 'd3'

const jiggle = () => (Math.random() - 0.5) * 1e-6
const constant = x => () => x

const x = d => d.x + d.vx
const y = d => d.y + d.vy


export default function(padding) {
  var nodes,
      radii,
      strength = 1,
      iterations = 1;

  if (typeof padding !== "function") padding = constant(padding == null ? [30, 30, 30, 30] : padding);

  function force() {
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index]
        // ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;  // adjcent disance
      if (data) {
        if (data.index > node.index) {
          var x = xi - data.x - data.vx, // distance on x axis, positive if node is right of quad
              y = yi - data.y - data.vy, // distance on y axis, positive if node is downer than quad
              l = x * x + y * y;  // square of distance
          if (l < r * r) {
            if (x === 0) {
              x = jiggle()
              l += x * x
            }
            if (y === 0) {
               y = jiggle()
               l += y * y
            }
            l = (r - (l = Math.sqrt(l))) / l * strength; // distance delta ratio (with current distance)
            r = (rj * rj) / (ri * ri + rj * rj)  // mass ratio, the heavier, the less to move
            node.vx += (x * l) * r;
            node.vy += (y * l) * r;
            data.vx -= (x * l) * (1 - r);
            data.vy -= (y * l) * (1 - r);
          }
        }
        return;
      }
      // return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      return x0 - rj[3] > xi + r[1] || x1 + rj[1] < xi - r[3] || y0 - rj[0] > yi + r[2] || y1 + rj[2] < yi - r[0];
    }
  }

  function prepare(quad) {
    if (quad.data) {  // if quad is leave, r is top, right, down, left (boundary length)
      return quad.r = radii[quad.data.index];
    }
    //
    // for (var i = quad.r = 0; i < 4; ++i) {
    //   if (quad[i] && quad[i].r > quad.r) {
    //     quad.r = quad[i].r;
    //   }
    // }

    // otherwise, r becomes into coordinate of top, right, down, left (absolute position)
    quad.r = [Infinity, -Infinity, -Infinity, Infinity]
    for (let i = 0; i < 4; ++i) { // children
      if (!quad[i]) continue
      for (let j = 0; j < 4; ++j) {
        quad.r[j] = Math.min(quad.r[j], quad[i].r[j])
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    // var i, n = nodes.length, node;
    radii = nodes.map((node, i) => padding(node, i, nodes))
    // radii = new Array(n);
    // for (i = 0; i < n; ++i) {
    //    node = nodes[i]
    //    radii[node.index] = +padding(node, i, nodes)
    //    radii[node.index] = 30
    // }
    console.log('radii', radii)
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.padding = function(_) {
    return arguments.length ? (padding = typeof _ === "function" ? _ : constant(_), initialize(), force) : padding;
  };

  return force;
}
