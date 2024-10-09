import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { CarouselState, DecreasingDot, DotConfig } from '../interface';

import usePrevious from '../use-previous';

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
  duration: number;
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
  duration,
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
  const animatedValue = useSharedValue(0);

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
    animatedValue.value = 0;
    animatedValue.value = withTiming(1, { duration });
  }, [animatedValue, currentIndex, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedValue.value,
      [0, 1],
      [prevType.size, type.size]
    );

    const backgroundColorInterpolated = interpolateColor(
      animatedValue.value,
      [0, 1],
      [prevType.color, type.color]
    );

    const opacityInterpolated = interpolate(
      animatedValue.value,
      [0, 1],
      [prevType.opacity, type.opacity]
    );
    return {
      backgroundColor: interpolateOpacityAndColor
        ? backgroundColorInterpolated
        : type.color,
      opacity: interpolateOpacityAndColor ? opacityInterpolated : type.opacity,
      height: size,
      width: size,
    };
  });
  return (
    <Animated.View
      style={[
        {
          borderColor: type.borderColor,
          borderRadius: type.size,
          borderWidth: type.borderWidth,
          marginHorizontal: verticalOrientation ? 0 : type.margin,
          marginVertical: verticalOrientation ? type.margin : 0,
        },
        animatedStyle,
      ]}
    />
  );
};

export default Dot;
