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
      const a4Sheet = previewRef.current.querySelector('.a4-sheet') as HTMLElement
      if (!a4Sheet) return
      
      const canvas = await html2canvas(a4Sheet, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210
      const imgHeight = 297
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      
      const totalPages = config.pageCount
      const sheetsNeeded = Math.ceil(totalPages / 4)
      
      for (let sheet = 2; sheet <= sheetsNeeded; sheet++) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      }
      
      pdf.save(`mini-notes-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF生成エラー:', error)
      alert('PDF生成中にエラーが発生しました')
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