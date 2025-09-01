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
    const isRightSide = config.bindingDirection === 'left' 
      ? (pageNumber - 1) % 4 >= 2
      : (pageNumber - 1) % 4 < 2

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
        
        // SVGパターンで線の種類を表現
        const strokeDashArray = config.gridStyle === 'dashed' ? '5,3' : config.gridStyle === 'dotted' ? '2,2' : 'none'
        const svgPattern = `data:image/svg+xml,${encodeURIComponent(`
          <svg width="${gridSizePx}" height="${gridSizePx}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="${gridSizePx}" height="${gridSizePx}" patternUnits="userSpaceOnUse">
                <path d="M ${gridSizePx} 0 L 0 0 0 ${gridSizePx}" 
                      fill="none" 
                      stroke="${config.gridColor}" 
                      stroke-width="${config.gridThickness}"
                      stroke-dasharray="${strokeDashArray}"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        `)}`
        
        return (
          <div 
            className="page-content grid"
            style={{
              backgroundImage: `url("${svgPattern}")`,
              backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
              backgroundPosition: `${offsetX}px ${offsetY}px`,
              '--grid-size-mm': `${config.gridSize}mm`,
              '--grid-thickness': `${config.gridThickness}px`,
              '--grid-style': config.gridStyle,
            } as React.CSSProperties}
          ></div>
        )
      }

      if (config.pageType === 'ruled') {
        const lineSpacingPx = mmToPx(config.lineSpacing)
        
        // SVGパターンで罫線の種類を表現
        const strokeDashArray = config.lineStyle === 'dashed' ? '8,4' : config.lineStyle === 'dotted' ? '2,3' : 'none'
        const svgPattern = `data:image/svg+xml,${encodeURIComponent(`
          <svg width="100%" height="${lineSpacingPx}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="${lineSpacingPx}" x2="100%" y2="${lineSpacingPx}" 
                  stroke="${config.lineColor}" 
                  stroke-width="${config.lineThickness}"
                  stroke-dasharray="${strokeDashArray}"/>
          </svg>
        `)}`
        
        return (
          <div 
            className="page-content ruled"
            style={{
              backgroundImage: `url("${svgPattern}")`,
              backgroundRepeat: 'repeat-y',
              backgroundSize: `100% ${lineSpacingPx}px`,
              paddingTop: '40px',
              '--line-spacing-mm': `${config.lineSpacing}mm`,
              '--line-color': config.lineColor,
              '--line-thickness': `${config.lineThickness}px`,
              '--line-style': config.lineStyle,
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
          <div className={`page-number ${
            config.bindingDirection === 'left'
              ? (pageNumber % 2 === 0 ? 'left' : 'right')
              : (pageNumber % 2 === 0 ? 'right' : 'left')
          }`}>
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
          <li>A4用紙に両面印刷（実際のサイズ 100%）</li>
          <li>表面: ページ {startPage}, {startPage + 1}, {startPage + 2}, {startPage + 3}</li>
          <li><strong>短辺綴じ</strong>で両面印刷（用紙を短辺で裏返し）</li>
          <li>中央で縦に切断して2枚のA6ページに分割</li>
          <li>ページ順に重ねて製本</li>
        </ol>
        <div className="print-note">
          <p><strong>注意:</strong> プリンターの設定で「短辺綴じ（Short Edge Binding）」を選択してください。長辺綴じだと裏面が逆さまになります。</p>
        </div>
      </div>
    </div>
  )
}

export default PagePreview