import DebugAdapter from './debug/debug_adapter';
import Session from './session';
import Errors from './model/errors';

function setupContainerForEmber(container, application) {
  container.register('session:application', Session);
  
  new application.CoalesceContext(null, container);
  
  container.register('model:errors', Errors);
  
  container.typeInjection('controller', 'session', 'session:main');
  container.typeInjection('route', 'session', 'session:main');
  
  if(Ember.DataAdapter) {
    container.typeInjection('data-adapter', 'session', 'session:main');
    container.register('data-adapter:main', DebugAdapter);
  }
}

export {setupContainerForEmber as setupContainer}
