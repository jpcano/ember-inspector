import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dependency-graph', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:dependency-graph');
    assert.ok(route);
  });
});
