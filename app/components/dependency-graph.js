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

  width: 1800,
  height: 1400,

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
    const svg = d3.select(this.element);
    const width = get(this, 'width');
    const height = get(this, 'height');

    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-18))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const graph = get(this, 'data');
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    graph.links.forEach(function(d) {
      d.source = d.source_id;
      d.target = d.target_id;
    });

    const link = svg.append("g")
      .style("stroke", "#aaa")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line");

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 12)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class", "label")
      .text(function(d) { return d.name; });

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("r", function(d) { return countInArray(d.index, graph.links) * 10 || 10; })
        .style("fill", function(d) { return color(d.group); })
        .style("stroke", "#969696")
        .style("stroke-width", "1px")
        .attr("cx", function (d) { return d.x + 6; })
        .attr("cy", function(d) { return d.y - 6; });

      label
        .attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .style("font-size", "12px").style("fill", "#222");
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      simulation.fix(d);
    }

    function dragged(d) {
      simulation.fix(d, d3.event.x, d3.event.y);
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      simulation.unfix(d);
    }

    function countInArray(subject, array) {
      return array.reduce(function(acc, current) {
        if (current.target_id === subject) {
          acc++;
        }
        return acc;
      }, 0);
    }
  }
});
