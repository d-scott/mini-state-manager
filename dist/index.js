'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(options) {
        _classCallCheck(this, Store);

        if (!options || !options.state) {
            throw new Error('[Store] No initial state passed');
        }

        if (!options.updates) {
            throw new Error('[Store] No updates passed');
        }

        this.update = this.update.bind(this);
        this.batchUpdate = this.batchUpdate.bind(this);

        var state = options.state,
            updates = options.updates,
            actions = options.actions;

        this._state = state;
        this._updates = updates;
        this._actions = actions;
        this._registeredCallbacks = [];
    }

    _createClass(Store, [{
        key: 'update',
        value: function update(type, payload) {
            if (!this._updates) {
                throw new Error('[Store] update() - No updates registered');
            }

            if (this._updates[type]) {
                this._updates[type](this.state, payload);
                this._notify([type]);
            }
        }
    }, {
        key: 'batchUpdate',
        value: function batchUpdate(updates) {
            var _this = this;

            if (!this._updates) {
                throw new Error('[Store] batchUpdate() - No updates registered');
            }

            var types = [];
            updates.forEach(function (update) {
                types.push(update.type);
                _this._updates[update.type](_this.state, update.payload);
            });
            this._notify(types);
        }
    }, {
        key: 'dispatchAction',
        value: function dispatchAction(type, payload) {
            if (!this._actions) {
                throw new Error('[Store] dispatchAction() - No actions registered');
            }

            if (this._actions[type]) {
                this._actions[type](this, payload);
            }
        }
    }, {
        key: 'register',
        value: function register(cb) {
            if (!this._registeredCallbacks) {
                throw new Error('[Store] register() - Cannot register callbacks, instance has been destroyed');
            }

            if (this._registeredCallbacks.indexOf(cb) < 0) {
                this._registeredCallbacks.push(cb);
            }
        }
    }, {
        key: 'deregister',
        value: function deregister(cb) {
            if (!this._registeredCallbacks) {
                throw new Error('[Store] deregister() - Cannot deregister callbacks, instance has been destroyed');
            }

            if (this._registeredCallbacks.indexOf(cb) >= 0) {
                this._registeredCallbacks.splice(this._registeredCallbacks.indexOf(cb), 1);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._state = null;
            this._updates = null;
            this._actions = null;
            this._registeredCallbacks = null;
        }
    }, {
        key: '_notify',
        value: function _notify(type) {
            this._registeredCallbacks.forEach(function (cb) {
                cb(type);
            });
        }
    }, {
        key: 'state',
        get: function get() {
            return this._state;
        }
    }]);

    return Store;
}();

exports.default = Store;