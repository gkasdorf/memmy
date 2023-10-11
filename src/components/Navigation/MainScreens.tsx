import React from 'react';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from '@react-navigation/core';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';
import FeedIndexScreen from '@components/Feed/screens/FeedIndexScreen';
import { useTheme } from 'tamagui';
import PostScreen from '@components/Post/screens/PostScreen';

export default function MainScreens(
  stack: TypedNavigator<
    ParamListBase,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    ({
      id,
      initialRoutename,
      children,
      screenListeners,
      screenOptions,
      ...rest
    }: NativeStackNavigatorProps) => JSX.Element
  >,
): React.JSX.Element {
  const theme = useTheme();

  return (
    <>
      <stack.Screen
        name="FeedIndex"
        component={FeedIndexScreen}
        options={{
          headerShown: true,
        }}
      />
      <stack.Screen
        name="Post"
        component={PostScreen}
        options={{
          headerShown: true,
        }}
      />
    </>
  );
}