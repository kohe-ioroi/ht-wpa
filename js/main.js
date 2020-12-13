var scandata = [];
$(function () {
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
function sendRequest_input(){
    Quagga.offProcessed();
    Quagga.offDetected();
    Quagga.stop();
    showload();
    sendRequest(document.getElementById("jancode").value);
    document.getElementById("jancode").value = "";
}
function displayData(data) {
    arrayd=data.split(',');
    pbcheck="X";
    if(arrayd[4]){pbcheck="O"}
    alert("部門:"+arrayd[0]+"\nJANコード:"+arrayd[1]+"\n商品名:"+arrayd[2]+"\nPB判定:"+pbcheck+"\n台番:"+arrayd[5]+" 段:"+arrayd[6]+" 列:"+arrayd[7]);
    showmain();
    startScanner();
}
function ajaxerror(){
    alert("エラー！\nDBにデータが無いか、不正なコードです。\nもう一度読み取りして下さい。");
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
Array.prototype.mode = function () {
    if (this.length === 0){
        //配列の個数が0だとエラーを返す。
        throw new Error("配列の長さが0のため最頻値が計算できません");
        //nullを返しても困らない時(配列の中にnullが無い時)はnullを返すように実装しても良い。
        //return null
    }
    //回数を記録する連想配列
    var counter = {}
    //本来の値を入れた辞書
    var nativeValues = {}

    //最頻値とその出現回数を挿入する変数
    var maxCounter = 0;
    var maxValue = null;

    for (var i = 0; i < this.length; i++) {
        //counterに存在しなければ作る。keyは型を区別する
        if (!counter[this[i] + "_" + typeof this[i]]) {
            counter[this[i] + "_" + typeof this[i]] = 0;
        }
        counter[this[i] + "_" + typeof this[i]]++;
        nativeValues[this[i] + "_" + typeof this[i]] = this[i];

    }
    for (var j = 0; j < Object.keys(counter).length; j++) {
        key = Object.keys(counter)[j];
        if (counter[key] > maxCounter) {
            maxCounter = counter[key];
            maxValue = nativeValues[key]
        }
    }
    return maxValue

}
function startScanner() {
    scandata = []
    document.getElementById("scanprogress").value=scandata.length;
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#photo-area'),
            constraints: {
                decodeBarCodeRate: 5,
                successTimeout: 500,
                codeRepetition: true,
                tryVertical: true,
                frameRate: 15,
                width: 600,
                height: 600,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "ean_reader",
            ]
        },
        locator:{
            halfSample: true,
            patchSize: "medium",
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {});

    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        if (scandata.length < 15){
            scandata.push(code);
            document.getElementById("scanprogress").value=scandata.length;
        }
        else{
            document.getElementById("scanprogress").value=scandata.length;
            Quagga.offProcessed();
            Quagga.offDetected();
            Quagga.stop();
            showload();
            sendRequest(scandata.mode());
        };
    });
}