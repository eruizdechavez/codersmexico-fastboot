import Ember from 'ember';

export default Ember.Service.extend({
  fastboot: Ember.inject.service(),

  baseUrl: Ember.computed('fastboot.isFastBoot', function () {
    const fastboot = this.get('fastboot');
    const isFastBoot = fastboot.get('isFastBoot');
    const host = isFastBoot ? fastboot.get('request.host') : window.location.host;

    return `http://${host}`;
  })
});
