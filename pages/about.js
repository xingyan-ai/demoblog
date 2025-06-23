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

      {/* 使用主题的默认布局，而不是指定的LayoutAbout */}
      <DynamicLayout theme={theme} {...props}>
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