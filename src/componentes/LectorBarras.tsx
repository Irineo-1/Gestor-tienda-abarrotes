'use client'

import Quagga from 'quagga';
import Modal from '@/componentes/Modal';
import { configQuagga } from '@/utils/quagga';
import { startCamera, stopCamera } from '@/utils/camera';
import { useEffect } from 'react';
import { ScanResult } from "@/interfaces/Quagga"

type Props = {
    open: boolean
    setOpen: (estado: boolean) => void
    getCode: (code: string) => void
}

export default function LectorBarras({open, setOpen, getCode}: Props) {

    const closeLector = () => {
        Quagga.stop()
        stopCamera("lector")
        Quagga.offDetected()
    }

    useEffect(() => {
    
        if(!open) return stopCamera("lector")

        startCamera("lector").then(isActiveCamera => {
            
            if(!isActiveCamera) return setOpen(false)
    
            Quagga.init(
                configQuagga,
                function (err: string) {
                    if (err) {
                    console.error("Error en Quagga: ", err)
                    return
                    }
        
                    Quagga.start()
                }
            )

            Quagga.offDetected()

            Quagga.onDetected((result: ScanResult) => {
        
                const beep = document.querySelector("#sonidoLector") as HTMLAudioElement | null
        
                if(beep) beep.play()
                console.log("times to read")
                getCode(result.codeResult.code)
        
                setOpen(false)
                closeLector()
            })

            return () => closeLector()
        })
    
    }, [open])


    return (
        <Modal titulo='Escanear codigo de barras' open={open} setOpen={setOpen} persistent={true} handleCloseEmit={closeLector}>
            <video id="lector" autoPlay></video>
            <audio id="sonidoLector" src="/audio/LectorDeBarras.wav"></audio>
        </Modal>
    )
}