$(function () {
    alert("V1.1.2")
    startScanner();
});
const startScanner = () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#photo-area'),
            constraints: {
                decodeBarCodeRate: 3,
                successTimeout: 500,
                codeRepetition: true,
                tryVertical: true,
                frameRate: 15,
                width: 1280,
                height: 720,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "ean_reader"
            ]
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "green",
                        lineWidth: 2
                    });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {
                    x: 'x',
                    y: 'y'
                }, drawingCtx, {
                    color: 'red',
                    lineWidth: 3
                });
            }
        }
    });

    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        Quagga.offProcessed(); 
        Quagga.offDetected(); 
        Quagga.stop();
        var url = "";
        fetch('https://script.google.com/macros/s/AKfycbxMxAWI0zTAV_GIvk1V2_9YKqdWeqcTsJG_QoemwYawhW6ybstJw5aB/exec?JAN='+code, {
        method: "GET",
        mode: "cors"
        })
        .then(response => {
        if (response.ok) {
          alert(response.json());
        }
        // 404 や 500 ステータスならここに到達する
        throw new Error('Network response was not ok.');
        })
        .then(resJson => {
        console.log(JSON.stringify(resJson));
        })
        .catch(error => {
        // ネットワークエラーの場合はここに到達する
        console.error(error);
        })
        setTimeout(startScanner(),1000);        
        });
}