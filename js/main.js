$(function () {

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

    //barcode read call back
    const calc = isbn => {
        var arrIsbn = isbn
          .toString()
          .split("")
          .map(num => parseInt(num));
        var remainder = 0;
        var checkDigit = arrIsbn.pop();
      
        arrIsbn.forEach((num, index) => {
          remainder += num * (index % 2 === 0 ? 1 : 3);
        });
        remainder %= 10;
        remainder = remainder === 0 ? 0 : 10 - remainder;
      
        return checkDigit === remainder;
      }
      
    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        if(calc(code)){
            Quagga.pause();
            alert(code);
            setTimeout("Quagga.start()",5000)
        }
    });
}