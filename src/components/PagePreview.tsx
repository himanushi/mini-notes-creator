import React, { useState } from 'react'
import { NotebookConfig } from '../types'

interface Props {
  config: NotebookConfig
}

const PagePreview: React.FC<Props> = ({ config }) => {
  // A4用紙での実際のA6サイズに合わせた変換率
  // A6: 105mm × 148mm
  // 画面表示用A6: 377px × 531px (余白なしで隣接)
  const mmToPx = (mm: number) => mm * (377 / 105) // 約3.59
  
  const [currentSheet, setCurrentSheet] = useState(1)
  
  const renderPage = (pageNumber: number) => {
    const isEvenPage = pageNumber % 2 === 0
    const isRightSide = (pageNumber - 1) % 4 >= 2

    const pageContent = () => {
      if (config.pageType === 'blank') {
        return <div className="page-content blank"></div>
      }

      if (config.pageType === 'grid') {
        const gridSizePx = mmToPx(config.gridSize)
        // ページ幅の中心を基準にした方眼の配置
        const pageWidthPx = 377
        const pageHeightPx = 531
        // 中央基準のオフセット計算
        const offsetX = (pageWidthPx / 2) % gridSizePx
        const offsetY = (pageHeightPx / 2) % gridSizePx
        
        return (
          <div 
            className="page-content grid"
            style={{
              backgroundImage: `
                linear-gradient(${config.gridColor} 1px, transparent 1px),
                linear-gradient(90deg, ${config.gridColor} 1px, transparent 1px)
              `,
              backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
              backgroundPosition: `${offsetX}px ${offsetY}px`,
              '--grid-size-mm': `${config.gridSize}mm`,
            } as React.CSSProperties}
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
              '--line-spacing-mm': `${config.lineSpacing}mm`,
              '--line-color': config.lineColor,
            } as React.CSSProperties}
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
  const startPage = (currentSheet - 1) * 4 + 1
  
  return (
    <div className="page-preview">
      <h2>プレビュー</h2>
      <div className="preview-info">
        <p>A4用紙 {currentSheet} / {sheetsNeeded} 枚目</p>
        <p>ページ {startPage}-{Math.min(startPage + 3, totalPages)} / {totalPages}</p>
      </div>
      <div className="sheet-navigation">
        <button 
          onClick={() => setCurrentSheet(prev => Math.max(1, prev - 1))}
          disabled={currentSheet === 1}
          className="nav-button"
        >
          ← 前のページ
        </button>
        <span className="sheet-indicator">
          {currentSheet} / {sheetsNeeded}
        </span>
        <button 
          onClick={() => setCurrentSheet(prev => Math.min(sheetsNeeded, prev + 1))}
          disabled={currentSheet === sheetsNeeded}
          className="nav-button"
        >
          次のページ →
        </button>
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