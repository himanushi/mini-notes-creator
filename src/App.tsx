import React, { useState, useRef } from 'react'
import './App.css'
import NotebookSettings from './components/NotebookSettings'
import PagePreview from './components/PagePreview'
import { NotebookConfig, PageType } from './types'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null)
  const [config, setConfig] = useState<NotebookConfig>({
    pageType: 'blank',
    pageCount: 50,
    showPageNumbers: true,
    showIndex: true,
    showCover: true,
    bindingDirection: 'left',
    gridColor: '#cccccc',
    gridSize: 5,
    gridThickness: 1,
    gridStyle: 'solid',
    lineColor: '#cccccc',
    lineSpacing: 7,
    lineThickness: 1,
    lineStyle: 'solid',
    calendar: {
      year: new Date().getFullYear(),
      showYearly: false,
      showMonthly: false,
      showWeekly: false,
    },
    kanjiPractice: {
      enabled: false,
      characters: [],
    },
    images: [],
    printAdjustment: {
      horizontalOffset: 0,
      verticalOffset: 0,
    },
  })

  const handleExportPDF = async () => {
    if (!previewRef.current) return
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const totalPages = config.pageCount
      const sheetsNeeded = Math.ceil(totalPages / 4)
      
      // 印刷用の一時的なコンテナを作成
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '794px' // A4幅 @ 96dpi
      tempContainer.style.height = '1123px' // A4高さ @ 96dpi
      document.body.appendChild(tempContainer)
      
      for (let sheet = 1; sheet <= sheetsNeeded; sheet++) {
        // 印刷用のページ配置を計算
        const pageIndices = getPrintPageLayout(sheet, totalPages)
        
        // 一時的なA4シートを作成
        const a4Sheet = document.createElement('div')
        a4Sheet.style.width = '794px'
        a4Sheet.style.height = '1123px'
        a4Sheet.style.backgroundColor = '#ffffff'
        a4Sheet.style.display = 'grid'
        a4Sheet.style.gridTemplateColumns = '1fr 1fr'
        a4Sheet.style.gridTemplateRows = '1fr 1fr'
        a4Sheet.style.padding = '20px'
        a4Sheet.style.boxSizing = 'border-box'
        a4Sheet.style.gap = '8px'
        
        // 4つのA6ページを配置
        pageIndices.forEach((pageNum, index) => {
          const pageDiv = document.createElement('div')
          pageDiv.style.width = '100%'
          pageDiv.style.height = '100%'
          pageDiv.style.border = '1px solid #ddd'
          pageDiv.style.backgroundColor = '#fff'
          pageDiv.style.position = 'relative'
          pageDiv.style.overflow = 'hidden'
          pageDiv.style.boxSizing = 'border-box'
          
          if (pageNum > 0 && pageNum <= totalPages) {
            // ページ内容を生成
            const contentDiv = document.createElement('div')
            contentDiv.style.width = '100%'
            contentDiv.style.height = '100%'
            
            // ページタイプに応じたスタイルを適用
            if (config.pageType === 'grid') {
              const gridSize = config.gridSize * 3.59
              // SVGパターンで方眼の線種を表現
              const strokeDashArray = config.gridStyle === 'dashed' ? '5,3' : config.gridStyle === 'dotted' ? '2,2' : 'none'
              const svgPattern = `data:image/svg+xml,${encodeURIComponent(`
                <svg width="${gridSize}" height="${gridSize}" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                      <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" 
                            fill="none" 
                            stroke="${config.gridColor}" 
                            stroke-width="${config.gridThickness}"
                            stroke-dasharray="${strokeDashArray}"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              `)}`
              contentDiv.style.backgroundImage = `url("${svgPattern}")`
              contentDiv.style.backgroundSize = `${gridSize}px ${gridSize}px`
            } else if (config.pageType === 'ruled') {
              const lineSpacing = config.lineSpacing * 3.59
              // SVGパターンで罫線の線種を表現
              const strokeDashArray = config.lineStyle === 'dashed' ? '8,4' : config.lineStyle === 'dotted' ? '2,3' : 'none'
              const svgPattern = `data:image/svg+xml,${encodeURIComponent(`
                <svg width="100%" height="${lineSpacing}" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="${lineSpacing}" x2="100%" y2="${lineSpacing}" 
                        stroke="${config.lineColor}" 
                        stroke-width="${config.lineThickness}"
                        stroke-dasharray="${strokeDashArray}"/>
                </svg>
              `)}`
              contentDiv.style.backgroundImage = `url("${svgPattern}")`
              contentDiv.style.backgroundRepeat = 'repeat-y'
              contentDiv.style.backgroundSize = `100% ${lineSpacing}px`
              contentDiv.style.paddingTop = '40px'
            }
            
            pageDiv.appendChild(contentDiv)
            
            // ページ番号を追加
            if (config.showPageNumbers) {
              const pageNumberDiv = document.createElement('div')
              pageNumberDiv.textContent = String(pageNum)
              pageNumberDiv.style.position = 'absolute'
              pageNumberDiv.style.bottom = '10px'
              pageNumberDiv.style.fontSize = '14px'
              pageNumberDiv.style.color = '#666'
              pageNumberDiv.style.fontFamily = 'sans-serif'
              
              // ページ番号の位置を決定（綴じ方向に基づく）
              if (config.bindingDirection === 'left') {
                // 左綴じ: 偶数ページは左下、奇数ページは右下
                if (pageNum % 2 === 0) {
                  pageNumberDiv.style.left = '10px'
                } else {
                  pageNumberDiv.style.right = '10px'
                }
              } else {
                // 右綴じ: 偶数ページは右下、奇数ページは左下
                if (pageNum % 2 === 0) {
                  pageNumberDiv.style.right = '10px'
                } else {
                  pageNumberDiv.style.left = '10px'
                }
              }
              
              pageDiv.appendChild(pageNumberDiv)
            }
          }
          
          a4Sheet.appendChild(pageDiv)
        })
        
        tempContainer.appendChild(a4Sheet)
        
        // HTML2Canvasでキャプチャ
        const canvas = await html2canvas(a4Sheet, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        
        if (sheet > 1) {
          pdf.addPage()
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
        
        // 一時的な要素をクリーンアップ
        tempContainer.removeChild(a4Sheet)
      }
      
      // 一時的なコンテナを削除
      document.body.removeChild(tempContainer)
      
      pdf.save(`mini-notes-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF生成エラー:', error)
      alert('PDF生成中にエラーが発生しました')
    }
  }
  
  // 印刷用のページレイアウトを計算する関数
  const getPrintPageLayout = (sheetNumber: number, totalPages: number): number[] => {
    // 製本時の正しいページ配置
    // A4用紙1枚に4つのA6ページ (2x2配置)
    // 中央で切って重ねることを考慮
    
    const sheetsNeeded = Math.ceil(totalPages / 4)
    const baseIndex = (sheetNumber - 1) * 4
    
    if (config.bindingDirection === 'left') {
      // 左綴じの場合
      if (sheetNumber === 1) {
        return [
          totalPages,          // 左上: 最終ページ (例: 60)
          1,                   // 右上: 1ページ目
          2,                   // 左下: 2ページ目
          totalPages - 1 > 1 ? totalPages - 1 : 0  // 右下: 最終-1ページ (例: 59)
        ]
      }
      
      // 2枚目以降の計算
      const leftTop = totalPages - (sheetNumber - 1) * 2
      const rightTop = 1 + (sheetNumber - 1) * 2
      const leftBottom = rightTop + 1
      const rightBottom = leftTop - 1
      
      return [
        leftTop > 0 && leftTop <= totalPages ? leftTop : 0,
        rightTop > 0 && rightTop <= totalPages ? rightTop : 0,
        leftBottom > 0 && leftBottom <= totalPages ? leftBottom : 0,
        rightBottom > 0 && rightBottom <= totalPages ? rightBottom : 0
      ]
    } else {
      // 右綴じの場合（ページ配置を左右反転）
      if (sheetNumber === 1) {
        return [
          1,                   // 左上: 1ページ目
          totalPages,          // 右上: 最終ページ (例: 60)
          totalPages - 1 > 1 ? totalPages - 1 : 0,  // 左下: 最終-1ページ (例: 59)
          2                    // 右下: 2ページ目
        ]
      }
      
      // 2枚目以降の計算
      const leftTop = 1 + (sheetNumber - 1) * 2
      const rightTop = totalPages - (sheetNumber - 1) * 2
      const leftBottom = rightTop - 1
      const rightBottom = leftTop + 1
      
      return [
        leftTop > 0 && leftTop <= totalPages ? leftTop : 0,
        rightTop > 0 && rightTop <= totalPages ? rightTop : 0,
        leftBottom > 0 && leftBottom <= totalPages ? leftBottom : 0,
        rightBottom > 0 && rightBottom <= totalPages ? rightBottom : 0
      ]
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini Notes Creator</h1>
        <p>A6サイズのメモ帳をA4用紙に印刷して作成</p>
      </header>
      
      <main className="app-main">
        <div className="settings-panel">
          <NotebookSettings config={config} setConfig={setConfig} />
          <button className="export-button" onClick={handleExportPDF}>
            PDFをダウンロード
          </button>
        </div>
        
        <div className="preview-panel" ref={previewRef}>
          <PagePreview config={config} />
        </div>
      </main>
    </div>
  )
}

export default App