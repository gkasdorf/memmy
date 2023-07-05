import React from "react";
import { HStack, useTheme } from "native-base";
import { IconBookmark } from "tabler-icons-react-native";
import IconButtonWithText from "../../common/IconButtonWithText";
import VoteButton from "../../common/VoteButton";

interface Props {
  vote?: number;
  saved?: boolean;
  onSave: () => void;
  onVotePress: (vote: number) => void;
}
export function Actions({ vote, saved, onSave, onVotePress }: Props) {
  const theme = useTheme();
  const upvoted = vote === 1;
  const downvoted = vote === -1;

  const onUpvote = () => {
    onVotePress(1);
  };

  const onDownvote = () => {
    onVotePress(-1);
  };

  return (
    <HStack space={1} alignItems="center" justifyContent="flex-end">
      <IconButtonWithText
        icon={
          <IconBookmark
            size={25}
            color={
              saved
                ? theme.colors.app.bookmarkText
                : theme.colors.app.textSecondary
            }
          />
        }
        iconBgColor={saved ? theme.colors.app.bookmark : theme.colors.app.fg}
        onPressHandler={onSave}
      />
      <VoteButton onPressHandler={onUpvote} type="upvote" isVoted={upvoted} />
      <VoteButton
        onPressHandler={onDownvote}
        type="downvote"
        isVoted={downvoted}
      />
    </HStack>
  );
}
