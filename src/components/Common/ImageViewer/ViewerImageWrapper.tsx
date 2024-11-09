import React, { useCallback, useMemo } from 'react';
import {
  useBlurNsfw,
  useMarkReadOnImageView,
  usePostCommunityNsfw,
  usePostLink,
  usePostNsfw,
  usePostTitle,
  useHapticsEnabled,
} from '@src/state';
import { useTheme } from 'tamagui';
import instance from '@src/Instance';
import { ViewerImage, ViewerImageProps } from 'expo-image-viewer';
import { StyleProp, StyleSheet } from 'react-native';
import { useCreateImageHeaders } from '@hooks/useCreateImageHeaders';

interface IProps {
  itemId: number;
  type: 'compact' | 'full';
}

function ViewerImageWrapper({ itemId, type }: IProps): React.JSX.Element {
  const markReadOnView = useMarkReadOnImageView();
  const theme = useTheme();
  const blurNsfw = useBlurNsfw();
  const hapticsEnabled = useHapticsEnabled();

  const postLink = usePostLink(itemId);
  const postNsfw = usePostNsfw(itemId);
  const postCommunityNsfw = usePostCommunityNsfw(itemId);
  const postTitle = usePostTitle(itemId);

  const imageHeaders = useCreateImageHeaders(postLink!);

  const onPress = useCallback((): void => {
    if (markReadOnView) {
      void instance.markPostRead({ postId: itemId });
    }
  }, [itemId, markReadOnView]);

  const viewerImageProps: Partial<ViewerImageProps> = useMemo(() => ({
    source: postLink!,
    blurRadius: (postNsfw || postCommunityNsfw) && blurNsfw ? 90 : 0,
    title: postTitle,
    headers: imageHeaders,
    onPress: onPress,
    showActivityIndicator: true,
    activityIndicatorColor: theme.accent.val,
    recyclingKey: postLink,
    disableHaptics: !hapticsEnabled
  }), [postLink, postNsfw, postCommunityNsfw, blurNsfw, postTitle, imageHeaders, onPress, theme.accent.val, hapticsEnabled]);
  const markReadOnView = useMarkReadOnImageView();
  const theme = useTheme();
  const blurNsfw = useBlurNsfw();

  const postLink = usePostLink(itemId);
  const postNsfw = usePostNsfw(itemId);
  const postCommunityNsfw = usePostCommunityNsfw(itemId);
  const postTitle = usePostTitle(itemId);

  const imageHeaders = useCreateImageHeaders(postLink!);

  const onPress = useCallback((): void => {
    if (markReadOnView) {
      void instance.markPostRead({ postId: itemId });
    }
  }, [itemId, markReadOnView]);

  if (type === 'compact') {
    return (
      <ViewerImage
        {...viewerImageProps}
        initialDimensions={{ width: 65, height: 65 }}
        activityIndicatorSize="small"
        useInitialDimensions
        contentFit="cover"
        style={styles.image as StyleProp<any>}
      />
    );
  }

  return (
    <ViewerImage
      {...viewerImageProps}
      initialDimensions={{ width: 300, height: 300 }}
      storeLoadedDimensions
    />
  );
    return (
      <ViewerImage
        source={postLink!}
        blurRadius={(postNsfw || postCommunityNsfw) && blurNsfw ? 90 : 0}
        title={postTitle}
        headers={imageHeaders}
        initialDimensions={{ width: 65, height: 65 }}
        onPress={onPress}
        showActivityIndicator
        activityIndicatorSize="small"
        activityIndicatorColor={theme.accent.val}
        recyclingKey={postLink}
        useInitialDimensions
        contentFit="cover"
        style={styles.image as StyleProp<any>}
      />
    );
  }

  return (
    <ViewerImage
      source={postLink!}
      blurRadius={(postNsfw || postCommunityNsfw) && blurNsfw ? 90 : 0}
      title={postTitle}
      headers={imageHeaders}
      initialDimensions={{ width: 300, height: 300 }}
      onPress={onPress}
      showActivityIndicator
      activityIndicatorColor={theme.accent.val}
      recyclingKey={postLink}
      storeLoadedDimensions
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
  },
});

export default React.memo(ViewerImageWrapper);
