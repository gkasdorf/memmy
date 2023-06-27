import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Divider,
  HStack,
  IconButton,
  Pressable,
  Text,
  VStack,
  View,
  useTheme,
} from "native-base";
import React, { SetStateAction, useMemo } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  IconArrowDown,
  IconArrowUp,
  IconDots,
  IconMail,
  IconMailOpened,
  IconMessage,
} from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import useSwipeAnimation from "../../hooks/animations/useSwipeAnimation";
import useComment from "../../hooks/post/useComment";
import NamePill from "../NamePill";
import AvatarUsername from "../common/AvatarUsername";
import SmallVoteIcons from "../common/SmallVoteIcons";
import RenderMarkdown from "../markdown/RenderMarkdown";

function CommentItem({
  comment,
  setComments,
  onPressOverride,
  setRead,
  isRead = false,
  opId,
  depth,
  isReply,
}: {
  comment: ILemmyComment;
  setComments:
    | React.Dispatch<SetStateAction<ILemmyComment[]>>
    | ((comments: ILemmyComment[]) => void);
  onPressOverride?: () => Promise<void> | void;
  setRead?: React.Dispatch<SetStateAction<boolean>>;
  isRead?: boolean;
  depth?: number;
  opId?: number;
  isReply?: boolean;
}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showInstanceForUsernames } = useAppSelector(selectSettings);
  const currentAccount = useAppSelector(selectCurrentAccount);

  if (!depth) {
    depth = comment.comment.comment.path.split(".").length;
  }

  const commentHook = useComment({
    comment,
    setComments,
    onPressOverride,
    setRead,
  });

  const swipeAnimation = useSwipeAnimation({
    onLeftRightOne: () => commentHook.onVote(1),
    onLeftRightTwo: () => commentHook.onVote(-1),
    onRightLeftOne: () => {
      dispatch(
        setResponseTo({
          comment: comment.comment,
          languageId: comment.comment.post.language_id,
        })
      );
      navigation.push("NewComment");
    },
    onRightLeftTwo: () => {},
    leftRightOneIcon: () => <IconArrowUp size={32} color="#fff" />,
    leftRightTwoIcon: () => <IconArrowDown size={32} color="#fff" />,
    rightLeftOneIcon: () => <IconMessage size={32} color="#fff" />,
    rightLeftTwoIcon: () => <IconMessage size={20} />,
  });

  return useMemo(() => {
    if (comment.hidden) return null;
    return (
      <>
        <View>
          <View style={styles.backgroundContainer}>
            <View
              style={styles.backgroundLeft}
              justifyContent="center"
              backgroundColor={swipeAnimation.color}
              pl={4}
            >
              {swipeAnimation.leftIcon}
            </View>
            <View
              style={styles.backgroundLeft}
              backgroundColor={swipeAnimation.color}
            />
            <View
              style={styles.backgroundRight}
              justifyContent="center"
              backgroundColor="#007AFF"
              alignItems="flex-end"
              pr={4}
            >
              {swipeAnimation.rightIcon}
            </View>
          </View>
          <PanGestureHandler
            onGestureEvent={swipeAnimation.gestureHandler}
            minPointers={1}
            activeOffsetX={[-20, 20]}
            hitSlop={{ left: -25 }}
          >
            <Animated.View style={[swipeAnimation.animatedStyle]}>
              <Pressable
                onPress={commentHook.onCommentPress}
                onLongPress={commentHook.onCommentLongPress}
              >
                <VStack
                  flex={1}
                  pr={2}
                  pb={1}
                  space={2}
                  backgroundColor={theme.colors.app.fg}
                  style={{
                    paddingLeft: depth * 8,
                  }}
                >
                  <VStack
                    borderLeftWidth={depth > 2 ? 2 : 0}
                    borderLeftColor={
                      theme.colors.app.comments[depth - 2] ??
                      theme.colors.app.comments[5]
                    }
                    borderLeftRadius={1}
                    pl={depth > 2 ? 2 : 0}
                    mt={0}
                  >
                    <HStack
                      space={2}
                      justifyContent="space-between"
                      alignItems="center"
                      mb={-3}
                      pb={2}
                    >
                      <AvatarUsername
                        creator={comment.comment.creator}
                        showInstance={showInstanceForUsernames}
                      >
                        <>
                          {(currentAccount &&
                            currentAccount.username &&
                            currentAccount.instance &&
                            comment.comment.creator.name ===
                              currentAccount?.username &&
                            getBaseUrl(comment.comment.creator.actor_id) ===
                              currentAccount?.instance && (
                              <NamePill
                                text="me"
                                color={theme.colors.app.users.me}
                              />
                            )) ||
                            (comment.comment.creator.id === opId && (
                              <NamePill
                                text="OP"
                                color={theme.colors.app.users.op}
                              />
                            ))}
                          <SmallVoteIcons
                            upvotes={comment.comment.counts.upvotes}
                            downvotes={comment.comment.counts.downvotes}
                            myVote={comment.comment.my_vote as ILemmyVote}
                            initialVote={comment.myVote}
                          />
                        </>
                      </AvatarUsername>
                      <HStack alignItems="center" space={2}>
                        {isReply && (
                          <>
                            {!isRead ? (
                              <IconButton
                                icon={
                                  <IconMail
                                    size={24}
                                    color={theme.colors.app.textSecondary}
                                  />
                                }
                                onPress={commentHook.onReadPress}
                              />
                            ) : (
                              <IconMailOpened
                                size={24}
                                color={theme.colors.app.textSecondary}
                              />
                            )}
                          </>
                        )}
                        {!isReply && (
                          <IconButton
                            icon={
                              <IconDots
                                size={24}
                                color={theme.colors.app.textSecondary}
                              />
                            }
                            onPress={commentHook.onCommentLongPress}
                          />
                        )}
                        <Text color={theme.colors.app.textSecondary}>
                          {timeFromNowShort(comment.comment.comment.published)}
                        </Text>
                      </HStack>
                    </HStack>
                    {comment.collapsed ? (
                      <Text
                        py={3}
                        color={theme.colors.app.textSecondary}
                        fontStyle="italic"
                      >
                        Comment collapsed
                      </Text>
                    ) : (
                      <>
                        {(comment.comment.comment.deleted && (
                          <Text
                            py={3}
                            color={theme.colors.app.textSecondary}
                            fontStyle="italic"
                          >
                            Comment deleted by user :(
                          </Text>
                        )) ||
                          (comment.comment.comment.removed && (
                            <Text
                              py={3}
                              color={theme.colors.app.textSecondary}
                              fontStyle="italic"
                            >
                              Comment removed by moderator :(
                            </Text>
                          )) || (
                            <RenderMarkdown
                              text={comment.comment.comment.content}
                              addImages
                            />
                          )}
                      </>
                    )}
                  </VStack>
                  <Divider ml={0} mt={-1} bg={theme.colors.app.border} />
                </VStack>
              </Pressable>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </>
    );
  }, [swipeAnimation.leftIcon, swipeAnimation.rightIcon, comment]);
}

const styles = StyleSheet.create({
  side: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    marginLeft: -4,
  },

  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: "row",
  },

  backgroundLeft: {
    flex: 1,
  },

  backgroundRight: {
    flex: 1,
  },
});

export default CommentItem;
