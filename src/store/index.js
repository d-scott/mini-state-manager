export default class Store {
    constructor(options) {
        if (!options || !options.state) {
            throw new Error('[Store] No initial state passed');
        }

        if (!options.stateUpdates) {
            throw new Error('[Store] No stateUpdates passed');
        }

        const {
            state,
            stateUpdates
        } = options;
        this._state = state;
        this._stateUpdates = stateUpdates;
        this._registeredCallbacks = [];
    }

    get state() {
        return this._state;
    }

    updateState(type, payload) {
        if (this._stateUpdates[type]) {
            this._stateUpdates[type](this.state, payload);
            this._notify();
        }
    }

    register(cb) {
        if (this._registeredCallbacks.indexOf(cb) < 0) {
            this._registeredCallbacks.push(cb);
        }
    }

    deregister(cb) {
        if (this._registeredCallbacks.indexOf(cb) >= 0) {
            this._registeredCallbacks.splice(this._registeredCallbacks.indexOf(cb), 1);
        }
    }

    _notify() {
        this._registeredCallbacks.forEach(cb => {
            cb();
        });
    }
}
