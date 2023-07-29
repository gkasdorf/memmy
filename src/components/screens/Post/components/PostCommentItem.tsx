import React, { useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import { onGenericHapticFeedback } from "@src/helpers/HapticFeedbackHelpers";
import { VoteOption } from "@src/components/common/SwipeableRow/VoteOption";
import { ReplyOption } from "@src/components/common/SwipeableRow/ReplyOption";
import useComment from "@src/hooks/comments/useComment";
import CommentItem from "../../../common/Comments/CommentItem";
import setPostCommentVote from "../../../../stores/posts/actions/setPostCommentVote";
import { ILemmyVote } from "../../../../types/lemmy/ILemmyVote";
import { determineVotes } from "../../../../helpers/VoteHelper";
import {
  usePostComment,
  usePostsStore,
} from "../../../../stores/posts/postsStore";

interface IProps {
  commentId: number;
}

function PostCommentItem({ commentId }: IProps) {
  const { postKey } = useRoute<any>().params;
  const comment = usePostComment(postKey, commentId);
  const commentHook = useComment({ comment });

  const onVote = useCallback(
    (value: ILemmyVote) => {
      const newValues = determineVotes(
        value,
        comment.comment.my_vote as ILemmyVote,
        comment.comment.counts.upvotes,
        comment.comment.counts.downvotes
      );

      setPostCommentVote(postKey, comment.comment.comment.id, newValues).then();
    },
    [comment.comment.comment.id, comment.comment.my_vote]
  );

  const onPress = useCallback(() => {
    onGenericHapticFeedback();

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey);
      const prevComment = prev.commentsState.comments.find(
        (c) => c.comment.comment.id === commentId
      );
      prevComment.collapsed = !prevComment.collapsed;
      prev.rerenderComments = !prev.rerenderComments;

      const prevToHide = prev.commentsState.comments.filter(
        (c) =>
          c.comment.comment.path.includes(prevComment.comment.comment.path) &&
          c.comment.comment.id !== commentId
      );

      if (!prevComment.collapsed) {
        prevToHide.forEach((c) => {
          const shouldUnhide =
            prevToHide.findIndex(
              (cc) =>
                cc.collapsed &&
                c.comment.comment.path.includes(cc.comment.comment.path) &&
                c.comment.comment.id !== cc.comment.comment.id
            ) === -1;

          if (shouldUnhide) {
            c.hidden = false;
          }
        });
      } else {
        prevToHide.forEach((c) => {
          c.hidden = true;
        });
      }
    });
  }, [comment.comment.comment.id]);

  const voteOption = useMemo(
    () => <VoteOption onVote={onVote} vote={comment.comment.my_vote} />,
    [comment.comment.comment.id, comment.comment.my_vote]
  );

  const replyOption = useMemo(
    () => <ReplyOption onReply={commentHook.onReply} />,
    [comment.comment.comment.id, comment.comment.my_vote]
  );

  return (
    <CommentItem
      comment={comment}
      onVote={onVote}
      onPress={onPress}
      voteOption={voteOption}
      replyOption={replyOption}
    />
  );
}

export default React.memo(PostCommentItem);
