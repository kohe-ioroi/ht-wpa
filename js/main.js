$(function () {
    alert("V1.3.2")
    startScanner();
});
function sendRequest(e) {
    jQuery.ajax({
    type: 'GET',
    url: 'https://script.google.com/macros/s/AKfycbxMxAWI0zTAV_GIvk1V2_9YKqdWeqcTsJG_QoemwYawhW6ybstJw5aB/exec?',
    data: {
    'JAN':e
    },
    dataType: 'text',
    crossDomain: true,
    }.then(function(data){displayData(data);},ajaxerror())
    );
    }
    
function displayData(data) {
    alert(str(data));
    array=data.csvString.split(',');
    alert("部門:"+array[0]+"JANコード:"+array[1]+"商品名:"+array[2]+"台番:"+array[6]+"列:"+array[7]+"行:"+array[8])
    startScanner()
    }
function ajaxerror(){
    alert("opps!");
    startScanner();
}
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
        sendRequest(code);        
    });
}