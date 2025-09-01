export type PageType = 'blank' | 'grid' | 'ruled'
export type BindingDirection = 'left' | 'right'
export type LineStyle = 'solid' | 'dashed' | 'dotted'

export interface NotebookConfig {
  pageType: PageType
  pageCount: number
  showPageNumbers: boolean
  showIndex: boolean
  showCover: boolean
  bindingDirection: BindingDirection
  gridColor: string
  gridSize: number
  gridThickness: number
  gridStyle: LineStyle
  lineColor: string
  lineSpacing: number
  lineThickness: number
  lineStyle: LineStyle
  calendar: {
    year: number
    showYearly: boolean
    showMonthly: boolean
    showWeekly: boolean
  }
  kanjiPractice: {
    enabled: boolean
    characters: string[]
  }
  images: ImageConfig[]
  printAdjustment: {
    horizontalOffset: number
    verticalOffset: number
  }
}

export interface ImageConfig {
  pageNumber: number
  url?: string
  file?: File
  position: 'center' | 'fill'
}

export interface PageContent {
  pageNumber: number
  type: 'normal' | 'calendar' | 'kanji' | 'image'
  content?: any
}