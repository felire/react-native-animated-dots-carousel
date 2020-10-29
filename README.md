# react-native-animated-dots-carousel

![versión npm](https://img.shields.io/npm/v/react-native-animated-dots-carousel.svg?color=68d5f7)
![Download npm](https://img.shields.io/npm/dw/react-native-animated-dots-carousel.svg?color=7551bb)
[![MIT License][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Usage](#usage)
  * [Api Reference](#api-reference)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

Package to configure you dots pagination carousel just like Instagram does. 
With this package you could make whatever configuration you might need on your projects.

## Examples

<img src="https://media.giphy.com/media/blSIDevGYGcLQykskG/giphy.gif" alt="Example" width="320"/>

<img src="https://media.giphy.com/media/icbah07Wc272jQnVne/giphy.gif" alt="Example" width="320"/>

<img src="https://media.giphy.com/media/G6yx1xoe815KUUQ8mY/giphy.gif" alt="Example" width="320"/>

<!-- GETTING STARTED -->
## Getting Started

### Installation

Installation can be done through `npm` or `yarn`:

```shell
npm i react-native-animated-dots-carousel --save
```

```shell
yarn add react-native-animated-dots-carousel
```

<!-- USAGE EXAMPLES -->
## Usage

```js
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

const LENGTH = 10;
export default function App() {
  const [index, setIndex] = React.useState<number>(0);

  const increaseIndex = () => {
    setIndex(Math.min(index + 1, LENGTH - 1));
  };
  const decreaseIndex = () => {
    setIndex(Math.max(index - 1, 0));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ borderWidth: 1, marginTop: 20, backgroundColor: 'white' }}
        onPress={increaseIndex}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderWidth: 1, marginTop: 20, backgroundColor: 'white' }}
        onPress={decreaseIndex}
      >
        <Text>Decrease</Text>
      </TouchableOpacity>

      <AnimatedDotsCarousel
        length={LENGTH}
        currentIndex={index}
        maxIndicators={4}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: 'red',
          margin: 3,
          opacity: 1,
          size: 8,
        }}
        inactiveIndicatorConfig={{
          color: 'white',
          margin: 3,
          opacity: 0.5,
          size: 8,
        }}
        decreasingDots={[
          {
            config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
            quantity: 1,
          },
          {
            config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
            quantity: 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
```


### Api Reference

#### DotConfig Interface
```js
export interface DotConfig {
  size: number;
  opacity: number;
  color: string;
  margin: number;
  borderWidth?: number;
  borderColor?: string;
}
```

#### DecreasingDot Interface 

```js
export interface DecreasingDot {
  quantity: number;
  config: DotConfig;
}
```
#### Props

| **Prop**                    | **Type**                    | **Required(Default Value)**  | **Description**                                                |
| --------------------------- | ----------------------------| ---------------------------- | ---------------------------------------------------            |
| `length`                   | `number`                    | required                     | Length of the list you want to associate with the carousel dots                                        |
| `currentIndex`                   | `number`                    | required                     | Current index of the list.                                     |
| `maxIndicators`            | `number`                    | required                     | This number represents how many indicators you want to show, without decreasing size. Counting inactive indicators and the active indicator                 |
| `activeIndicatorConfig`                 | `DotConfig`                    | required                          | This is an object with the configuration of the active indicator |
| `inactiveIndicatorConfig`                  | `DotConfig`                   | required                        | This is an object with the configuration of the inactive indicator                                        |
| `decreasingDots`                  | `DecreasingDot[]`                   | required                        | This is a list where you have to define the quantiy per element and the dot config. The quantity represents how many dots with this config you want per side (simetrically). The size of this elements should be decreasing size if you want this to look nice.      
| `verticalOrientation`                  | `boolean`                   | false                        | If you want this oriented vertically or horizontally. Default is horizontally       
| `interpolateOpacityAndColor`                  | `boolean`                   | true                        | Default is true. With this setted to true you will be able to see an animation everytime the activeDot change.            


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/felire/react-native-animated-dots-carousel/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/felire/react-native-animated-dots-carousel](https://github.com/felire/react-native-animated-dots-carousel)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/felire/react-native-animated-dots-carousel/blob/master/LICENSE