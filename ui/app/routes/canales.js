import Ember from 'ember';
import FetchData from 'codersmexico/mixins/fetch-data';

export default Ember.Route.extend(FetchData, {
  model () {
    return this.fetchData('canales');
  }
});
