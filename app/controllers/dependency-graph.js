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
    let i;

    for (i = 0; i < tree.length; i += 3) {
      nodes.push({
        id: i,
        name: tree[i].value.name,
        group: groups.ROUTE
      }, {
        id: i + 1,
        name: tree[i].value.controller.name,
        group: groups.CONTROLLER
      }, {
        id: i + 2,
        name: tree[i].value.template.name,
        group: groups.TEMPLATE
      });

      links.push({
        source_id: i,
        target_id: i + 1
      }, {
        source_id: i,
        target_id: i + 2
      });
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
