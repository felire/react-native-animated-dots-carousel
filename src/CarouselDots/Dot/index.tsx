/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import usePrevious from '../use-previous';

//RECHECK THIS WAY OF IMPORTING TYPES FOR COMPATIBILITY
import { CarouselState, DecreasingDot, DotConfig } from '../interface';

import { getDotStyle } from './utils';

interface Dot {
  maxIndicators: number;
  activeIndicatorConfig: DotConfig;
  inactiveIndicatorConfig: DotConfig;
  decreasingDots: DecreasingDot[];
  index: number;
  carouselState: CarouselState;
  verticalOrientation: boolean;
  interpolateOpacityAndColor: boolean;
}

const Dot = ({
  maxIndicators,
  activeIndicatorConfig,
  inactiveIndicatorConfig,
  decreasingDots,
  index,
  carouselState,
  verticalOrientation,
  interpolateOpacityAndColor,
}: Dot): JSX.Element => {
  const { currentIndex, state } = carouselState;
  const [type, setType] = useState(
    getDotStyle({
      activeIndicatorConfig,
      currentIndex,
      decreasingDots,
      inactiveIndicatorConfig,
      index,
      indicatorState: state,
      maxIndicators,
    })
  );
  const prevType = usePrevious(type, type);
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    setType(
      getDotStyle({
        activeIndicatorConfig,
        currentIndex,
        decreasingDots,
        inactiveIndicatorConfig,
        index,
        indicatorState: state,
        maxIndicators,
      })
    );
  }, [
    activeIndicatorConfig,
    currentIndex,
    decreasingDots,
    inactiveIndicatorConfig,
    index,
    maxIndicators,
    state,
  ]);

  useEffect(() => {
    animatedValue.current.setValue(0);
    Animated.timing(animatedValue.current, {
      duration: 300,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const size = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [prevType.size, type.size],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: interpolateOpacityAndColor
            ? animatedValue.current.interpolate({
                inputRange: [0, 1],
                outputRange: [prevType.color, type.color],
              })
            : type.color,
          borderColor: type.borderColor,
          borderRadius: type.size,
          borderWidth: type.borderWidth,
          marginHorizontal: verticalOrientation ? 0 : type.margin,
          marginVertical: verticalOrientation ? type.margin : 0,
          opacity: interpolateOpacityAndColor
            ? animatedValue.current.interpolate({
                inputRange: [0, 1],
                outputRange: [prevType.opacity, type.opacity],
              })
            : type.opacity,
        },
        {
          height: size,
          width: size,
        },
      ]}
    />
  );
};

export default Dot;
