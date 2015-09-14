import Coalesce from 'coalesce';
import applyEmber from '../utils/apply_ember';
import Model from 'coalesce/model/model';
import Field from 'coalesce/model/field';
import CoreAttribute from 'coalesce/model/attribute';
import CoreHasMany from 'coalesce/model/has_many';
import CoreBelongsTo from 'coalesce/model/belongs_to';
import HasManyArray from '../collections/has_many_array';

var CoreObject = Ember.CoreObject;
var Observable = Ember.Observable;
var Mixin = Ember.Mixin;

var merge = _.merge,
    defaults = _.defaults;


var EmberModel = applyEmber(Model, ['fields', 'ownFields', 'inverseFor', 'attributes', 'relationships', 'defineField', 'defineSchema'], Observable, {
  
  metaWillChange: function(name) {
    Model.prototype.metaWillChange.apply(this, arguments);
    Ember.propertyWillChange(this, name);
    if(name === 'id') {
      Ember.propertyWillChange(this, 'isNew');
    }
  },
  
  metaDidChange: function(name) {
    Model.prototype.metaDidChange.apply(this, arguments);
    Ember.propertyDidChange(this, name);
    if(name === 'id') {
      Ember.propertyDidChange(this, 'isNew');
    }
  },
  
  attributeWillChange: function(name) {
    Model.prototype.attributeWillChange.apply(this, arguments);
    Ember.propertyWillChange(this, name);
  },
  
  attributeDidChange: function(name) {
    Model.prototype.attributeDidChange.apply(this, arguments);
    Ember.propertyDidChange(this, name);
  },
  
  belongsToWillChange: function(name) {
    Model.prototype.belongsToWillChange.apply(this, arguments);
    Ember.propertyWillChange(this, name);
  },
  
  belongsToDidChange: function(name) {
    Model.prototype.belongsToDidChange.apply(this, arguments);
    Ember.propertyDidChange(this, name);
  },
  
  hasManyWillChange: function(name) {
    Model.prototype.hasManyWillChange.apply(this, arguments);
    Ember.propertyWillChange(this, name);
  },
  
  hasManyDidChange: function(name) {
    Model.prototype.hasManyDidChange.apply(this, arguments);
    Ember.propertyDidChange(this, name);
  },
  
  didDefineProperty: function(obj, keyName, value) {
    if(value instanceof Attr) {
      obj.constructor.defineField(new CoreAttribute(keyName, value));
    } else if (value instanceof BelongsTo) {
      obj.constructor.defineField(new CoreBelongsTo(keyName, value));
    } else if(value instanceof HasMany) {
      obj.constructor.defineField(new CoreHasMany(keyName, value));
    }
  },
  
  willWatchProperty(key) {
    if(this.isManaged && this.shouldTriggerLoad(key)) {
      Coalesce.backburner.scheduleOnce('actions', this, this.load);
    }
  }
  
});

function Attr(type, options={}) {
  defaults(options, {
    type: type
  });
  merge(this, options);
  return this;
}

function attr(type, options={}) {
  return new Attr(type, options);
}

function HasMany(type, options={}) {
  defaults(options, {
    kind: 'hasMany',
    collectionType: HasManyArray,
    type: type
  });
  merge(this, options);
  return this;
}

function hasMany(type, options={}) {
  return new HasMany(type, options);
}

function BelongsTo(type, options={}) {
  defaults(options, {
    kind: 'belongsTo',
    type: type
  });
  merge(this, options);
  return this;
}

function belongsTo(type, options={}) {
  return new BelongsTo(type, options);
}

var META_KEYS = ['id', 'clientId', 'rev', 'clientRev', 'errors', 'isDeleted'];

EmberModel.reopenClass({
  
  create: function(hash) {
    // Need to not set fields via Ember initProperties since they depend on
    // the underlying Model constructor being ran
    var fields = {};
    for(var key in hash) {
      if(!hash.hasOwnProperty(key)) continue;
      if(this.fields.get(key) || META_KEYS.indexOf(key) !== -1) {
        fields[key] = hash[key];
        delete hash[key];
      }
    }
    var res = this._super.apply(this, arguments);
    for(var key in fields) {
      if(!fields.hasOwnProperty(key)) continue;
      res[key] = fields[key];
    }
    return res;
  },
  
  extend: function() {
    var klass = this._super.apply(this, arguments);
    // eagerly setup the prototype
    klass.proto();
    return klass;
  },
  
  reify(...args) {
    // no need to reify the root class
    if(this === EmberModel) {
      return;
    }
    
    return this._super.apply(this, args);
  }
  
});

export {attr, hasMany, belongsTo};

export default EmberModel;
