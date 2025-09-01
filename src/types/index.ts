export type PageType = 'blank' | 'grid' | 'ruled'
export type BindingDirection = 'left' | 'right'

export interface NotebookConfig {
  pageType: PageType
  pageCount: number
  showPageNumbers: boolean
  showIndex: boolean
  showCover: boolean
  bindingDirection: BindingDirection
  gridColor: string
  gridSize: number
  lineColor: string
  lineSpacing: number
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