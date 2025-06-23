# About 页面开发实现说明

## 项目概述

本项目是基于 **Next.js 14.2.4** 框架的 Notion 博客系统，about 页面采用 **iframe 嵌入外部页面** 的方式实现，简单高效。

## 技术栈

- **前端框架**: Next.js 14.2.4
- **UI 库**: React 18.2.0  
- **样式框架**: Tailwind CSS 3.3.2
- **包管理器**: npm/yarn

## 文件结构

```
blog-notion/
├── pages/
│   └── about.js                    # About 页面主入口文件
├── themes/
│   └── heo/
│       └── index.js                # 主题布局文件 (包含 LayoutAbout)
└── blog.config.js                  # 全局博客配置
```

## 核心实现

### 1. pages/about.js - 页面主入口

**文件路径**: `pages/about.js`  
**作用**: iframe 嵌入外部关于页面

```javascript
import { useState, useEffect } from 'react';
import { getGlobalData } from '@/lib/db/getSiteData';
import { DynamicLayout } from '@/themes/theme';
import { siteConfig } from '@/lib/config';
import BLOG from '@/blog.config';

const AboutPageWithIframe = (props) => {
  // 外部页面 URL 配置 - 这里改成你的关于页面地址
  const aboutUrl = 'https://about.xingyan.me/'; 

  const [iframeHeight] = useState('calc(100vh - 64px)'); // 减去导航栏高度

  // 强制使用浅色模式
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.body.style.backgroundColor = '#f7f9fe';
  }, []);

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG);

  return (
    <>
      {/* 强制浅色模式样式 */}
      <style jsx global>{`
        html {
          background-color: #f7f9fe !important;
        }
        body {
          background-color: #f7f9fe !important;
        }
        .dark {
          background-color: #f7f9fe !important;
        }
      `}</style>

      {/* 使用专门的 LayoutAbout 布局 */}
      <DynamicLayout theme={theme} layoutName='LayoutAbout' {...props}>
        <div className="w-full overflow-hidden" style={{ height: iframeHeight }}>
          <iframe
            src={aboutUrl}
            title="关于页面"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            loading="lazy"
          />
        </div>
      </DynamicLayout>
    </>
  );
};

// SSG 静态生成配置
export async function getStaticProps(req) {
  const { locale } = req;
  const from = 'about';
  const props = await getGlobalData({ from, locale });
  
  // 标记为 about 页面，用于主题特殊处理
  props.isAboutPage = true;

  return {
    props,
    revalidate: process.env.EXPORT ? undefined : siteConfig(
      'NEXT_REVALIDATE_SECOND',
      BLOG.NEXT_REVALIDATE_SECOND,
      props.NOTION_CONFIG
    )
  };
}

export default AboutPageWithIframe;
```

**关键配置**:
1. **aboutUrl**: 修改为你的外部关于页面地址
2. **强制浅色模式**: 确保页面显示效果一致
3. **页面标识**: `props.isAboutPage = true` 用于隐藏导航元素

### 2. themes/heo/index.js - 专用布局

在主题文件中添加 LayoutAbout 布局组件：

```javascript
/**
 * About页面布局 - 专门用于iframe嵌入的关于页面
 */
const LayoutAbout = props => {
  const { children } = props

  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

// 记得在导出中包含 LayoutAbout
export {
  // ... 其他布局
  LayoutAbout,
  // ... 其他导出
}
```

## 主题集成机制

### 隐藏导航元素

在 heo 主题的相关组件中，对 about 页面进行特殊处理：

**Header.js** - 隐藏搜索、随便逛逛等按钮:
```javascript
const isAboutPage = props.isAboutPage || router.pathname === '/about'

{!isAboutPage && <RandomPostButton {...props} />}
{!isAboutPage && <SearchButton {...props} />}
{!isAboutPage && <MobileMenuButton />}
```

**Logo.js** - 隐藏菜单图标:
```javascript
const isAboutPage = props.isAboutPage || router.pathname === '/about'
{!isAboutPage && <span className="iconfont icon-caidan text-2xl mr-2"></span>}
```

**主布局** - 隐藏页脚，调整容器宽度:
```javascript
{router.pathname !== '/about' && <Footer />}
{router.pathname === '/about' ? 'max-w-full h-full' : 'max-w-4xl'}
```

## 复刻步骤

### 1. 创建页面文件
```bash
# 在 pages 目录下创建 about.js
touch pages/about.js
```

### 2. 复制代码
- 将上面的 `pages/about.js` 代码复制到新建文件
- **修改 aboutUrl** 为你的外部页面地址

### 3. 添加布局组件
- 在你的主题 index.js 文件中添加 `LayoutAbout` 组件
- 确保在导出中包含 `LayoutAbout`

### 4. 主题适配（可选）
如果需要隐藏导航元素，在相关组件中添加：
```javascript
const isAboutPage = props.isAboutPage || router.pathname === '/about'
// 然后用条件渲染控制元素显示
```

### 5. 测试
```bash
npm run dev
# 访问 http://localhost:3000/about 验证效果
```

## 注意事项

1. **跨域问题**: 确保你的外部页面允许被 iframe 嵌入
2. **移动端适配**: iframe 在移动端的显示效果需要测试
3. **加载性能**: 使用 `loading="lazy"` 优化加载
4. **错误处理**: 可以添加 iframe 加载失败的处理逻辑

## 优势

- **实施简单**: 只需要一个页面文件和简单配置
- **维护方便**: 外部页面独立维护，不影响主站
- **样式隔离**: iframe 内容与主站样式完全隔离
- **快速上线**: 无需复杂的 React 组件开发

这就是完整的 iframe 嵌入方案，简单实用！🎯 