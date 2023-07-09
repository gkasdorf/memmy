import React from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { useTheme, VStack } from "native-base";
import { Route } from "@react-navigation/native";
import useProfile from "../../../hooks/profile/useProfile";
import CompactFeedItem from "../Feed/components/CompactFeedItem/CompactFeedItem";
import NoResultView from "../../common/NoResultView";
import LoadingView from "../../common/Loading/LoadingView";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import RefreshControl from "../../common/RefreshControl";

interface IRouteParams {
  fullUsername?: string;
  isSavedPosts?: boolean;
}

interface IProps {
  route: Route<"UserPostsScreen", IRouteParams>;
}

function UserPostsScreen({ route }: IProps) {
  const profile = useProfile(false, route?.params?.fullUsername);

  const theme = useTheme();

  const isSavedPosts = React.useMemo(
    () => route?.params?.isSavedPosts || false,
    [route]
  );

  const posts = React.useMemo(
    () => (isSavedPosts ? profile.savedPosts : profile.posts),
    [isSavedPosts, profile]
  );

  const setPosts = React.useMemo(
    () => (isSavedPosts ? profile.setSavedPosts : profile.setPosts),
    [isSavedPosts, profile]
  );

  const noResultViewType = React.useMemo(
    () => (isSavedPosts ? "profileSavedPosts" : "profilePosts"),
    [isSavedPosts]
  );

  const keyExtractor = (item: PostView) => item.post.id.toString();

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => (
      <CompactFeedItem post={item} setPosts={setPosts} />
    ),
    [profile, isSavedPosts]
  );

  // rendering

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={() => profile.doLoad(true)} />;
  }

  if (profile.notFound) {
    return <NotFoundView />;
  }

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <FlashList
        renderItem={renderItem}
        estimatedItemSize={150}
        data={posts}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<NoResultView type={noResultViewType} p={4} />}
        refreshing={profile.loading}
        refreshControl={
          <RefreshControl
            refreshing={profile.refreshing}
            onRefresh={profile.doLoad}
          />
        }
      />
    </VStack>
  );
}

export default UserPostsScreen;
