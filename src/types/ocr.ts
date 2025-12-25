export interface ExtractedField {
  value: string
  confidence: number
  rawText?: string
}

export interface ExtractedContact {
  name: ExtractedField
  company: ExtractedField
  phone: ExtractedField
  email: ExtractedField
  address: ExtractedField
  website: ExtractedField
}

export interface VisionAPIResponse {
  responses: VisionResponse[]
}

export interface VisionResponse {
  textAnnotations?: TextAnnotation[]
  fullTextAnnotation?: FullTextAnnotation
  error?: APIError
}

export interface TextAnnotation {
  description: string
  boundingPoly: BoundingPoly
  locale?: string
}

export interface FullTextAnnotation {
  text: string
  pages: Page[]
}

export interface Page {
  width: number
  height: number
  blocks: Block[]
}

export interface Block {
  boundingBox: BoundingPoly
  paragraphs: Paragraph[]
  blockType: string
}

export interface Paragraph {
  boundingBox: BoundingPoly
  words: Word[]
}

export interface Word {
  boundingBox: BoundingPoly
  symbols: Symbol[]
}

export interface Symbol {
  boundingBox: BoundingPoly
  text: string
  confidence: number
}

export interface BoundingPoly {
  vertices: Vertex[]
}

export interface Vertex {
  x: number
  y: number
}

export interface APIError {
  code: number
  message: string
  status: string
}

export type ScannerStep = 'idle' | 'capturing' | 'processing' | 'review' | 'saving'
