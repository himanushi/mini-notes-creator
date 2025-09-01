import React from 'react'
import { NotebookConfig } from '../types'

interface Props {
  config: NotebookConfig
}

const PagePreview: React.FC<Props> = ({ config }) => {
  const renderPage = () => {
    const mmToPx = (mm: number) => mm * 3.7795275591

    if (config.pageType === 'blank') {
      return <div className="page-content blank"></div>
    }

    if (config.pageType === 'grid') {
      const gridSizePx = mmToPx(config.gridSize)
      return (
        <div 
          className="page-content grid"
          style={{
            backgroundImage: `
              linear-gradient(${config.gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${config.gridColor} 1px, transparent 1px)
            `,
            backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
          }}
        ></div>
      )
    }

    if (config.pageType === 'ruled') {
      const lineSpacingPx = mmToPx(config.lineSpacing)
      return (
        <div 
          className="page-content ruled"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent ${lineSpacingPx - 1}px,
              ${config.lineColor} ${lineSpacingPx - 1}px,
              ${config.lineColor} ${lineSpacingPx}px
            )`,
          }}
        ></div>
      )
    }

    return null
  }

  return (
    <div className="page-preview">
      <h2>プレビュー</h2>
      <div className="preview-container">
        <div className="a6-page">
          {renderPage()}
          {config.showPageNumbers && (
            <div className="page-number">1</div>
          )}
        </div>
      </div>
      <p className="preview-info">A6サイズ (105mm × 148mm)</p>
    </div>
  )
}

export default PagePreview