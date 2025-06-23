import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import { NoticeBar } from './NoticeBar'
import PostHeader from './PostHeader'
import SideRight from './SideRight'
import CONFIG from '../config'
import { Style } from '../style'
import Hero from './Hero'
import LoadingCover from '@/components/LoadingCover'

/**
 * About页面专属布局
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutAbout = props => {
  const { children, slotTop, className } = props

  // 全屏模式下的最大宽度
  const { fullWidth, isDarkMode } = useGlobal()

  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <Header {...props} />
    </header>
  )
  
  // 右侧栏直接不显示
  const slotRight = null

  // 使用全宽度
  const maxWidth = 'max-w-full'

  const HEO_LOADING_COVER = siteConfig('HEO_LOADING_COVER', true, CONFIG)

  // 加载wow动画
  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <div
      id='theme-heo'
      className={`${siteConfig('FONT_STYLE')} bg-[#f7f9fe] dark:bg-[#18171d] h-full min-h-screen flex flex-col scroll-smooth`}>
      <Style />

      {/* 顶部嵌入 导航栏 */}
      {headerSlot}

      {/* 主区块 */}
      <main
        id='wrapper-outer'
        className={`flex-grow w-full ${maxWidth} mx-auto relative md:px-5`}>
        <div
          id='container-inner'
          className={'w-full mx-auto lg:flex justify-center relative z-10'}>
          <div className={`w-full h-auto ${className || ''}`}>
            {/* 主区上部嵌入 */}
            {slotTop}
            {children}
          </div>

          <div className='lg:px-2'></div>

          <div className='hidden xl:block'>
            {/* 主区快右侧 */}
            {slotRight}
          </div>
        </div>
      </main>

      {/* 页脚直接不显示 */}

      {HEO_LOADING_COVER && <LoadingCover />}
    </div>
  )
}

export default LayoutAbout 