let input, file, fr, doc, parser;
let loaded = false; //`loaded` prevents spamming site with same file on multiclick

function enableUpload() {
    loaded = false;
}

function loadFile() {
    if(loaded) return;
    loaded = true;

    if (typeof window.FileReader !== 'function') {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = showMessages;
        fr.readAsText(file);
    }

}

if (typeof (DOMParser) == 'undefined') {
    DOMParser = function () { }
    DOMParser.prototype.parseFromString = function (str, contentType) {
        if (typeof (ActiveXObject) != 'undefined') {
            let xmldata = new ActiveXObject('MSXML.DomDocument');
            xmldata.async = false;
            xmldata.loadXML(str);
            return xmldata;
        } else if (typeof (XMLHttpRequest) != 'undefined') {
            let xmldata = new XMLHttpRequest;
            if (!contentType) {
                contentType = 'application/xml';
            }
            xmldata.open('GET', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(str), false);
            if (xmldata.overrideMimeType) {
                xmldata.overrideMimeType(contentType);
            }
            xmldata.send(null);
            return xmldata.responseXML;
        }
    }
}

let xmlString = "<root><thing attr='val'/></root>";
parser = new DOMParser();
doc = parser.parseFromString(xmlString, "text/xml");

function showMessages() {
    doc = parser.parseFromString(fr.result, "text/xml");
    
    let currentElement = doc['childNodes'][2]['firstElementChild'];
    let messages = [];

    while (currentElement != null) {
        let messageType = currentElement.tagName;

        switch(messageType) {
            case "sms":
                let sms = new SMS(currentElement);
                messages.push(sms.getMessage());
                break;

            case "mms":
                let mms = new MMS(currentElement);
                messages.push(mms.getMessage());
                break;
        }

        currentElement = currentElement['nextElementSibling'];
    }

    messages.sort(function(x, y){
        let add0 = x[0]["nodeValue"];
        let add1 = x[0]["nodeValue"];
        if(add0 != add1) {
            return add0 - add1;
        }
            
        return x[1]["nodeValue"] - y[1]["nodeValue"];
    });

    let container = document.getElementById("container");
    messages.forEach(function(message) {
        let hr = document.createElement("hr");
        document.getElementById("container").appendChild(hr);

        container.appendChild(message[2]);
    });
}