import { Image, Pressable, Text, View, type DimensionValue } from 'react-native';

import { appImages } from '@/constants/images';
import { somaticRegionDots } from '@/features/somatic/data/somatic-content';
import type { SomaticRegion } from '@/lib/api/types';

interface SomaticMapCardProps {
  onSelectRegion: (region: SomaticRegion) => void;
}

export function SomaticMapCard({ onSelectRegion }: SomaticMapCardProps) {
  const labelPositions: Record<
    (typeof somaticRegionDots)[number]['id'],
    { left: DimensionValue; top: DimensionValue }
  > = {
    chest: { left: '55%', top: '66%' },
    'face-throat': { left: '47%', top: '47%' },
    'hands-legs': { left: '75%', top: '80%' },
    head: { left: '56%', top: '13%' },
    heart: { left: '28%', top: '65%' },
    stomach: { left: '34%', top: '90%' },
  };

  return (
    <View className="items-center px-2">
      <View className="relative h-[640px] w-[384px] items-center justify-center">
        <Image
          className="h-[640px] w-[384px]"
          resizeMode="contain"
          source={appImages.HumanMap}
        />

        {somaticRegionDots.map((dot) => {
          const active = Boolean(dot.active);

          return (
            <Pressable
              className="absolute"
              key={dot.id}
              onPress={() => {
                if (active) {
                  onSelectRegion(dot.id);
                }
              }}
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <View
                className={`h-4 w-4 rounded-full border-2 ${
                  active ? 'border-[#59E7DD] bg-[#7CEADF]' : 'border-[#CFE2ED] bg-[#BFD0DB]'
                }`}
              />
            </Pressable>
          );
        })}

        {somaticRegionDots.map((dot) => {
          if (!dot.active) {
            return null;
          }

          const position = labelPositions[dot.id];

          return (
            <Pressable
              className="absolute rounded-full px-4 py-2"
              key={`${dot.id}-label`}
              onPress={() => onSelectRegion(dot.id)}
              style={{
                backgroundColor: '#FFFFFF',
                left: position.left,
                top: position.top,
              }}
            >
              <Text
                className="font-poppinsMedium text-[11px]"
                numberOfLines={1}
                style={{ color: '#183743' }}
              >
                {dot.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
