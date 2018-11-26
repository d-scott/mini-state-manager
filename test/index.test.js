import Store from '../src';

describe('Store', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.clearAllTimers();
    });

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

        it('should error if no updates are passed', () => {
            expect(() => {
                new Store({
                    state: {}
                });
            }).toThrowError('[Store] No updates passed');
        });

    });

    describe('instance', () => {

        let instance;
        beforeAll(() => {
            instance = new Store({
                state: {
                    count: 0
                },
                updates: {
                    increment: state => state.count++,
                    decrement: state => state.count--,
                    incrementBy: (state, payload) => state.count += payload.value,
                    decrementBy: (state, payload) => state.count -= payload.value
                },
                actions: {
                    incrementAsync: ({update}) => {
                        setTimeout(() => update('increment'), 100);
                    },
                    decrementAsync: ({update}) => {
                        setTimeout(() => update('decrement'), 100);
                    },
                    incrementByAsync: ({update}) => {
                        setTimeout(() => update('incrementBy', {value: 5}), 100);
                    },
                    decrementByAsync: ({update}) => {
                        setTimeout(() => update('decrementBy', {value: 5}), 100);
                    }
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
                instance.update('increment');
                expect(onUpdate.mock.calls.length).toEqual(1);
                expect(onUpdate).toHaveBeenCalledWith(['increment']);
            });

            it('should not call the update callback if an invalid stateUpdate is made', () => {
                instance.update('somethingInvalid');
                expect(onUpdate.mock.calls.length).toEqual(1);
            });

            it('should update the state in the expected way, using the value in the payload', () => {
                instance.update('incrementBy', {value: 5});
                expect(instance.state.count).toEqual(6);
                expect(onUpdate.mock.calls.length).toEqual(2);
                expect(onUpdate).toHaveBeenCalledWith(['incrementBy']);
                instance.update('decrementBy', {value: 6});
                expect(instance.state.count).toEqual(0);
                expect(onUpdate.mock.calls.length).toEqual(3);
                expect(onUpdate).toHaveBeenCalledWith(['decrementBy']);
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
                instance.batchUpdate([
                    {type: 'incrementBy', payload: {value: 5}},
                    {type: 'decrement'},
                    {type: 'decrementBy', payload: {value: 2}},
                    {type: 'increment'}
                ]);
                expect(instance.state.count).toEqual(3);
                expect(onUpdate.mock.calls.length).toEqual(1);
                expect(onUpdate).toHaveBeenCalledWith(['incrementBy', 'decrement', 'decrementBy', 'increment']);
            });

        });

        describe('actions', () => {

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

            it('should eventually increment the count and call the update callback', () => {
                instance.dispatchAction('incrementAsync');
                jest.runAllTimers();
                expect(instance.state.count).toEqual(4);
                expect(onUpdate.mock.calls.length).toEqual(1);
                expect(onUpdate).toHaveBeenCalledWith(['increment']);
            });

            it('should eventually increment the count by the amount provided and call the update callback', () => {
                instance.dispatchAction('incrementByAsync', {value: 5});
                jest.runAllTimers();
                expect(instance.state.count).toEqual(9);
                expect(onUpdate.mock.calls.length).toEqual(2);
                expect(onUpdate).toHaveBeenCalledWith(['incrementBy']);
            });

            it('should not eventually call the update callback if an invalid action is dispatched', () => {
                instance.dispatchAction('somethingInvalid');
                jest.runAllTimers();
                expect(onUpdate.mock.calls.length).toEqual(2);
            });

            it('should error when dispatching an action if no actions have been registered', () => {
                let newInstance = new Store({
                    state: {},
                    updates: {}
                });

                expect(() => {
                    newInstance.dispatchAction('incrementAsync');
                }).toThrowError('[Store] dispatchAction() - No actions registered');

                newInstance = null;
            });

        });

        describe('destroy', () => {

            it('should clear the store', () => {
                instance.destroy();
                expect(instance.state).toBeNull();
            });

            it('should error if registering an update', () => {
                expect(() => {
                    instance.register(() => {
                    });
                }).toThrow();
            });

            it('should error if deregistering an update', () => {
                expect(() => {
                    instance.deregister(() => {
                    });
                }).toThrow();
            });

            it('should error if update is called', () => {
                expect(() => {
                    instance.update('increment');
                }).toThrow();
            });

            it('should error if batchUpdate is called', () => {
                expect(() => {
                    instance.batchUpdate([
                        {type: 'increment'},
                        {type: 'decrement'}
                    ]);
                }).toThrow();
            });

            it('should error if update is called', () => {
                expect(() => {
                    instance.dispatchAction('incrementAsync');
                }).toThrow();
            });

        });

    });

});
