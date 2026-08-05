import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

/** Semantic icon names → Ionicons glyphs, so screens stay readable. */
const MAP = {
  search: 'search',
  filter: 'options-outline',
  clock: 'time-outline',
  heart: 'heart-outline',
  heartFilled: 'heart',
  plus: 'add',
  minus: 'remove',
  book: 'book-outline',
  chevronRight: 'chevron-forward',
  chevronLeft: 'chevron-back',
  close: 'close',
  share: 'share-outline',
  mic: 'mic-outline',
  check: 'checkmark',
  arrowRight: 'arrow-forward',
  star: 'star-outline',
  starFilled: 'star',
  link: 'link-outline',
  edit: 'create-outline',
  camera: 'camera-outline',
  user: 'person-outline',
  userFilled: 'person',
  list: 'list',
  flame: 'flame',
  image: 'image-outline',
  restaurant: 'restaurant-outline',
  sparkles: 'sparkles-outline',
  trash: 'trash-outline',
  moon: 'moon-outline',
  sun: 'sunny-outline',
  bell: 'notifications-outline',
  mail: 'mail-outline',
  logoApple: 'logo-apple',
  logoGoogle: 'logo-google',
  grid: 'grid-outline',
  timer: 'timer-outline',
  people: 'people-outline',
  checkCircle: 'checkmark-circle',
  infoCircle: 'information-circle-outline',
  basket: 'basket-outline',
  home: 'home-outline',
  globe: 'globe-outline',
  bag: 'bag-outline',
  logoTiktok: 'logo-tiktok',
  logoInstagram: 'logo-instagram',
  logoYoutube: 'logo-youtube',
  logoPinterest: 'logo-pinterest',
  blog: 'reader-outline',
  screenshot: 'phone-portrait-outline',
  playCircle: 'play-circle',
  volumeMute: 'volume-mute-outline',
} as const;

export type IconName = keyof typeof MAP;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof Ionicons>['style'];
};

export function Icon({ name, size = 22, color = '#000', style }: Props) {
  return <Ionicons name={MAP[name]} size={size} color={color} style={style} />;
}
