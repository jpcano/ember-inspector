import { assign } from '@ember/polyfills';
import Route from '@ember/routing/route';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Route.extend({
  setupController(controller) {
    controller.set('circleData', this.generateRandomData());

    this._updateData(controller);
    this.get('port').on('route:routeTree', this, this.setTree);
    this.get('port').send('route:getTree');
  },

  setTree(options) {
    let routeArray = topSort(options.tree);
    this.set('controller.model', routeArray);
  },

  _updateData(controller) {
    run.later(
      this,
      function(controller) {
        controller.set('circleData', this.generateRandomData());
        this._updateData(controller);
      },
      controller,
      1e3
    );
  },

  generateRandomData() {
    let i = 0;
    let total = Math.ceil(Math.random() * 10) + 2;
    let data = [];

    while (++i < total) {
      let timestamp = Math.round(new Date().valueOf() / 1e3) + Math.floor(Math.random() * i * 1000);
      data.push({ value: Math.round(Math.random() * 100), timestamp });
    }

    return data.sort((a, b) => d3.ascending(a.timestamp, b.timestamp));
  }

});


function topSort(tree, list) {
  list = list || [];
  let route = assign({}, tree);
  delete route.children;
  // Firt node in the tree doesn't have a value
  if (route.value) {
    route.parentCount = route.parentCount || 0;
    list.push(route);
  }
  tree.children = tree.children || [];
  tree.children.forEach(child => {
    child.parentCount = route.parentCount + 1;
    topSort(child, list);
  });
  return list;
}
