$(function () {
    alert("V1.5.1")
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
    arrayd=data.split(',');
    alert("部門:"+arrayd[0]+"\nJANコード:"+arrayd[1]+"\n商品名:"+arrayd[2]+"\n台番:"+arrayd[6]+"\n列:"+arrayd[7]+"\n行:"+arrayd[8]);
    showmain();
    startScanner();
}

function ajaxerror(){
    alert("エラー！DBに無いか、接続エラーです。");
    showmain();
    startScanner();
}
function showload(){
    $("#main").fadeOut();
    $("#load").fadeIn();
}
function showmain(){
    $("#load").fadeOut();
    $("#main").fadeIn();
}
function calc(isbn) {
    const arrIsbn = isbn
        .toString()
        .split("")
        .map(num => parseInt(num));
    let remainder = 0;
    const checkDigit = arrIsbn.pop();

    arrIsbn.forEach((num, index) => {
        remainder += num * (index % 2 === 0 ? 1 : 3);
    });
    remainder %= 10;
    remainder = remainder === 0 ? 0 : 10 - remainder;

    return checkDigit === remainder;
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
                width: 640,
                height: 480,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "ean_reader",
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

    Quagga.onProcessed(function (result) {});

    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        if(calc(code)) {
        showload();
        Quagga.offProcessed(); 
        Quagga.offDetected(); 
        Quagga.stop();
        sendRequest(code);
        };
    });
};