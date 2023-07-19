import { create } from "zustand";
import { CommentSortType, PostView } from "lemmy-js-client";
import { shallow } from "zustand/shallow";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

export interface PostsState {
  posts: {
    [postKey: string]: PostState;
  };
}

export interface PostState {
  post: PostView;
  postLoading: boolean;
  postError: boolean;

  comments: ILemmyComment[];
  visibleComments: ILemmyComment[];

  commentsLoading: boolean;
  commentsError: boolean;

  collapsed: boolean;
  sortType: CommentSortType;
}

export const usePostsStore = create<PostsState>()(() => ({
  // All of our post states
  posts: {},
}));

export const useCurrentPost = (postKey: string) =>
  usePostsStore((state) => state.posts[postKey]);