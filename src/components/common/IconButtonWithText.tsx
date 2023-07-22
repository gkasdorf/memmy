import { Box, HStack, Pressable, Text } from "@components/common/Gluestack";
import React from "react";
import { GestureResponderEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface IconButtonWithTextProps {
  onPressHandler?: (event: GestureResponderEvent) => void;
  icon: JSX.Element;
  iconBgColor?: string;
  text?: string | number;
  textColor?: string;
  size?: React.ComponentProps<typeof Text>["size"];
}

function IconButtonWithText({
  onPressHandler,
  icon,
  iconBgColor,
  text,
  textColor,
  size = "lg",
}: IconButtonWithTextProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(1.4, { duration: 250 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 250 });
  };

  return (
    <Pressable
      onPress={onPressHandler}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={5}
    >
      <HStack space="sm" alignItems="center">
        <Animated.View style={animatedStyle}>
          <Box borderRadius={5} backgroundColor={iconBgColor} padding="$0.5">
            {icon}
          </Box>
        </Animated.View>
        {text !== undefined && (
          <Text color={textColor} size={size}>
            {text}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default React.memo(IconButtonWithText);
