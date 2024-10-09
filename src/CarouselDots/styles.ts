import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableDotsContainer: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default styles;
