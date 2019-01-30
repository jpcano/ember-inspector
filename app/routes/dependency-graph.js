import Route from '@ember/routing/route';
import { run } from '@ember/runloop';
import d3 from 'd3';

export default Route.extend({
  setupController(controller) {
    controller.set('circleData', this.generateRandomData());

    this._updateData(controller);
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
