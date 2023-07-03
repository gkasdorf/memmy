import React from "react";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { IconDots } from "tabler-icons-react-native";
import { Alert } from "react-native";
import HeaderIconButton from "../buttons/HeaderIconButton";
import { commentSortOptions } from "../../../types/CommentSortOptions";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { showToast } from "../../../slices/toast/toastSlice";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppDispatch } from "../../../store";

interface IProps {
  postId: number;
}

function CommentSortButton({ postId }: IProps) {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();

  const onPress = () => {
    const cancelButtonIndex = commentSortOptions.length;

    showActionSheetWithOptions(
      {
        options: ["Report Post", "Cancel"],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;

        if (index === 0) onReportPress().then();
      }
    );
  };

  const onReportPress = async () => {
    await Alert.prompt(
      "Report Post",
      "Please describe your reason for reporting this post.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          style: "default",
          onPress: async (v) => {
            try {
              await lemmyInstance.createPostReport({
                auth: lemmyAuthToken,
                post_id: postId,
                reason: v,
              });

              dispatch(
                showToast({
                  message: "Report submitted successfully",
                  variant: "info",
                })
              );
            } catch (e) {
              writeToLog("Error reporting comment.");
              writeToLog(e.toString());
            }
          },
        },
      ]
    );
  };

  return (
    <HeaderIconButton
      icon={<IconDots size={24} color={theme.colors.app.accent} />}
      onPress={onPress}
    />
  );
}

export default CommentSortButton;
