import Ember from 'ember';
import FetchDataMixin from 'codersmexico/mixins/fetch-data';
import { module, test } from 'qunit';

module('Unit | Mixin | fetch data');

// Replace this with your real tests.
test('it works', function(assert) {
  let FetchDataObject = Ember.Object.extend(FetchDataMixin);
  let subject = FetchDataObject.create();
  assert.ok(subject);
});
