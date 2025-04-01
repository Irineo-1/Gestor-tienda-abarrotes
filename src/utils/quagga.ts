export const configQuagga = {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: "#lector", // Usa un selector correcto
      constraints: {
        width: 1920,
        height: 1080,
        facingMode: "environment", // Cámara trasera
      },
    },
    decoder: {
      readers: [
        "code_128_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "ean_reader",
        "ean_8_reader",
        "upc_reader"
      ],
      multiple: false,
    },
    numOfWorkers: 4,
    locate: true,
    frequency: 10,
    halfSample: false,
}