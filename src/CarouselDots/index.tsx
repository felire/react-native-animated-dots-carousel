import { useCallback, useEffect, useRef, useState } from 'react';
import { I18nManager, View, ScrollView } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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
      if (!refScrollView.current) {
        return;
      }
      const moveTo = positiveMomentum.current
        ? calculateOffsetSize(decreasingDots, index - maxIndicators + 1)
        : calculateOffsetSize(decreasingDots, index);

      refScrollView.current.scrollTo({
        animated: true,
        x: moveTo,
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
    if (internalState > maxIndicators) {
      internalState = maxIndicators;
    }
    if (internalState < 1) {
      internalState = 1;
    }
    if (internalState) {
      setCarouselState({
        currentIndex: curIndex,
        state: internalState,
      });
    }

    if (
      length > maxIndicators &&
      (finalState > maxIndicators || finalState < 1)
    ) {
      scrollTo(curIndex);
    }
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
  const accDesplacementPos = useRef(0);
  const accDesplacementNeg = useRef(0);
  const lastTranslationX = useRef(0);
  const prevMomentum = useRef<null | boolean>(null);
  const lastXOfMomentum = useRef<null | number>(null);

  const gesture = Gesture.Pan()
    .onStart(() => {
      accDesplacementPos.current = 0;
      accDesplacementNeg.current = 0;
      setDotsCarouselActive(true);
    })
    .onUpdate((e) => {
      const momentum = e.translationX - lastTranslationX.current >= 0;
      lastTranslationX.current = e.translationX;
      if (prevMomentum.current !== momentum) {
        lastXOfMomentum.current = e.translationX;
        prevMomentum.current = momentum;
        accDesplacementPos.current = 0;
        accDesplacementNeg.current = 0;
      }
      if (
        momentum &&
        e.translationX >=
          MIN_TRANSLATION_DOT_ANIMATION +
            accDesplacementPos.current +
            (lastXOfMomentum.current || 0)
      ) {
        accDesplacementPos.current =
          e.translationX - (lastXOfMomentum.current || 0);
        scrollableDotsConfig?.setIndex((prevActive) => {
          const newActive = Math.min(prevActive + 1, rest.length - 1);
          scrollableDotsConfig?.onNewIndex?.(newActive);
          return newActive;
        });
      } else if (
        !momentum &&
        e.translationX <=
          -MIN_TRANSLATION_DOT_ANIMATION +
            accDesplacementNeg.current +
            (lastXOfMomentum.current || 0)
      ) {
        accDesplacementNeg.current =
          e.translationX - (lastXOfMomentum.current || 0);
        scrollableDotsConfig?.setIndex((prevActive) => {
          const newActive = Math.max(prevActive - 1, 0);
          scrollableDotsConfig?.onNewIndex?.(newActive);
          return newActive;
        });
      }
    })
    .onEnd(() => setDotsCarouselActive(false))
    .runOnJS(true);

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
    <CarouselDots {...rest} />
  );
};
export default CarouselDotsWrapper;
