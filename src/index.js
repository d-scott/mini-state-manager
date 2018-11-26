export default class Store {
    constructor(options) {
        if (!options || !options.state) {
            throw new Error('[Store] No initial state passed');
        }

        if (!options.updates) {
            throw new Error('[Store] No updates passed');
        }

        this.update = this.update.bind(this);
        this.batchUpdate = this.batchUpdate.bind(this);

        const {state, updates, actions} = options;
        this._state = state;
        this._updates = updates;
        this._actions = actions;
        this._registeredCallbacks = [];
    }

    get state() {
        return this._state;
    }

    update(type, payload) {
        if (!this._updates) {
            throw new Error('[Store] update() - No updates registered');
        }

        if (this._updates[type]) {
            this._updates[type](this.state, payload);
            this._notify([type]);
        }
    }

    batchUpdate(updates) {
        if (!this._updates) {
            throw new Error('[Store] batchUpdate() - No updates registered');
        }

        const types = [];
        updates.forEach(update => {
            types.push(update.type);
            this._updates[update.type](this.state, update.payload);
        });
        this._notify(types);
    }

    dispatchAction(type, payload) {
        if (!this._actions) {
            throw new Error('[Store] dispatchAction() - No actions registered');
        }

        if (this._actions[type]) {
            this._actions[type](this, payload);
        }
    }

    register(cb) {
        if (!this._registeredCallbacks) {
            throw new Error('[Store] register() - Cannot register callbacks, instance has been destroyed');
        }

        if (this._registeredCallbacks.indexOf(cb) < 0) {
            this._registeredCallbacks.push(cb);
        }
    }

    deregister(cb) {
        if (!this._registeredCallbacks) {
            throw new Error('[Store] deregister() - Cannot deregister callbacks, instance has been destroyed');
        }

        if (this._registeredCallbacks.indexOf(cb) >= 0) {
            this._registeredCallbacks.splice(this._registeredCallbacks.indexOf(cb), 1);
        }
    }

    destroy() {
        this._state = null;
        this._updates = null;
        this._actions = null;
        this._registeredCallbacks = null;
    }

    _notify(type) {
        this._registeredCallbacks.forEach(cb => {
            cb(type);
        });
    }
}
