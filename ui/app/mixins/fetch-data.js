import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Mixin.create({
  fastboot: Ember.inject.service(),
  location: Ember.inject.service(),

  fetchData (scope) {
    const baseUrl = this.get('location.baseUrl');
    const shoebox = this.get('fastboot.shoebox');
    const isFastBoot = this.get('fastboot.isFastBoot');
    let shoeboxStore = shoebox.retrieve('my-store');

    if (isFastBoot && !shoeboxStore) {
      shoeboxStore = {};
      shoebox.put('my-store', shoeboxStore);
    }

    if (shoeboxStore && shoeboxStore[scope]) {
      const data = shoeboxStore[scope];
      shoeboxStore[scope] = null;
      return data;
    }

    return fetch(`${baseUrl}/api/${scope}`)
      .then(response => response.json())
      .then(data => {
        if (isFastBoot) {
          shoeboxStore[scope] = data;
        }

        return data;
      });
  }
});
