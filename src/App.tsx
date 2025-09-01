import React, { useState } from 'react'
import './App.css'
import NotebookSettings from './components/NotebookSettings'
import PagePreview from './components/PagePreview'
import { NotebookConfig, PageType } from './types'

const App: React.FC = () => {
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

  const handleExportPDF = () => {
    console.log('PDF エクスポート準備中...')
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
        
        <div className="preview-panel">
          <PagePreview config={config} />
        </div>
      </main>
    </div>
  )
}

export default App