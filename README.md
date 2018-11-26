### mini-state-manager

Init a new Store, declaring state, updates and actions up-front:
```javascript
import Store from 'mini-state-manager';

const store = new Store({
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
            setTimeout(() => update('incrementBy', { value: 5 }), 100);
        },
        decrementByAsync: ({update}) => {
            setTimeout(() => update('decrementBy', { value: 5 }), 100);
        }
    }
});
```

Registering update callbacks:
```javascript
const myCallback = () => console.log('State updated. Count is now: ', store.state.count);
const myOtherCallback = () => console.log('blah blah blah');
store.register(myCallback);
store.register(myOtherCallback);
```

Deregistering update callbacks:
```javascript
store.deregister(myOtherCallback);
```

Updating state:
```javascript
console.log(store.state.count); //0
store.update('increment'); //State updated. Count is now: 1
```

```javascript
store.update('incrementBy', { value: 5 }); //State updated. Count is now: 6
```


Batch updating:
```javascript
store.batchUpdate([
    {type: 'increment'},
    {type: 'decrementBy', payload: { value: 5 }},
    {type: 'decrement'}
]); //State updated. Count is now: 1
```

Dispatching actions:
```javascript
store.dispatchAction('incrementAsync');
//...async call, waiting...
//State updated. Count is now: 2

store.dispatchAction('incrementByAsync', { value: 5 });
//...async call, waiting...
//State updated. Count is now: 7
```

Destroying:
```javascript
store.destroy();
```
