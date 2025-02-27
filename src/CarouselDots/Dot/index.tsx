import { useEffect, useState, useMemo } from 'react';
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
  length: number;
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
  length,
}: Dot): JSX.Element => {
  const { currentIndex, state } = carouselState;

  const calculatedStyles = useMemo(() => {
    const dotStylesMap = new Map<string, DotConfig>();
    for (let stateI = 0; stateI <= maxIndicators; stateI++) {
      for (let currentIndexJ = 0; currentIndexJ <= length; currentIndexJ++) {
        const dotStyle = getDotStyle({
          activeIndicatorConfig,
          currentIndex: currentIndexJ,
          decreasingDots,
          inactiveIndicatorConfig,
          index,
          indicatorState: stateI,
          maxIndicators,
        });
        dotStylesMap.set(`${stateI}-${currentIndexJ}`, dotStyle);
      }
    }
    return dotStylesMap;
  }, [
    activeIndicatorConfig,
    decreasingDots,
    inactiveIndicatorConfig,
    index,
    maxIndicators,
    length,
  ]);
  const [type, setType] = useState(
    calculatedStyles.get(`${state}-${currentIndex}`)!
  );
  const prevType = usePrevious(type, type);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    setType(calculatedStyles.get(`${state}-${currentIndex}`)!);
  }, [calculatedStyles, currentIndex, state]);

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
