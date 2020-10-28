/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';

import usePrevious from './use-previous';

import InvisibleFiller from './InvisibleFiller';
import Dot from './Dot';
import { CarouselState, DecreasingDot, DotConfig } from './interface';
import styles from './styles';

export interface CarouselDotsProps {
  length: number;
  currentIndex: number;
  maxIndicators: number;
  activeIndicatorConfig: DotConfig;
  inactiveIndicatorConfig: DotConfig;
  decreasingDots: DecreasingDot[];
  verticalOrientation?: boolean;
  interpolateOpacityAndColor?: boolean;
}

const calculateDotSize = (dot: DotConfig): number => dot.size + 2 * dot.margin;
const calculateDecreasingDotSize = (dot: DecreasingDot): number => {
  return calculateDotSize(dot.config) * (dot.quantity * 2);
};
const calculateIndicatorDotSize = (
  maxIndicators: number,
  activeIndicatorConfig: DotConfig,
  inactiveIndicatorConfig: DotConfig
): number => {
  return (
    calculateDotSize(activeIndicatorConfig) +
    calculateDotSize(inactiveIndicatorConfig) * (maxIndicators - 1)
  );
};

const calculateOffsetSize = (
  decreasingDot: DecreasingDot[],
  offset: number
): number => {
  const minimumSize = calculateDotSize(
    decreasingDot[decreasingDot.length - 1].config
  );
  const result = decreasingDot.reduce(
    (acc, dot) => {
      if (acc.offset === 0) return acc;
      if (acc.offset - dot.quantity <= 0) {
        return {
          offset: 0,
          totalSize: acc.totalSize + calculateDotSize(dot.config) * acc.offset,
        };
      }
      return {
        offset: acc.offset - dot.quantity,
        totalSize: acc.totalSize + calculateDotSize(dot.config) * dot.quantity,
      };
    },
    { offset, totalSize: 0 }
  );
  return result.totalSize + result.offset * minimumSize;
};
const CarouselDots = ({
  length,
  currentIndex,
  maxIndicators,
  activeIndicatorConfig,
  inactiveIndicatorConfig,
  decreasingDots,
  verticalOrientation = false,
  interpolateOpacityAndColor = true,
}: CarouselDotsProps): JSX.Element => {
  const refScrollView = useRef<ScrollView>(null);
  const [curIndex, setCurIndex] = useState<number>(currentIndex);
  const positiveMomentum = useRef<boolean>(false);
  const prevIndex = usePrevious(curIndex, curIndex);
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentIndex,
    state: 1,
  });
  const list = [...Array(length).keys()];
  const scrollTo = useCallback(
    (index: number): void => {
      if (!refScrollView.current) return;
      const moveTo = positiveMomentum.current
        ? calculateOffsetSize(decreasingDots, index - maxIndicators + 1)
        : calculateOffsetSize(decreasingDots, index);

      refScrollView.current.scrollTo({
        animated: true,
        x: moveTo,
        y: moveTo,
      });
    },
    [decreasingDots, maxIndicators]
  );
  useEffect(() => {
    setCurIndex(currentIndex);
  }, [currentIndex]);
  useEffect(() => {
    positiveMomentum.current = curIndex - prevIndex > 0;
    let internalState = carouselState.state;
    internalState += curIndex - prevIndex;
    const finalState = internalState;
    if (internalState > maxIndicators) internalState = maxIndicators;
    if (internalState < 1) internalState = 1;
    if (internalState) {
      setCarouselState({
        currentIndex: curIndex,
        state: internalState,
      });
    }

    if (
      length > maxIndicators &&
      (finalState > maxIndicators || finalState < 1)
    )
      scrollTo(curIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curIndex, length, maxIndicators, scrollTo]);
  const containerSize =
    decreasingDots.reduce(
      (acc, current) => calculateDecreasingDotSize(current) + acc,
      0
    ) +
    calculateIndicatorDotSize(
      maxIndicators,
      activeIndicatorConfig,
      inactiveIndicatorConfig
    );
  if (length <= maxIndicators) {
    return (
      <View style={styles.container}>
        {list.map((i) => {
          return (
            <Dot
              key={i}
              index={i}
              maxIndicators={maxIndicators}
              activeIndicatorConfig={activeIndicatorConfig}
              inactiveIndicatorConfig={inactiveIndicatorConfig}
              verticalOrientation={verticalOrientation}
              decreasingDots={decreasingDots}
              carouselState={carouselState}
              interpolateOpacityAndColor={interpolateOpacityAndColor}
            />
          );
        })}
      </View>
    );
  }
  const invisibleFillerSize =
    decreasingDots.reduce(
      (acc, current) => calculateDecreasingDotSize(current) + acc,
      0
    ) / 2;
  return (
    <View
      style={[
        verticalOrientation
          ? { flex: 1, height: containerSize }
          : { flex: 1, flexDirection: 'row', width: containerSize },
      ]}
    >
      <ScrollView
        ref={refScrollView}
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        horizontal={!verticalOrientation}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <InvisibleFiller
          size={invisibleFillerSize}
          verticalOrientation={verticalOrientation}
        />
        {list.map((i) => {
          return (
            <Dot
              key={i}
              index={i}
              maxIndicators={maxIndicators}
              activeIndicatorConfig={activeIndicatorConfig}
              inactiveIndicatorConfig={inactiveIndicatorConfig}
              decreasingDots={decreasingDots}
              verticalOrientation={verticalOrientation}
              carouselState={carouselState}
              interpolateOpacityAndColor={interpolateOpacityAndColor}
            />
          );
        })}
        <InvisibleFiller
          size={invisibleFillerSize}
          verticalOrientation={verticalOrientation}
        />
      </ScrollView>
    </View>
  );
};

export default CarouselDots;
