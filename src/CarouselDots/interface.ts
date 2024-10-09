import type { Dispatch, SetStateAction } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DotConfig {
  size: number;
  opacity: number;
  color: string;
  margin: number;
  borderWidth?: number;
  borderColor?: string;
}
export interface DecreasingDot {
  quantity: number;
  config: DotConfig;
}

export interface CarouselState {
  currentIndex: number;
  state: number;
}

export interface ScrollableDotConfig {
  setIndex: Dispatch<SetStateAction<number>>;
  onNewIndex?: (index: number) => void;
  containerBackgroundColor: string;
  container?: StyleProp<ViewStyle>;
}
