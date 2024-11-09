import { IPostGestureOption } from '@src/types/IPostGestureOption';
import { CommentSortType, ListingType, SortType } from 'lemmy-js-client';
import { ICommentGestureOption, IThemeOption } from '@src/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IHapticStrengthOption } from '@src/types/options';

export interface IGesturePostSettings {
  enabled: boolean;
  firstRight: IPostGestureOption;
  secondRight: IPostGestureOption;
  firstLeft: IPostGestureOption;
  secondLeft: IPostGestureOption;
}

export interface IGestureCommentSettings {
  enabled: boolean;
  collapse: boolean;
  firstRight: IPostGestureOption;
  secondRight: IPostGestureOption;
  firstLeft: IPostGestureOption;
  secondLeft: IPostGestureOption;
}

export interface IGestureSettings {
  post: IGesturePostSettings;
  comment: IGestureCommentSettings;
}

export interface IReadOptions {
  onPostView: boolean;
  onImageView: boolean;
  onVote: boolean;
  onFeedScroll: boolean;
  onCommunityScroll: boolean;
  onLinkOpen: boolean;

  hideReadPostsFeed: boolean;
  hideReadPostsCommunity: boolean;
}

export interface SettingsStore {
  gestures: IGestureSettings;

  fullWidthSwipes: boolean;

  imagesInFeed: boolean;

  defaultSort: SortType;
  defaultCommentSort: CommentSortType;
  defaultListingType: ListingType;
  defaultCommunitySort: SortType;

  hideInstanceForUsernames: boolean;
  blurNsfw: boolean;

  viewType: 'full' | 'compact';
  compactThumbnailPosition: 'left' | 'right' | 'none';
  compactVoteButtonPosition: 'left' | 'right' | 'none';
  compactShowUsername: boolean;
  compactShowFullTitle: boolean;

  theme: IThemeOption;
  themeLight: IThemeOption;
  themeDark: IThemeOption;

  themeMatchSystem: boolean;

  fontSize: number;

  postTitleWeight: 'normal' | 'bold';

  readOptions: IReadOptions;

  imagesIgnoreScreenHeight: boolean;

  totalScore: boolean;

  readerMode: boolean;

  appIcon: string;

  useDefaultBrowser: boolean;

  hideUsernameInTab: boolean;
  hideAvatarInTab: boolean;

  commentJumpButton: boolean;

  hapticsEnabled: boolean;
  hapticsStrength: IHapticStrengthOption;

  showCommunityIconInFeed: boolean;
  showAvatarInFeed: boolean;
  animateAvatars: boolean;

  showAvatarInTabBar: boolean;
  showUsernameInTabBar: boolean;

  accentColor: string | undefined;

  mouseLoadingIcon: boolean;

  showCommentButtons: boolean;
  showCommentJumpButton: boolean;

  useImgur: boolean;

  upgraded: boolean;

  reset: () => void;
}

const initialState: Partial<SettingsStore> = {
  gestures: {
    post: {
      enabled: true,

      firstLeft: 'upvote',
      secondLeft: 'downvote',

      firstRight: 'save',
      secondRight: 'reply',
    },
    comment: {
      enabled: true,
      collapse: true,

      firstLeft: 'upvote',
      secondLeft: 'downvote',

      firstRight: 'save',
      secondRight: 'reply',
    },
  },

  fullWidthSwipes: false,

  imagesInFeed: true,

  defaultSort: 'Hot',
  defaultCommentSort: 'Top',
  defaultListingType: 'All',
  defaultCommunitySort: 'Hot',

  hideInstanceForUsernames: true,
  blurNsfw: true,

  viewType: 'full',

  compactThumbnailPosition: 'left',
  compactVoteButtonPosition: 'right',
  compactShowUsername: false,
  compactShowFullTitle: false,

  theme: 'lightTheme',
  themeLight: 'lightTheme',
  themeDark: 'darkTheme',

  themeMatchSystem: false,

  fontSize: 16,

  postTitleWeight: 'bold',

  readOptions: {
    onPostView: true,
    onImageView: true,
    onVote: true,
    onFeedScroll: false,
    onCommunityScroll: false,
    onLinkOpen: false,

    hideReadPostsFeed: false,
    hideReadPostsCommunity: false,
  },

  imagesIgnoreScreenHeight: false,

  totalScore: false,

  readerMode: false,

  appIcon: 'default',

  useDefaultBrowser: false,

  hideUsernameInTab: false,
  hideAvatarInTab: false,

  commentJumpButton: false,

export const useHapticsEnabled = (): boolean =>
  useSettingsStore((state) => state.hapticsEnabled);
  hapticsEnabled: true,
  hapticsStrength: 'medium',

  showCommunityIconInFeed: true,
  showAvatarInFeed: true,
  animateAvatars: true,

  showAvatarInTabBar: true,
  showUsernameInTabBar: true,

  showCommentButtons: false,
  showCommentJumpButton: false,

  mouseLoadingIcon: false,

  useImgur: false,

  upgraded: false,

  accentColor: undefined,
};

export const useSettingsStore = create(
  persist(
    // @ts-expect-error all good
    immer<SettingsStore>((set) => ({
      ...initialState,

      reset: () => {
        set((state) => ({
          ...state,
          ...initialState,
        }));
      },
    })),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useSetting = <T extends keyof SettingsStore>(
  setting: T,
): string | boolean | number | object | object[] => {
  // @ts-expect-error TODO Type this better
  return useSettingsStore((state) => state[setting]);
};

interface IFeedSettings {
  defaultSort: SortType;
  defaultListingType: ListingType;
}

export const useFeedSettings = (): IFeedSettings =>
  useSettingsStore((state) => ({
    defaultSort: state.defaultSort,
    defaultListingType: state.defaultListingType,
  }));

export const usePostGesturesEnabled = (): boolean =>
  useSettingsStore((state) => state.gestures.post.enabled);

export const usePostGesturesFirstRight = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.firstRight);
export const usePostGesturesFirstLeft = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.firstLeft);
export const usePostGesturesSecondRight = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.secondRight);
export const usePostGesturesSecondLeft = (): IPostGestureOption =>
  useSettingsStore((state) => state.gestures.post.secondLeft);

export const useCommentGesturesEnabled = (): boolean =>
  useSettingsStore((state) => state.gestures.comment.enabled);

export const useCommentGesturesCollapse = (): boolean =>
  useSettingsStore((state) => state.gestures.comment.collapse);

export const useCommentGesturesFirstRight = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.firstRight);
export const useCommentGesturesFirstLeft = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.firstLeft);
export const useCommentGesturesSecondRight = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.secondRight);
export const useCommentGesturesSecondLeft = (): ICommentGestureOption =>
  useSettingsStore((state) => state.gestures.comment.secondLeft);

export const useDefaultSort = (): SortType | undefined =>
  useSettingsStore((state) => state.defaultSort);

export const useDefaultCommunitySort = (): SortType | undefined =>
  useSettingsStore((state) => state.defaultCommunitySort);

export const useDefaultCommentSort = (): CommentSortType | undefined =>
  useSettingsStore((state) => state.defaultCommentSort);

export const useDefaultListingType = (): ListingType | undefined =>
  useSettingsStore((state) => state.defaultListingType);

export const useAccent = (): string | undefined =>
  useSettingsStore((state) => state.accentColor);

export const useRegularTheme = (): IThemeOption =>
  useSettingsStore((state) => state.theme);

export const useLightTheme = (): IThemeOption =>
  useSettingsStore((state) => state.themeLight);

export const useDarkTheme = (): IThemeOption =>
  useSettingsStore((state) => state.themeDark);

export const useMatchSystemTheme = (): boolean =>
  useSettingsStore((state) => state.themeMatchSystem);

export const useShowAvatarInTabBar = (): boolean =>
  useSettingsStore((state) => state.showAvatarInTabBar);

export const useShowUsernameInTabBar = (): boolean =>
  useSettingsStore((state) => state.showUsernameInTabBar);

export const useAppUpgraded = (): boolean | undefined =>
  useSettingsStore((state) => state.upgraded);

export const useFontSize = (): number =>
  useSettingsStore((state) => state.fontSize);

export const useMarkReadOnFeedScroll = (): boolean =>
  useSettingsStore((state) => state.readOptions.onFeedScroll);

export const useMarkReadOnCommunityScroll = (): boolean =>
  useSettingsStore((state) => state.readOptions.onCommunityScroll);

export const useMarkReadOnImageView = (): boolean =>
  useSettingsStore((state) => state.readOptions.onImageView);

export const useMarkReadOnPostOpen = (): boolean =>
  // TODO Change this in a future version
  useSettingsStore((state) => state.readOptions.onPostView);

export const useMarkReadOnVote = (): boolean =>
  useSettingsStore((state) => state.readOptions.onVote);

export const useMarkReadOnLinkOpen = (): boolean =>
  useSettingsStore((state) => state.readOptions.onLinkOpen);

export const useMouseLoadingIcon = (): boolean =>
  useSettingsStore((state) => state.mouseLoadingIcon);

export const useBlurNsfw = (): boolean =>
  useSettingsStore((state) => state.blurNsfw);

export const useHideCommunityInComment = (): boolean =>
  useSettingsStore((state) => state.hideInstanceForUsernames);

export const useCompactShowUsername = (): boolean =>
  useSettingsStore((state) => state.compactShowUsername);

export const useShowCommentButtons = (): boolean =>
  useSettingsStore((state) => state.showCommentButtons);

export const useFullWidthSwipes = (): boolean =>
  useSettingsStore((state) => state.fullWidthSwipes);

export const useShowTotalScore = (): boolean =>
  useSettingsStore((state) => state.totalScore);

export const useAnimateAvatars = (): boolean =>
  useSettingsStore((state) => state.animateAvatars);

export const useViewType = (): 'full' | 'compact' =>
  useSettingsStore((state) => state.viewType);

export const useShowCommentJumpButton = (): boolean =>
  useSettingsStore((state) => state.showCommentJumpButton);

export const useIgnoreScreenHeight = (): boolean =>
  useSettingsStore((state) => state.imagesIgnoreScreenHeight);

export const useThumbnailPosition = (): 'left' | 'right' | 'none' =>
  useSettingsStore((state) => state.compactThumbnailPosition);

export const useVoteButtonPosition = (): 'left' | 'right' | 'none' =>
  useSettingsStore((state) => state.compactVoteButtonPosition);

export const useCompactShowFullTitle = (): boolean =>
  useSettingsStore((state) => state.compactShowFullTitle);
