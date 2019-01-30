/*
 * This dummy component demonstrates how to use ember-d3 to build a simple
 * data visualization. It's an extension of the https://bost.ocks.org/mike/circles/
 * example with some more fancy elements.
 *
 * In this example we receive data from our dummy data source in the index route,
 * which sends us new data every second.
 *
 * When new data arrives we calculate 2 scales, one for x and y, representing
 * placement on the x plane, and relative size for the radius of the circles.
 *
 * The scale functions use some handy helpers from the d3-array package to figure
 * out the size of our dataset.
 *
 * We also initialize a transition object which will be used towards the end to
 * transition the data `merge` from new data to existing data.
 */

import Component from '@ember/component';
import layout from '../templates/components/dependency-graph';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

// Import the D3 packages we want to use
import d3 from 'd3';

export default Component.extend({
  layout,

  tagName: 'svg',
  classNames: ['awesome-d3-widget'],

  width: 1000,
  height: 600,

  attributeBindings: ['width', 'height'],

  // Array of points to render as circles in a line, spaced by time.
  //  [ {value: Number, timestamp: Number } ];
  init() {
    this._super();
    this.data = [];
  },

  didReceiveAttrs() {
    // Schedule a call to our `drawCircles` method on Ember's "render" queue, which will
    // happen after the component has been placed in the DOM, and subsequently
    // each time data is changed.
    run.scheduleOnce('render', this, this.drawCircles);
  },

  drawCircles() {
    const dataset = {
      "nodes": [
        {
          "index": 0,
          "id": "controller-1",
          "group": 1
        }, {
          "index": 1,
          "id": "controller-2",
          "group": 1
        }, {
          "index": 2,
          "id": "controller-3",
          "group": 1
        }, {
          "index": 3,
          "id": "route-1",
          "group": 2
        }, {
          "index": 4,
          "id": "route-2",
          "group": 2
        }, {
          "index": 5,
          "id": "route-3",
          "group": 2
        }, {
          "index": 6,
          "id": "service-1",
          "group": 4
        }, {
          "index": 7,
          "id": "service-2",
          "group": 4
        }, {
          "index": 8,
          "id": "servcice-3",
          "group": 4
        }, {
          "index": 9,
          "id": "service-4",
          "group": 4
        }, {
          "index": 10,
          "id": "service-5",
          "group": 4,
        },
      ],
      "links": [
        {
          "source": 6, //values are indexes for entities in `nodes` array
          "target": 1
        }, {
          "source": 6,
          "target": 2
        }, {
          "source": 6,
          "target": 3
        }, {
          "source": 6,
          "target": 2
        }, {
          "source": 6,
          "target": 5
        }, {
          "source": 7,
          "target": 4
        }, {
          "source": 6,
          "target": 4
        }, {
          "source": 3,
          "target": 7
        }, {
          "source": 2,
          "target": 1
        }, {
          "source": 8,
          "target": 3
        }, {
          "source": 8,
          "target": 5
        }, {
          "source": 4,
          "target": 6
        }, {
          "source": 8,
          "target": 2
        }, {
          "source": 1,
          "target": 2
        }, {
          "source": 6,
          "target": 7
        },
      ]
    }

  var width = get(this, 'width');
  var height = get(this, 'height');
  //Load Color Scale
  var c10 = d3.scale.category10();
  //Create an SVG element and append it to the DOM
  var svgElement = d3.select("body")
            .append("svg").attr({"width": width+margin.left+margin.right, "height": height+margin.top+margin.bottom})
            .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")");
    //Extract data from dataset
    var nodes = dataset.nodes;
    var links = dataset.links;
    //Create Force Layout
    var force = d3.layout.force()
            .size([width, height])
            .nodes(nodes)
            .links(links)
            .gravity(0.05)
            .charge(-200)
            .linkDistance(200);
    //Add links to SVG
    var link = svgElement.selectAll(".link")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke-width", 1)
          .attr("class", "link");
    //Add nodes to SVG
    var node = svgElement.selectAll(".node")
          .data(nodes)
          .enter()
          .append("g")
          .attr("class", "node")
          .call(force.drag);
    //Add labels to each node
    var label = node.append("text")
            .attr("dy", "0.35em")
            .attr("font-size", 12)
            .text(function(d){ return d.id; });
    //Add circles to each node
    var circle = node.append("circle")
            .attr("r", function(d){ return countInArray(d.index, links) * 3 || 3 })
            .attr("fill", function(d){ return c10(d.group*10); });
    //This function will be executed for every tick of force layout
    force.on("tick", function(){
      //Set X and Y of node
      node.attr("r", function(d){ return 10; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; });
      //Set X, Y of link
      link.attr("x1", function(d){ return d.source.x; })
      link.attr("y1", function(d){ return d.source.y; })
      link.attr("x2", function(d){ return d.target.x; })
      link.attr("y2", function(d){ return d.target.y; });
      //Shift node a little
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
    //Start the force layout calculation
    force.start();

    function countInArray(subject, array) {
      return array.reduce(function(acc, current){
        if (current.target === subject) {
          acc++;
        }
        return acc;
      }, 0);
    }
  }
});
