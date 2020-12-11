const { Quagga } = require("./quagga.min");

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
        Quagga.stop();
        var code = result.codeResult.code;
        if(calc(code)) alert(code);
        Quagga.start();
        
    });
}