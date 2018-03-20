## mini-state-manager

Inspired by Vuex, but super stripped down. 

```javascript
import { Store } from 'mini-state-manager';
 
const store = new Store({
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
 
console.log(store.state.count); //0
store.updateState('increment');
console.log(store.state.count); //1
 
store.updateState('incrementBy', { value: 5 });
console.log(store.state.count); //6
```
