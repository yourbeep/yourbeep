import { Image, ImageSourcePropType, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { somaticToneClasses } from '@/features/somatic/data/somatic-content';
import { useAppTheme } from '@/theme/use-app-theme';

interface SensationCardOption {
  description: string;
  title: string;
  tone: keyof typeof somaticToneClasses;
}

interface HeadSensationCardProps {
  hideDescription?: boolean;
  variant?: 'default' | 'selection';
  onPress: () => void;
  option: SensationCardOption;
  source: ImageSourcePropType;
  wide?: boolean;
}

const gradientByTone = {
  mist: ['#F5F2E8', '#E9E7DD'],
  sand: ['#FFF3EB', '#FCE2D7'],
  sky: ['#E9FBFD', '#D6F0F5'],
} as const;

export function HeadSensationCard({
  hideDescription = false,
  onPress,
  option,
  source,
  variant = 'default',
  wide = false,
}: HeadSensationCardProps) {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const isSelection = variant === 'selection';
  const cardTextColor = '#183743';
  const cardSecondaryTextColor = '#5A7078';
  const imageHeight = wide
    ? isSelection
      ? isCompact
        ? 170
        : 196
      : isCompact
        ? 150
        : 176
    : isSelection
      ? isCompact
        ? 218
        : 244
      : isCompact
        ? 168
        : 192;

  return (
    <Pressable
      className={`overflow-hidden border ${
        isSelection
          ? 'rounded-[30px] px-0 pb-0 pt-0'
          : 'rounded-[20px] p-3'
      } ${somaticToneClasses[option.tone]}`}
      onPress={onPress}
    >
      <LinearGradient
        className={`overflow-hidden ${isSelection ? '' : 'rounded-[16px]'}`}
        colors={wide && isSelection ? ['#FFB95F33', '#F8F9FA'] : gradientByTone[option.tone]}
      >
        <Image
          className="w-full"
          resizeMode="cover"
          source={source}
          style={{ height: imageHeight }}
        />
      </LinearGradient>

      <View
        className={`gap-1 ${
          isSelection
            ? `${wide ? 'px-6 py-5' : 'px-6 py-4'}`
            : 'px-1 pb-1 pt-3'
        }`}
      >
        <Text
          className={`${
            isSelection
              ? `${
                  wide
                    ? isCompact
                      ? 'font-poppinsMedium text-[18px] leading-[26px]'
                      : 'font-poppinsMedium text-[22px] leading-[30px]'
                    : isCompact
                      ? 'font-poppinsMedium text-[15px] leading-[22px]'
                      : 'font-poppinsMedium text-[18px] leading-[26px]'
                }`
              : isCompact
                ? 'font-poppinsMedium text-[13px] leading-[18px]'
                : 'font-poppinsMedium text-[14px] leading-[20px]'
          }`}
          style={{ color: cardTextColor }}
        >
          {option.title}
        </Text>

        {!hideDescription ? (
          <Text
            className={`${
              isSelection
                ? 'font-poppinsRegular text-[14px] leading-[22px]'
                : 'font-poppinsRegular text-[12px] leading-[18px]'
            }`}
            style={{ color: cardSecondaryTextColor }}
          >
            {option.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
