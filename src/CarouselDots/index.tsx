import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { I18nManager, View, ScrollView } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import type {
  CarouselState,
  DecreasingDot,
  DotConfig,
  ScrollableDotConfig,
} from './interface';

import usePrevious from './use-previous';
import InvisibleFiller from './InvisibleFiller';
import Dot from './Dot';
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
  duration?: number;
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
    decreasingDot[decreasingDot.length - 1]!.config
  );
  const result = decreasingDot.reduce(
    (acc, dot) => {
      if (acc.offset === 0) {
        return acc;
      }
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
  duration = 500,
}: CarouselDotsProps): JSX.Element => {
  const refScrollView = useRef<ScrollView>(null);
  const positiveMomentum = useRef<boolean>(false);
  const prevIndex = usePrevious(currentIndex, currentIndex);
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentIndex,
    state: 1,
  });
  const list = [...Array(length).keys()];

  const offsetSizeMap = useMemo(() => {
    const map = new Map<number, number>();

    for (let i = 1 - maxIndicators; i < length; i++) {
      map.set(i, calculateOffsetSize(decreasingDots, i));
    }

    return map;
  }, [decreasingDots, length, maxIndicators]);

  const scrollTo = useCallback(
    (index: number): void => {
      if (!refScrollView.current) {
        return;
      }
      const moveTo = positiveMomentum.current
        ? offsetSizeMap.get(index - maxIndicators + 1)
        : offsetSizeMap.get(index);

      refScrollView.current.scrollTo({
        animated: true,
        x: moveTo,
      });
    },
    [maxIndicators, offsetSizeMap]
  );
  useEffect(() => {
    positiveMomentum.current = currentIndex - prevIndex > 0;
    let internalState = carouselState.state;
    internalState += currentIndex - prevIndex;
    const finalState = internalState;
    if (internalState > maxIndicators) {
      internalState = maxIndicators;
    }
    if (internalState < 1) {
      internalState = 1;
    }
    if (internalState) {
      setCarouselState({
        currentIndex,
        state: internalState,
      });
    }

    if (
      length > maxIndicators &&
      (finalState > maxIndicators || finalState < 1)
    ) {
      scrollTo(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, length, maxIndicators, scrollTo]);
  const containerSize = useMemo(() => {
    return (
      decreasingDots.reduce(
        (acc, current) => calculateDecreasingDotSize(current) + acc,
        0
      ) +
      calculateIndicatorDotSize(
        maxIndicators,
        activeIndicatorConfig,
        inactiveIndicatorConfig
      )
    );
  }, [
    activeIndicatorConfig,
    decreasingDots,
    inactiveIndicatorConfig,
    maxIndicators,
  ]);

  if (length <= maxIndicators) {
    return (
      <View style={styles.container}>
        {list.map((i) => {
          return (
            <Dot
              key={i}
              index={i}
              length={length}
              maxIndicators={maxIndicators}
              activeIndicatorConfig={activeIndicatorConfig}
              inactiveIndicatorConfig={inactiveIndicatorConfig}
              verticalOrientation={verticalOrientation}
              decreasingDots={decreasingDots}
              carouselState={carouselState}
              interpolateOpacityAndColor={interpolateOpacityAndColor}
              duration={duration}
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
        contentContainerStyle={[
          styles.scrollContainer,
          { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' },
        ]}
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
              length={length}
              maxIndicators={maxIndicators}
              activeIndicatorConfig={activeIndicatorConfig}
              inactiveIndicatorConfig={inactiveIndicatorConfig}
              decreasingDots={decreasingDots}
              verticalOrientation={verticalOrientation}
              carouselState={carouselState}
              interpolateOpacityAndColor={interpolateOpacityAndColor}
              duration={duration}
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

interface CarouselDotsWrapperProps extends CarouselDotsProps {
  scrollableDotsConfig?: ScrollableDotConfig;
}

const MIN_TRANSLATION_DOT_ANIMATION = 15;

const CarouselDotsWrapper = ({
  scrollableDotsConfig,
  ...rest
}: CarouselDotsWrapperProps) => {
  const [dotsCarouselActive, setDotsCarouselActive] = useState(false);
  const accDesplacementPos = useSharedValue(0);
  const accDesplacementNeg = useSharedValue(0);
  const lastTranslationX = useSharedValue(0);
  const prevMomentum = useSharedValue<null | boolean>(null);
  const lastXOfMomentum = useSharedValue<null | number>(null);
  const lastCallTime = useSharedValue(0);
  const throttleDelay = 150;

  const handleGoUp = (up: boolean) => {
    scrollableDotsConfig?.setIndex((prevActive) => {
      const newActive = up
        ? Math.min(prevActive + 1, rest.length - 1)
        : Math.max(prevActive - 1, 0);
      scrollableDotsConfig?.onNewIndex?.(newActive);
      return newActive;
    });
  };

  const throttledHandleGoUp = (momentum: boolean) => {
    const now = Date.now();
    if (now - lastCallTime.value >= throttleDelay) {
      lastCallTime.value = now;
      runOnJS(handleGoUp)(momentum);
    }
  };
  const gesture = Gesture.Pan()
    .onStart(() => {
      accDesplacementPos.value = 0;
      accDesplacementNeg.value = 0;
      runOnJS(setDotsCarouselActive)(true);
    })
    .onUpdate((e) => {
      const momentum = e.translationX - lastTranslationX.value >= 0;
      lastTranslationX.value = e.translationX;
      if (prevMomentum.value !== momentum) {
        lastXOfMomentum.value = e.translationX;
        prevMomentum.value = momentum;
        accDesplacementPos.value = 0;
        accDesplacementNeg.value = 0;
      }
      if (
        momentum &&
        e.translationX >=
          MIN_TRANSLATION_DOT_ANIMATION +
            accDesplacementPos.value +
            (lastXOfMomentum.value || 0)
      ) {
        accDesplacementPos.value =
          e.translationX - (lastXOfMomentum.value || 0);
        runOnJS(throttledHandleGoUp)(true);
      } else if (
        !momentum &&
        e.translationX <=
          -MIN_TRANSLATION_DOT_ANIMATION +
            accDesplacementNeg.value +
            (lastXOfMomentum.value || 0)
      ) {
        accDesplacementNeg.value =
          e.translationX - (lastXOfMomentum.value || 0);
        runOnJS(throttledHandleGoUp)(false);
      }
    })
    .onEnd(() => runOnJS(setDotsCarouselActive)(false));

  return scrollableDotsConfig ? (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          scrollableDotsConfig.container || styles.scrollableDotsContainer,
          dotsCarouselActive && {
            backgroundColor:
              scrollableDotsConfig.containerBackgroundColor ||
              'rgba(230,230,230, 0.5)',
          },
        ]}
      >
        <View style={{ height: rest.activeIndicatorConfig.size }}>
          <CarouselDots {...rest} />
        </View>
      </View>
    </GestureDetector>
  ) : (
    <View
      style={{
        height:
          rest.activeIndicatorConfig.size +
          (rest.activeIndicatorConfig.borderWidth || 0),
      }}
    >
      <CarouselDots {...rest} />
    </View>
  );
};
export default CarouselDotsWrapper;
