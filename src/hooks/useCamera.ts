import { useState, useCallback, useRef, useEffect } from 'react'

interface UseCameraOptions {
  facingMode?: 'user' | 'environment'
  width?: number
  height?: number
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  isActive: boolean
  isSupported: boolean
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  captureImage: () => string | null
  switchCamera: () => Promise<void>
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const { facingMode = 'environment', width = 1280, height = 720 } = options

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentFacingMode, setCurrentFacingMode] = useState(facingMode)

  const isSupported = typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices

  const startCamera = useCallback(async () => {
    if (!isSupported) {
      setError('Camera is not supported in this browser')
      return
    }

    try {
      setError(null)

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsActive(true)
      }
    } catch (err) {
      let message = 'Failed to access camera'

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          message = 'Camera access was denied. Please allow camera access and try again.'
        } else if (err.name === 'NotFoundError') {
          message = 'No camera found on this device'
        } else if (err.name === 'NotReadableError') {
          message = 'Camera is already in use by another application'
        } else {
          message = err.message
        }
      }

      setError(message)
      setIsActive(false)
    }
  }, [isSupported, currentFacingMode, width, height])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
  }, [])

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !isActive) {
      return null
    }

    const video = videoRef.current
    const canvas = document.createElement('canvas')

    // Use actual video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return null
    }

    ctx.drawImage(video, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.9)
  }, [isActive])

  const switchCamera = useCallback(async () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'
    setCurrentFacingMode(newFacingMode)

    if (isActive) {
      stopCamera()
      // Small delay before restarting with new facing mode
      await new Promise((resolve) => setTimeout(resolve, 100))
      await startCamera()
    }
  }, [currentFacingMode, isActive, stopCamera, startCamera])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    isActive,
    isSupported,
    error,
    startCamera,
    stopCamera,
    captureImage,
    switchCamera,
  }
}
