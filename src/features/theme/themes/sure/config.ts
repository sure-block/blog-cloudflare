import type { ThemeConfig } from "@/features/theme/contract/config";

/**
 * Sure 主题（玻璃拟态）— 数据获取参数
 */
export const config: ThemeConfig = {
  home: {
    recentPostsLimit: 6,
    popularPostsLimit: 6,
  },
  posts: {
    postsPerPage: 10,
  },
  post: {
    relatedPostsLimit: 3,
  },
};
