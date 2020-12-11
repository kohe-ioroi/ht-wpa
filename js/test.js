function sendRequest() {
    jQuery.ajax({
    type: 'GET',
    url: 'https://script.google.com/macros/s/AKfycbxMxAWI0zTAV_GIvk1V2_9YKqdWeqcTsJG_QoemwYawhW6ybstJw5aB/exec?',
    data: {
    JAN:49153675
    },
    dataType: 'text',
    crossDomain: true,
    success: function(data){displayData(data);}
    });
    }
    
function displayData(data) {
    array=data.csvString.split(',');
    }
sendRequest();