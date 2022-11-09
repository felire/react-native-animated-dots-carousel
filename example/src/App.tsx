/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

const LENGTH = 10;
export default function App() {
  const [index, setIndex] = React.useState<number>(0);

  const increaseIndex = () => {
    setIndex(Math.min(index + 1, LENGTH - 1));
  };
  const decreaseIndex = () => {
    setIndex(Math.max(index - 1, 0));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ borderWidth: 1, marginTop: 20, backgroundColor: 'white' }}
        onPress={increaseIndex}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderWidth: 1, marginTop: 20, backgroundColor: 'white' }}
        onPress={decreaseIndex}
      >
        <Text>Decrease</Text>
      </TouchableOpacity>
      <AnimatedDotsCarousel
        length={LENGTH}
        currentIndex={index}
        maxIndicators={4}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: 'red',
          margin: 3,
          opacity: 1,
          size: 8,
        }}
        inactiveIndicatorConfig={{
          color: 'white',
          margin: 3,
          opacity: 0.5,
          size: 8,
        }}
        decreasingDots={[
          {
            config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
            quantity: 1,
          },
          {
            config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
            quantity: 1,
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
