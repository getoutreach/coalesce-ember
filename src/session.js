import Session from 'coalesce/session/session';
import {ModelPromise, PromiseArray} from './promise';
import EmberModel from './model/model';

/**
  @class Session
  
  Similar to the core Coalesce.js session, but with additional Ember.js
  niceties.
*/
export default class EmberSession extends Session {
  
  /**
    Ensures data is loaded for a model.

    @returns {Promise}
  */
  loadModel(model, opts) {
    if(model instanceof EmberModel) {
      return ModelPromise.create({
        content: model,
        promise: super.loadModel(model, opts)
      });
    } else {
      return super.loadModel(model, opts);
    }
  }

  query(type, query, opts) {
    type = this._typeFor(type);
    var res = super.query(type, query, opts);
    if(type.prototype instanceof EmberModel) {
      return PromiseArray.create({
        promise: res
      });
    } else {
      return res;
    }
  }

}
