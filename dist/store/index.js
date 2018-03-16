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

        if (!options.stateUpdates) {
            throw new Error('[Store] No stateUpdates passed');
        }

        var state = options.state,
            stateUpdates = options.stateUpdates;

        this._state = state;
        this._stateUpdates = stateUpdates;
        this._registeredCallbacks = [];
    }

    _createClass(Store, [{
        key: 'updateState',
        value: function updateState(type, payload) {
            if (this._stateUpdates[type]) {
                this._stateUpdates[type](this.state, payload);
                this._notify();
            }
        }
    }, {
        key: 'register',
        value: function register(cb) {
            if (this._registeredCallbacks.indexOf(cb) < 0) {
                this._registeredCallbacks.push(cb);
            }
        }
    }, {
        key: 'deregister',
        value: function deregister(cb) {
            if (this._registeredCallbacks.indexOf(cb) >= 0) {
                this._registeredCallbacks.splice(this._registeredCallbacks.indexOf(cb), 1);
            }
        }
    }, {
        key: '_notify',
        value: function _notify() {
            this._registeredCallbacks.forEach(function (cb) {
                cb();
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