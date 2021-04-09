class MMS extends SMS {
    constructor(message) {
        super(message);
        this.currentPart = message['firstElementChild']['firstElementChild'];
    }

    displayImage(imageType) {
        let image = document.createElement("img");
        image.src = ("data:image/" + imageType + ";base64," + this.attributes['data']['nodeValue']);
        image.setAttribute("name", this.attributes['cl']['nodeValue']);

        this.messageContainer.appendChild(image);
    }

    displayVideo(videoType) {
        //todo
    }

    getMessage() {
        this.displayInfo();
        
        while(this.currentPart != null) {
            this.attributes = this.currentPart['attributes'];
            let displayType = this.attributes['ct']['nodeValue'].split('/', 2);

            switch(displayType[0]) {
                case "text":
                    this.displayText();
                    break;

                case "image":
                    this.displayImage(displayType[1]);
                    break;

                case "video":
                    this.displayVideo(displayType[1]);
                    break;

                default:
                    break;
            }
            this.currentPart = this.currentPart['nextElementSibling'];
        }

        //document.getElementById("container").appendChild(this.messageContainer);
        return [this.address, this.timestamp, this.messageContainer];
    }
}