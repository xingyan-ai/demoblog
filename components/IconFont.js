import React from 'react'

/**
 * 阿里巴巴图标库组件
 * 用于逐步替换FontAwesome图标，确保向后兼容
 */
const IconFont = ({ 
  type, 
  className = '', 
  style = {}, 
  onClick,
  title,
  id 
}) => {
  // 确保图标类名的正确格式
  const iconClass = type?.startsWith('icon-') ? type : `icon-${type}`
  
  return (
    <i 
      className={`iconfont ${iconClass} ${className}`}
      style={style}
      onClick={onClick}
      title={title}
      id={id}
    />
  )
}

export default IconFont

/**
 * 使用示例：
 * 
 * // 基本使用
 * <IconFont type="caidan" />
 * 
 * // 带样式
 * <IconFont 
 *   type="blog" 
 *   className="text-lg hover:scale-105 transform duration-200" 
 * />
 * 
 * // 替换FontAwesome
 * // 原来：<i className='fas fa-bars' />
 * // 现在：<IconFont type="caidan" className="fas fa-bars的其他样式" />
 */
