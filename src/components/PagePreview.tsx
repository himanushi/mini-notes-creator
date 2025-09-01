import React from 'react'
import { NotebookConfig } from '../types'

interface Props {
  config: NotebookConfig
}

const PagePreview: React.FC<Props> = ({ config }) => {
  const mmToPx = (mm: number) => mm * 3.7795275591
  
  const renderPage = (pageNumber: number) => {
    const isEvenPage = pageNumber % 2 === 0
    const isRightSide = (pageNumber - 1) % 4 >= 2

    const pageContent = () => {
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
      <div className="a6-page">
        {pageContent()}
        {config.showPageNumbers && (
          <div className={`page-number ${isRightSide ? 'right' : 'left'}`}>
            {pageNumber}
          </div>
        )}
      </div>
    )
  }

  const totalPages = config.pageCount
  const sheetsNeeded = Math.ceil(totalPages / 4)
  const currentSheet = 1
  const startPage = (currentSheet - 1) * 4 + 1
  
  return (
    <div className="page-preview">
      <h2>プレビュー</h2>
      <div className="preview-info">
        <p>A4用紙 {currentSheet} / {sheetsNeeded} 枚目</p>
        <p>ページ {startPage}-{Math.min(startPage + 3, totalPages)} / {totalPages}</p>
      </div>
      <div className="a4-sheet">
        <div className="a4-page-grid">
          {[0, 1, 2, 3].map(index => {
            const pageNum = startPage + index
            if (pageNum > totalPages) return <div key={index} className="a6-placeholder"></div>
            return (
              <div key={index} className="a6-container">
                {renderPage(pageNum)}
              </div>
            )
          })}
        </div>
      </div>
      <div className="print-instructions">
        <h3>印刷手順</h3>
        <ol>
          <li>A4用紙に印刷（実際のサイズ 100%）</li>
          <li>表面: ページ {startPage}, {startPage + 1}, {startPage + 2}, {startPage + 3}</li>
          <li>裏面印刷時は用紙を短辺で裏返し</li>
          <li>中央で切って重ねて製本</li>
        </ol>
      </div>
    </div>
  )
}

export default PagePreview