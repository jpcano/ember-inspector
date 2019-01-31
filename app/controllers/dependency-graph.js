import Controller from '@ember/controller';
import { computed } from '@ember/object';

const groups = {
  CONTROLLER: 1,
  ROUTE: 2,
  TEMPLATE: 3
};

export default Controller.extend({
  model: computed(() => []),

  routeTreeFormatted: computed('model.[]', function() {
    const tree = this.get('model');
    const nodes = [];
    const links = [];
    let i, j;

    for (i = 0, j = 0; i < tree.length; i += 1, j += 3) {
      nodes.push({
        id: j,
        name: tree[i].value.name,
        group: groups.ROUTE
      }, {
        id: j + 1,
        name: tree[i].value.controller.name,
        group: groups.CONTROLLER
      }, {
        id: j + 2,
        name: tree[i].value.template.name,
        group: groups.TEMPLATE
      });

      links.push({
        source_id: j,
        target_id: j + 1
      }, {
        source_id: j,
        target_id: j + 2
      });

      const parentCount = tree[i].parentCount;
      if (parentCount > 1) {
        const parentIdx = nodes.find(function(el) {
          const name = tree[i].value.name;
          const parentName = name.split('.').slice(-parentCount)[0];
          return el.name === parentName;
        });

        links.push({
          source_id: j,
          target_id: parentIdx
        });
      }
    }
    // return JSON.stringify({ nodes, links });
    return { nodes, links };
  }),

  rowsStringified: computed('model.[]', function() {
    return JSON.stringify(this.get('model'));
  }),

  init() {
    this._super();
    this.circleData = [];
  }
});
