import React from 'react'
import { NotebookConfig, PageType } from '../types'

interface Props {
  config: NotebookConfig
  setConfig: React.Dispatch<React.SetStateAction<NotebookConfig>>
}

const NotebookSettings: React.FC<Props> = ({ config, setConfig }) => {
  const handlePageTypeChange = (type: PageType) => {
    setConfig(prev => ({ ...prev, pageType: type }))
  }

  const handlePageCountChange = (count: number) => {
    setConfig(prev => ({ ...prev, pageCount: count }))
  }

  const handleToggle = (field: keyof NotebookConfig) => {
    setConfig(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleGridSizeChange = (size: number) => {
    setConfig(prev => ({ ...prev, gridSize: size }))
  }

  const handleLineSpacingChange = (spacing: number) => {
    setConfig(prev => ({ ...prev, lineSpacing: spacing }))
  }

  return (
    <div className="notebook-settings">
      <h2>ノート設定</h2>
      
      <div className="setting-group">
        <label>ページタイプ:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="blank"
              checked={config.pageType === 'blank'}
              onChange={() => handlePageTypeChange('blank')}
            />
            無地
          </label>
          <label>
            <input
              type="radio"
              value="grid"
              checked={config.pageType === 'grid'}
              onChange={() => handlePageTypeChange('grid')}
            />
            方眼
          </label>
          <label>
            <input
              type="radio"
              value="ruled"
              checked={config.pageType === 'ruled'}
              onChange={() => handlePageTypeChange('ruled')}
            />
            横罫線
          </label>
        </div>
      </div>

      <div className="setting-group">
        <label>
          ページ数:
          <input
            type="number"
            min="10"
            max="200"
            value={config.pageCount}
            onChange={(e) => handlePageCountChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={config.showPageNumbers}
            onChange={() => handleToggle('showPageNumbers')}
          />
          ページ番号を表示
        </label>
      </div>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={config.showIndex}
            onChange={() => handleToggle('showIndex')}
          />
          インデックスページ
        </label>
      </div>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={config.showCover}
            onChange={() => handleToggle('showCover')}
          />
          表紙を追加
        </label>
      </div>

      {config.pageType === 'grid' && (
        <div className="setting-group">
          <label>
            方眼サイズ (mm):
            <input
              type="number"
              min="3"
              max="10"
              value={config.gridSize}
              onChange={(e) => handleGridSizeChange(Number(e.target.value))}
            />
          </label>
          <label>
            方眼の色:
            <input
              type="color"
              value={config.gridColor}
              onChange={(e) => setConfig(prev => ({ ...prev, gridColor: e.target.value }))}
            />
          </label>
        </div>
      )}

      {config.pageType === 'ruled' && (
        <div className="setting-group">
          <label>
            行間隔 (mm):
            <input
              type="number"
              min="5"
              max="15"
              value={config.lineSpacing}
              onChange={(e) => handleLineSpacingChange(Number(e.target.value))}
            />
          </label>
          <label>
            罫線の色:
            <input
              type="color"
              value={config.lineColor}
              onChange={(e) => setConfig(prev => ({ ...prev, lineColor: e.target.value }))}
            />
          </label>
        </div>
      )}

      <div className="setting-group">
        <h3>カレンダー</h3>
        <label>
          <input
            type="checkbox"
            checked={config.calendar.showYearly}
            onChange={() => setConfig(prev => ({
              ...prev,
              calendar: { ...prev.calendar, showYearly: !prev.calendar.showYearly }
            }))}
          />
          年間カレンダー
        </label>
        <label>
          <input
            type="checkbox"
            checked={config.calendar.showMonthly}
            onChange={() => setConfig(prev => ({
              ...prev,
              calendar: { ...prev.calendar, showMonthly: !prev.calendar.showMonthly }
            }))}
          />
          月間カレンダー
        </label>
        <label>
          <input
            type="checkbox"
            checked={config.calendar.showWeekly}
            onChange={() => setConfig(prev => ({
              ...prev,
              calendar: { ...prev.calendar, showWeekly: !prev.calendar.showWeekly }
            }))}
          />
          週間カレンダー
        </label>
      </div>

      <div className="setting-group">
        <h3>印刷調整</h3>
        <label>
          横方向オフセット (mm):
          <input
            type="number"
            min="-10"
            max="10"
            step="0.5"
            value={config.printAdjustment.horizontalOffset}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              printAdjustment: { ...prev.printAdjustment, horizontalOffset: Number(e.target.value) }
            }))}
          />
        </label>
        <label>
          縦方向オフセット (mm):
          <input
            type="number"
            min="-10"
            max="10"
            step="0.5"
            value={config.printAdjustment.verticalOffset}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              printAdjustment: { ...prev.printAdjustment, verticalOffset: Number(e.target.value) }
            }))}
          />
        </label>
      </div>
    </div>
  )
}

export default NotebookSettings