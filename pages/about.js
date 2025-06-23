import { getGlobalData } from '@/lib/db/getSiteData'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { DynamicLayout } from '@/themes/theme'

/**
 * 自定义的关于页
 * @param {*} props
 * @returns
 */
const About = props => {
  // about页面嵌入一个iframe
  const aboutUrl = 'https://about.xingyan.me/'

  return (
    <DynamicLayout {...props} layoutName='LayoutAbout'>
        <div className="w-full h-screen overflow-hidden">
          <iframe
            src={aboutUrl}
            title="关于页面"
            className='w-full h-full'
            style={{ border: 'none' }}
            loading="lazy"
          />
        </div>
    </DynamicLayout>
  )
}

export async function getStaticProps () {
  const props = await getGlobalData({
    from: 'about'
  })
  // 标记为about页面
  props.isAboutPage = true
  delete props.allPages
  return {
    props,
    revalidate: parseInt(siteConfig('NEXT_REVALIDATE_SECOND', '1', BLOG.NOTION_CONFIG))
  }
}

export default About 