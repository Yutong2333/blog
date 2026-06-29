export interface MomentItem {
  content: string;    // 瞬间内容（支持 Markdown）
  date: string;       // 日期，如 "2026-06-25"
  image?: string;     // 可选配图
}

export interface MomentsConfig {
  title?: string;           // 页面标题，留空则使用 i18n
  description?: string;     // 页面描述
  showHeader?: boolean;     // 是否显示页面顶部介绍
  moments: MomentItem[];    // 瞬间列表
}