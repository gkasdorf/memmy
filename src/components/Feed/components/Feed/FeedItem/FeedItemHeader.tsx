import React from 'react';
import { Text, View } from 'tamagui';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import { IPostCommunityName } from '@src/state/post/postStore';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { CircleEllipsis } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';

interface IProps {
  title?: string;
  communityName: IPostCommunityName | undefined;
  communityIcon?: string;
}

export default function FeedItemHeader({
  title,
  communityName,
  communityIcon,
}: IProps): React.JSX.Element {
  const fontSize = useSettingsStore((state) => state.fontSize);
  const fontWeight = useSettingsStore((state) => state.postTitleWeight);

  return (
    <VStack paddingHorizontal="$3" space="$1.5">
      <HStack alignItems="center">
        <PostCommunityLabel
          communityName={communityName}
          communityIcon={communityIcon}
        />
        <View marginLeft="auto">
          <AnimatedIconButton
            icon={CircleEllipsis}
            iconSize={18}
            onPress={() => {
              Alert.alert('Hi!');
            }}
          />
        </View>
      </HStack>
      <Text fontSize={fontSize} fontWeight={fontWeight}>
        {title}
      </Text>
    </VStack>
  );
}
