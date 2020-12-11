Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#interactive'),//埋め込んだdivのID
      constraints: {
        facingMode: 'environment',
      },
      area: {//必要ならバーコードの読み取り範囲を調整できる（この場合は、上30%/下30%は読み取りしない）
        top: "30%",
        right: "0%",
        left: "0%",
        bottom: "30%"
      },
    },
    locator: {
      patchSize: 'medium',
      halfSample: true,
    },
    numOfWorkers: 2,
    decoder: {
      readers: ['ean_reader']//ISBNは基本的にこれ（他にも種類あり）
    },
    locate: false,
  }, (err) => {
    if(!err) {
      Quagga.start();
      // alert("started");
    }
  })
  
  Quagga.onDetected(success => {
    const code = success.codeResult.code;
    if(calc(code)) alert(code);
  })
  
  const calc = isbn => {
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