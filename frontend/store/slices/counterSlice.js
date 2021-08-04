/**
 * This is an example slice to show how to create slice layout files for my Redux manager. It is
 * the layout for the test component "CounterExample".
 */
import { createSliceFromLayout } from "../sliceManager";

const CounterLayout = () => {
  const name = "counter";
  const initialState = {
    value: 0
  };

  // These are the functions that change the state when called. They need a state parameter to change
  // things.
  function increment(state) {
    state.value += 1;
  }

  function decrement(state) {
    state.value -= 1;
  }

  function incrementByAmount(state, amount) {
    state.value += amount;
  }

  function setCount(state, amount) {
    state.value = amount;
  }

  // These are the functions that help do asynchronous work. They only take the functions parameter,
  // so they can manipulate the state throgh the synchronous functions above, but they cannot
  // modify it directly. I just did this because it's what Redux tended to do in their examples.
  async function incrementAsync(functions, amount) {
    setTimeout(() => {
      functions.incrementByAmount(amount);
    }, 1000);
  }

  async function setToRandomNumber(functions) {
    setTimeout(() => {
      functions.setCount(Math.floor(Math.random() * 10));
    }, 1000);
  }

  return {
    name,
    initialState,
    functions: {
      increment,
      decrement,
      incrementByAmount,
      setCount
    },
    asyncFunctions: {
      incrementAsync,
      setToRandomNumber
    }
  };
}

// This createSliceFromLayout changes the layout defined above into something that Redux can actually
// use. For you to use it, you have to use the React hooks defined in sliceManager.js.
export default createSliceFromLayout(CounterLayout);