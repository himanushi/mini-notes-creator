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
    gridColor: '#cccccc',
    gridSize: 5,
    lineColor: '#cccccc',
    lineSpacing: 7,
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
      tempContainer.style.width = '794px' // A4幅
      tempContainer.style.height = '1123px' // A4高さ
      document.body.appendChild(tempContainer)
      
      for (let sheet = 1; sheet <= sheetsNeeded; sheet++) {
        // 印刷用のページ配置を計算
        const pageIndices = getPrintPageLayout(sheet, totalPages)
        
        // 一時的なA4シートを作成
        const a4Sheet = document.createElement('div')
        a4Sheet.className = 'a4-sheet'
        a4Sheet.style.width = '794px'
        a4Sheet.style.height = '1123px'
        a4Sheet.style.backgroundColor = '#ffffff'
        a4Sheet.style.display = 'flex'
        a4Sheet.style.flexWrap = 'wrap'
        a4Sheet.style.alignContent = 'center'
        a4Sheet.style.justifyContent = 'center'
        
        // 4つのA6ページを配置
        pageIndices.forEach((pageNum, index) => {
          const pageDiv = document.createElement('div')
          pageDiv.style.width = '377px'
          pageDiv.style.height = '531px'
          pageDiv.style.border = '1px solid #ddd'
          pageDiv.style.backgroundColor = '#fff'
          pageDiv.style.position = 'relative'
          pageDiv.style.overflow = 'hidden'
          
          if (pageNum > 0 && pageNum <= totalPages) {
            // ページ内容を生成
            const contentDiv = document.createElement('div')
            contentDiv.style.width = '100%'
            contentDiv.style.height = '100%'
            
            // ページタイプに応じたスタイルを適用
            if (config.pageType === 'grid') {
              const gridSize = config.gridSize * 3.59
              contentDiv.style.backgroundImage = `
                linear-gradient(${config.gridColor} 1px, transparent 1px),
                linear-gradient(90deg, ${config.gridColor} 1px, transparent 1px)
              `
              contentDiv.style.backgroundSize = `${gridSize}px ${gridSize}px`
            } else if (config.pageType === 'ruled') {
              const lineSpacing = config.lineSpacing * 3.59
              contentDiv.style.backgroundImage = `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent ${lineSpacing - 1}px,
                ${config.lineColor} ${lineSpacing - 1}px,
                ${config.lineColor} ${lineSpacing}px
              )`
            }
            
            pageDiv.appendChild(contentDiv)
            
            // ページ番号を追加
            if (config.showPageNumbers) {
              const pageNumberDiv = document.createElement('div')
              pageNumberDiv.textContent = String(pageNum)
              pageNumberDiv.style.position = 'absolute'
              pageNumberDiv.style.bottom = '10px'
              pageNumberDiv.style.fontSize = '12px'
              pageNumberDiv.style.color = '#666'
              
              // ページ番号の位置を決定
              const isRightSide = (pageNum - 1) % 4 >= 2
              if (isRightSide) {
                pageNumberDiv.style.right = '10px'
              } else {
                pageNumberDiv.style.left = '10px'
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
    
    // シンプルなページ配置: A4の1枚目は1,60,2,59など
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
    
    // ページ範囲チェック
    return [
      leftTop > 0 && leftTop <= totalPages ? leftTop : 0,
      rightTop > 0 && rightTop <= totalPages ? rightTop : 0,
      leftBottom > 0 && leftBottom <= totalPages ? leftBottom : 0,
      rightBottom > 0 && rightBottom <= totalPages ? rightBottom : 0
    ]
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