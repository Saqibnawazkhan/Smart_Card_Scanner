import Tesseract from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number
}

let worker: Tesseract.Worker | null = null

async function getWorker(): Promise<Tesseract.Worker> {
  if (!worker) {
    worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })
  }
  return worker
}

export async function processImage(imageBase64: string): Promise<OCRResult> {
  const tesseractWorker = await getWorker()

  const result = await tesseractWorker.recognize(imageBase64)

  return {
    text: result.data.text,
    confidence: result.data.confidence / 100, // Convert to 0-1 scale
  }
}

export function extractTextFromResponse(response: OCRResult): string {
  return response.text
}

// Cleanup function to terminate worker when needed
export async function terminateOCR(): Promise<void> {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}
