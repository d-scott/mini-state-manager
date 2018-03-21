import Store from '../../src/store';

describe('Store', () => {

    describe('constructor', () => {

        it('should error if no options are passed', () => {
            expect(() => {
                new Store();
            }).toThrowError('[Store] No initial state passed');
        });

        it('should error if no initial state is passed', () => {
            expect(() => {
                new Store({});
            }).toThrowError('[Store] No initial state passed');
        });

        it('should error if no stateUpdates are passed', () => {
            expect(() => {
                new Store({
                    state: {}
                });
            }).toThrowError('[Store] No stateUpdates passed');
        });

    });

    describe('instance', () => {

        let instance;
        beforeAll(() => {
            instance = new Store({
                state: {
                    count: 0
                },
                stateUpdates: {
                    increment: state => state.count++,
                    decrement: state => state.count--,
                    incrementBy: (state, payload) => state.count += payload.value,
                    decrementBy: (state, payload) => state.count -= payload.value
                }
            });
        });

        describe('register/deregister', () => {

            let onUpdate;
            beforeAll(() => {
                onUpdate = jest.fn();
            });

            afterAll(() => {
                onUpdate.mockReset();
                onUpdate = null;
            });

            it('should allow registration of update callbacks', () => {
                instance.register(onUpdate);
                expect(instance._registeredCallbacks[0]).toEqual(onUpdate);
            });

            it('should not attempt to register an already registered update callback', () => {
                instance.register(onUpdate);
                expect(instance._registeredCallbacks.length).toEqual(1);
            });

            it('should allow deregistration of update callbacks', () => {
                instance.deregister(onUpdate);
                expect(instance._registeredCallbacks[0]).toEqual(undefined);
            });

            it('should not attempt to deregister an unregistered update callback', () => {
                instance.deregister(() => {});
                expect(instance._registeredCallbacks[0]).toEqual(undefined);
                expect(instance._registeredCallbacks.length).toEqual(0);
            });

        });

        describe('updates', () => {

            let onUpdate;
            beforeAll(() => {
                onUpdate = jest.fn();
                instance.register(onUpdate);
            });

            afterAll(() => {
                instance.deregister(onUpdate);
                onUpdate.mockReset();
                onUpdate = null;
            });

            it('should call the update callback if a valid stateUpdate is made', () => {
                instance.updateState('increment');
                expect(onUpdate.mock.calls.length).toEqual(1);
            });

            it('should not call the update callback if an invalid stateUpdate is made', () => {
                instance.updateState('somethingInvalid');
                expect(onUpdate.mock.calls.length).toEqual(1);
            });

            it('should update the state in the expected way, using the value in the payload', () => {
                instance.updateState('incrementBy', {value: 5});
                expect(instance.state.count).toEqual(6);
                expect(onUpdate.mock.calls.length).toEqual(2);
                instance.updateState('decrementBy', {value: 6});
                expect(instance.state.count).toEqual(0);
                expect(onUpdate.mock.calls.length).toEqual(3);
            });

        });

        describe('batched updates', () => {

            let onUpdate;
            beforeAll(() => {
                onUpdate = jest.fn();
                instance.register(onUpdate);
            });

            afterAll(() => {
                instance.deregister(onUpdate);
                onUpdate.mockReset();
                onUpdate = null;
            });

            it('should only call the update callback once', () => {
                instance.batchUpdateState({
                    updates: [
                        {type: 'incrementBy', payload: {value: 5}},
                        {type: 'decrement'},
                        {type: 'decrementBy', payload: {value: 2}},
                        {type: 'increment'}
                    ]
                });
                expect(instance.state.count).toEqual(3);
                expect(onUpdate.mock.calls.length).toEqual(1);
            });

        });

    });

});
