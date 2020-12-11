$(function () {
    alert("V1.4.3")
    startScanner();
});

function sendRequest(code) {
    var paramdata = {"JAN":code};
    jQuery.ajax({
    type: 'GET',
    url: 'https://script.google.com/macros/s/AKfycbxMxAWI0zTAV_GIvk1V2_9YKqdWeqcTsJG_QoemwYawhW6ybstJw5aB/exec?',
    data: paramdata,
    dataType: 'text',
    crossDomain: true,
    success: function(e){displayData(e)},
    error: function(){ajaxerror()}
    });
}

function displayData(data) {
    alert(data);
    arrayd=data.split(',');
    alert("部門:"+arrayd[0]+"\nJANコード:"+arrayd[1]+"\n商品名:"+arrayd[2]+"\n台番:"+arrayd[6]+"\n列:"+arrayd[7]+"\n行:"+arrayd[8]);
    startScanner();
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
                "ean_reader",
                "ean_8_reader"
            ]
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

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