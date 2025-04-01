'use client'

export const startCamera = (videoID: string): Promise<boolean>  => {
    return new Promise(resolve => {
        navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 1920 },  // Intenta obtener Full HD
            height: { ideal: 1080 },
            facingMode: "environment", // Usa la cámara trasera si está disponible
            frameRate: { ideal: 60 }, // Intenta obtener la mejor tasa de FPS
        },
        audio: false,
        })
        .then((stream) => {
        const video = document.querySelector(`#${videoID}`) as HTMLVideoElement | null
        if (video) {
            video.srcObject = stream;
            video.play()
            resolve(true)
        }
        })
        .catch((err) => {
        console.error("Error al acceder a la cámara: ", err)
        resolve(false)
        })
    })
}

export const stopCamera = (videoID: string): void  => {
    const video = document.querySelector(`#${videoID}`) as HTMLVideoElement | null
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      video.srcObject = null
    }
}