import React from "react";
import { Text, useTheme, VStack } from "native-base";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";

type MessageType =
  | "comments"
  | "posts"
  | "profileComments"
  | "profilePosts"
  | "profileSavedPosts"
  | "search"
  | "default";

const NoResultMessageMap: Record<MessageType, string> = {
  comments: "No Comments yet. Time to do your part 🫡",
  posts: "No posts found. Maybe you should get a conversation started?",
  profileComments: "User has no Comments.",
  profilePosts: "User has no posts.",
  profileSavedPosts: "User has no saved posts.",
  search: "That Search term returned no results.",
  default: "No result found :(",
};
export interface INoResultViewProps extends InterfaceVStackProps {
  type?: MessageType;
}

function NoResultView({ type, ...rest }: INoResultViewProps) {
  const theme = useTheme();

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" {...rest}>
      <Text
        fontStyle="italic"
        color={theme.colors.app.textSecondary}
        textAlign="center"
      >
        {NoResultMessageMap[type || "default"]}
      </Text>
    </VStack>
  );
}

export default NoResultView;
