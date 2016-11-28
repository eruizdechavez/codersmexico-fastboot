import Ember from 'ember';

export default Ember.Service.extend({
  fastboot: Ember.inject.service(),

  baseUrl: Ember.computed('fastboot.isFastBoot', function () {
    const isFastBoot = this.get('fastboot.isFastBoot');
    return isFastBoot ? 'http://localhost:8080' : `http://${window.location.host}`;
  })
});
