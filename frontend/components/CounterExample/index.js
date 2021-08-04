/**
 * This is an example component that shows how to use the sliceManager hooks to access Redux
 * slices. The example slice used here is defined in "counterSlice.js".
 */
import React, { useState } from "react";
import { View, Button, Text, TextInput } from "react-native";
import { useReduxSlice, useReduxSliceProperty } from "../../store/sliceManager";
import counterSlice from "../../store/slices/counterSlice";

function CounterExample() {
  const [incrementAmount, setIncrementAmount] = useState("2");
  // This is the hook that stores the slice methods, which can just be called directly.
  const counterInterface = useReduxSlice(counterSlice);
  // This is the hook that monitors a property, the "value" property in this case.
  const count = useReduxSliceProperty(counterSlice, "value");

  return (
    <View style={{justifyContent: "space-around", height: 300}}>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          onPress={() => counterInterface.increment()}
          title="+"
        />
        <Text style={{fontSize: 30}}>{count}</Text>
        <Button
          onPress={() => counterInterface.decrement()}
          title="-"
        />
      </View>
      <TextInput
        style={{fontSize: 30, width: 390, backgroundColor: "grey", color: "white", marginTop: 75}}
        value={incrementAmount}
        onChangeText={(text) => setIncrementAmount(text)}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          onPress={() => {
            counterInterface.incrementByAmount(Number(incrementAmount) || 0);
          }}
          title="Add Amount"
        />
        <Button
          onPress={() =>
            counterInterface.incrementAsync(Number(incrementAmount) || 0)
          }
          title="Add Async"
        />
        <Button
          onPress={() => counterInterface.setToRandomNumber()}
          title="Set to Random Number"
        />
      </View>
    </View>
  );
}

export default CounterExample;
