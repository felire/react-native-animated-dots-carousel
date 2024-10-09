import { View } from 'react-native';

import styles from './styles';

const InvisibleFiller = ({
  size,
  verticalOrientation,
}: {
  size: number;
  verticalOrientation: boolean;
}): JSX.Element => {
  return (
    <View
      style={[
        styles.container,
        {
          height: verticalOrientation ? size : 1,
          width: verticalOrientation ? 1 : size,
        },
      ]}
    />
  );
};

export default InvisibleFiller;
