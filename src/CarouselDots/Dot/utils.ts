import type { DecreasingDot, DotConfig } from '../interface';

interface GetDotStyle {
  index: number;
  currentIndex: number;
  maxIndicators: number;
  activeIndicatorConfig: DotConfig;
  inactiveIndicatorConfig: DotConfig;
  decreasingDots: DecreasingDot[];
  indicatorState: number;
}

export const getDotStyle = ({
  index,
  currentIndex,
  maxIndicators,
  activeIndicatorConfig,
  inactiveIndicatorConfig,
  decreasingDots,
  indicatorState,
}: GetDotStyle): DotConfig => {
  let dotConfig = decreasingDots[decreasingDots.length - 1]!.config;

  const rightRemnant = maxIndicators - indicatorState;
  const leftRemnant = indicatorState - 1;
  const leftDifference = currentIndex - leftRemnant;
  const rightDifference = currentIndex + rightRemnant;
  if (index >= leftDifference && index <= rightDifference) {
    dotConfig = inactiveIndicatorConfig;
    if (index === currentIndex) {
      dotConfig = activeIndicatorConfig;
    }
  } else {
    let leftMax = leftDifference;
    let rightMax = rightDifference;
    decreasingDots.forEach((dot) => {
      if (
        (index >= leftMax - dot.quantity && index < leftMax) ||
        (index <= rightMax + dot.quantity && index > rightMax)
      ) {
        dotConfig = dot.config;
      }
      leftMax -= dot.quantity;
      rightMax += dot.quantity;
    });
  }
  return dotConfig;
};
