import Coalesce from 'coalesce';
import {setupContainer} from './container';

/**
  Create the default injections.
*/
Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "coalesce.context",

    initialize: function(container, application) {
      setupContainer(container, application);
    }
  });

});
