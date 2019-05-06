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
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2, massi;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index]
        // ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        massi = (ri[0] + ri[2]) * (ri[1] + ri[3])
        tree.visit(apply);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r;
      const massj = (rj[0] + rj[2]) * (rj[1] + rj[3])
      if (data) {
        if (data.index > node.index) {
          // console.log('collide detected', data.name, node.name)
          var x = xi - data.x - data.vx, // distance on x axis, positive if node is right of quad
              y = yi - data.y - data.vy, // distance on y axis, positive if node is downer than quad
              l;
          const rx = x >= 0 ? ri[3] + rj[1] : ri[1] + rj[3] // adjcent disance
          const ry = y >= 0 ? ri[0] + rj[2] : ri[2] + rj[0] // adjcent disance
          const massRatio = massj / (massi + massj) // mass ratio, the heavier, the less to move
          if (Math.abs(x) < rx) {
            if (x === 0) {
              x = jiggle()
            }
            l = (rx - Math.abs(x)) / Math.abs(x) * strength; // distance delta ratio (with current distance)
            node.vx += (x * l) * massRatio;
            data.vx -= (x * l) * (1 - massRatio);
          }

          if (Math.abs(y) < ry) {
            if (y === 0) {
               y = jiggle()
            }
            l = (ry - Math.abs(y)) / Math.abs(y) * strength; // distance delta ratio (with current distance)
            node.vy += (y * l) * massRatio;
            data.vy -= (y * l) * (1 - massRatio);
          }
        }
        return;
      }
      // return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      return x0 - rj[3] > xi + ri[1] || x1 + rj[1] < xi - ri[3] || y0 - rj[0] > yi + ri[2] || y1 + rj[2] < yi - ri[0];
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
    quad.r = [0, 0, 0, 0]
    for (let i = 0; i < 4; ++i) { // children
      if (!quad[i]) continue
      for (let j = 0; j < 4; ++j) {
        quad.r[j] = Math.max(quad.r[j], quad[i].r[j])
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
