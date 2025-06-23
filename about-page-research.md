# Heo 主题 About 页面定制化研究报告

## 1. 问题背景

在尝试为 Heo 主题添加一个独立的、用于内嵌外部网页的 `/about` 页面时，Vercel 构建失败，错误为 `Error: Invariant: page wasn't built`。直接在 Notion 中创建页面并使用 `<iframe>` 的方案，虽然能构建成功，但无法移除侧边栏，不符合设计需求。

核心目标：创建一个无侧边栏、全屏嵌入外部网页的 `/about` 页面，并能成功部署。

## 2. 核心文件分析

我们对 `heo` 主题的入口文件 `themes/heo/index.js` 进行了分析，特别是 `LayoutBase` 这个所有页面的基础布局组件。

## 3. 关键发现

在 `LayoutBase` 组件中，我们发现了以下两处关键代码：

**发现一：侧边栏的显示逻辑**
```javascript
// themes/heo/index.js 第 89 行附近
const slotRight = router.route === '/about' ? null : <SideRight {...props} />
```
*   **含义**: 这行代码明确指出，当路由路径为 `/about` 时，右侧边栏 `SideRight` 组件不会被渲染（值为 `null`）。这表明主题作者有意让 `/about` 页面隐藏侧边栏。

**发现二：页脚的显示逻辑**
```javascript
// themes/heo/index.js 第 131 行附近
{router.route !== '/about' && <Footer />}
```
*   **含义**: 这行代码表示，当路由路径**不等于** `/about` 时，才会渲染 `Footer` 组件。这也佐证了作者希望 `/about` 页面是一个特殊的、可能全屏的页面。

## 4. 问题根源诊断

`heo` 主题的作者虽然预留了 `/about` 页面的特殊样式（无侧边栏、无页脚），但他实现的方式是**硬编码**的，依赖于 `router.route` 这个路由路径判断。

这种实现方式导致了一个根本性的冲突：
*   **硬编码的期望**: 它期望存在一个物理文件 `pages/about.js`，这样 `router.route` 的值才会是 `/about`。
*   **框架的设计**: NotionNext 的核心设计是通过动态路由 `pages/[prefix]/[slug]/index.js` 从 Notion 数据库生成页面。在这种模式下，所有页面（包括我们从Notion创建的 `/about` 页面）的 `router.route` 值都是 `/[prefix]/[slug]`，永远不会等于 `/about`。

因此，我们无论是在本地创建 `pages/about.js`（与动态路由冲突导致构建失败），还是在 Notion 创建 `/about` 页面（无法触发硬编码的隐藏逻辑），都无法达到理想效果。

## 5. 最终解决方案

既然我们已经理解了问题的根源，解决方案就变得清晰了：我们需要创建一个**专属的、不依赖硬编码路径判断的"关于页面布局"**。

具体步骤如下：
1.  **创建新布局文件 `LayoutAbout.js`**: 在 `themes/heo/components/` 目录下，复制 `LayoutBase` 的代码作为模板，创建一个新的 `LayoutAbout.js` 文件。
2.  **净化新布局**: 在 `LayoutAbout.js` 中，移除所有 `router.route === '/about'` 的判断逻辑，并直接将侧边栏和页脚设置为不渲染。这将使其成为一个纯粹的全屏布局。
3.  **注册新布局**: 在 `themes/heo/index.js` 中，导入并导出我们新建的 `LayoutAbout` 布局，使其对整个项目可见。
4.  **重建 `pages/about.js`**: 恢复 `pages/about.js` 文件，并在其中明确指定使用我们新的 `LayoutAbout` 布局 (`layoutName='LayoutAbout'`)。

通过这个方案，我们可以完美地将定制化需求融入现有框架，既实现了设计目标，又保证了构建的稳定性。 