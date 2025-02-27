import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  View,
  Image,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const images = [
  {
    id: '1',
    uri: 'data:image/png;base64,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',
  },
  {
    id: '2',
    uri: 'data:image/jpeg;base64,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',
  },
  { id: '3', uri: 'https://via.placeholder.com/800x400.png?text=Image+3' },
  { id: '4', uri: 'https://via.placeholder.com/800x400.png?text=Image+4' },
  { id: '5', uri: 'https://via.placeholder.com/800x400.png?text=Image+5' },
  { id: '6', uri: 'https://via.placeholder.com/800x400.png?text=Image+6' },
  { id: '7', uri: 'https://via.placeholder.com/800x400.png?text=Image+7' },
  { id: '8', uri: 'https://via.placeholder.com/800x400.png?text=Image+8' },
  { id: '9', uri: 'https://via.placeholder.com/800x400.png?text=Image+9' },
  { id: '10', uri: 'https://via.placeholder.com/800x400.png?text=Image+10' },
];

export default function App() {
  const [index, setIndex] = React.useState<number>(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const finalIndex = Math.floor(contentOffsetX / width);
    setIndex(finalIndex);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{
            width: '100%',
            height: 300,
          }}
        >
          {images.map((image) => (
            <View
              key={image.id}
              style={{
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            </View>
          ))}
        </ScrollView>
        <View style={{ marginTop: 20, flex: 1 }}>
          <AnimatedDotsCarousel
            length={images.length}
            scrollableDotsConfig={{
              setIndex,
              onNewIndex: (newIndex) => {
                scrollViewRef?.current?.scrollTo?.({
                  x: newIndex * width,
                  animated: false,
                });
              },
              containerBackgroundColor: 'rgba(230,230,230, 0.5)',
              container: {
                alignItems: 'center',
                borderRadius: 15,
                height: 30,
                justifyContent: 'center',
                paddingHorizontal: 15,
              },
            }}
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
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
