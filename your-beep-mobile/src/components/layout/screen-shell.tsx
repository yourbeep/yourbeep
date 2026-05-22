import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenShellProps extends PropsWithChildren {
  contentClassName?: string;
  scrollEnabled?: boolean;
}

export function ScreenShell({
  children,
  contentClassName,
  scrollEnabled = true,
}: ScreenShellProps) {
  const body = scrollEnabled ? (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className={`gap-6 px-[22px] pb-10 pt-3 ${contentClassName ?? ''}`}>{children}</View>
    </ScrollView>
  ) : (
    <View className={`flex-1 gap-6 px-[22px] pb-10 pt-3 ${contentClassName ?? ''}`}>
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-brand-background">
      <SafeAreaView className="flex-1 bg-brand-background" edges={['top', 'left', 'right']}>
        {body}
      </SafeAreaView>
    </View>
  );
}
