// Image utility for sneaker data
import yeezy_700 from '../assets/items/adidas_yeezy_700_mauve.png';

// Import local images for dummy data
import yzCore from '../assets/images/Yeezy Slide Core.png';
import yzBeluga from '../assets/images/Yeezy Boost 350 V2 Beluga.png';
import yzBlackRed from '../assets/images/Yeezy Boost 350 V2 Black Red.png';
import yzZebra from '../assets/images/Yeezy Boost 350 V2 Zebra.png';
import yzInertia from '../assets/images/Yeezy Boost 700 V2 Inertia.png';
import jordanTravisFragment from '../assets/images/Jordan 1 Low Fragment x Travis Scott.png';
import jordanLowStar from '../assets/images/Jordan 1 Low Starfish.png';
import jordanMid from '../assets/images/Jordan 1 Mid Chicago Black Toe.png';
import jordanHighUnc from '../assets/images/Jordan 1 High UNC Chicago.png';
import dunkPanda from '../assets/images/Nike Dunk Low Panda.png';
import dunkOffWhite from '../assets/images/Nike Dunk Low Off-White Lot 45.png';
import pumaRsxCore from '../assets/images/Puma RS-X Core.png';

export const dummy_data = [
  {
    id: 1,
    title: 'Yeezy Boost 350 V2 Beluga',
    brand: 'Adidas Yeezy',
    model: 'V2 Beluga',
    price: 315,
    image: yzBeluga,
    rates: 4.7,
    color: ['grey', 'orange'],
    inStock: true,
    size: ['7.5', '8', '9', '9', '11'],
  },
  {
    id: 2,
    title: 'Jordan 1 Low Fragment x Travis Scott',
    brand: 'Nike Jordan Low',
    model: 'Fragment',
    price: 999,
    image: jordanTravisFragment,
    rates: 5.0,
    color: ['white', 'blue', 'black'],
    inStock: true,
    size: ['7', '9'],
  },
  {
    id: 3,
    title: 'Yeezy Boost 350 V2 Black Red',
    brand: 'Adidas Yeezy',
    model: '350 V2 Black Red',
    price: 416,
    image: yzBlackRed,
    rates: 4.9,
    color: ['black', 'red'],
    inStock: true,
    size: ['5', '6.5', '7', '7', '8.5', '9', '10', '10'],
  },
  {
    id: 4,
    title: 'Yeezy Boost 350 V2 Zebra',
    brand: 'Adidas Yeezy',
    model: '350 V2 Zebra',
    price: 275,
    image: yzZebra,
    rates: 4.5,
    color: ['black', 'white'],
    inStock: true,
    size: [
      '4',
      '4.5',
      '7',
      '7',
      '7.5',
      '7.5',
      '9',
      '9',
      '9.5',
      '10',
      '11.5',
      '12',
    ],
  },
  {
    id: 5,
    title: 'Yeezy Boost 700 V2 Inertia',
    brand: 'Adidas Yeezy',
    model: '700 V2 Inertia',
    price: 400,
    image: yzInertia,
    rates: 4.3,
    color: ['blue', 'grey'],
    inStock: true,
    size: ['5', '5.5', '7', '7.5', '9'],
  },
  {
    id: 6,
    title: 'Yeezy Slide Core',
    brand: 'Adidas Yeezy',
    model: 'Slides Core',
    price: 211,
    image: yzCore,
    rates: 3.6,
    color: ['brown'],
    inStock: true,
    size: ['3', '3.5', '6', '6', '6', '8', '8.5'],
  },
  {
    id: 7,
    title: 'Nike Dunk Low Panda',
    brand: 'Nike Dunk Low',
    model: 'Panda',
    price: 232,
    image: dunkPanda,
    rates: 4.2,
    color: ['black', 'white'],
    inStock: true,
    size: ['6', '6.5', '7', '7.5', '8', '9', '10', '11', '11.5'],
  },
  {
    id: 8,
    title: 'Jordan 1 Low Starfish',
    brand: 'Nike Jordan Low',
    model: 'Starfish',
    price: 278,
    image: jordanLowStar,
    rates: 3.3,
    color: ['white', 'orange'],
    inStock: true,
    size: ['7.5', '8', '9', '10', '11', '11.5'],
  },
  {
    id: 9,
    title: 'Jordan 1 Mid Chicago Black Toe',
    brand: 'Nike Jordan Mid',
    model: 'Chicago Black Toe',
    price: 135,
    image: jordanMid,
    rates: 2.9,
    color: ['black', 'red', 'white'],
    inStock: true,
    size: ['3', '3.5', '5', '5', '5.5', '7', '8.5', '11.5'],
  },
  {
    id: 10,
    title: 'Jordan 1 High UNC Chicago',
    brand: 'Jordan 1 High',
    model: 'Fearless UNC Chicago',
    price: 414,
    image: jordanHighUnc,
    rates: 5.0,
    color: ['black', 'blue', 'red'],
    inStock: true,
    size: ['10', '11', '11.5'],
  },
  {
    id: 11,
    title: 'Nike Dunk Low Off-White Lot 45',
    brand: 'Nike Dunk Low',
    model: 'Off-White Lot 45',
    price: 710,
    image: dunkOffWhite,
    rates: 5.0,
    color: ['pink', 'grey', 'white'],
    inStock: true,
    sizes: ['8', '11'],
  },
  {
    id: 12,
    title: 'Puma RS-X Core',
    brand: 'Puma RS-X',
    model: 'Sci-Fi White',
    price: 112,
    image: pumaRsxCore,
    rates: 2.1,
    color: ['black', 'white'],
    inStock: true,
    size: ['4', '4.5', '6', '6.5', '8', '9.5'],
  },
];

export const dummy_cart = [
  {
    id: 1,
    title: 'Adidas Yeezy Boosy 700',
    model: 'Beige Tone / Core Black / Cloud White',
    size: '10(US Men)',
    price: 360,
    image: yzInertia,
    qty: 2,
  },
  {
    id: 2,
    title: 'Nike Dunk Low',
    model: 'Retro White Black Panda',
    size: '10.5(US Men)',
    price: 119,
    image: dunkPanda,
    qty: 1,
  },
  {
    id: 3,
    title: 'Adidas Yeezy Slide',
    model: 'Core',
    size: '8(US Men)',
    price: 279,
    image: yzCore,
    qty: 1,
  },
];
