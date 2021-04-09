class Message {
    constructor (message) {
        this.attributes = message["attributes"];
        this.messageContainer = document.createElement("div");
    }

    //check if it was received, sent, drafter or etc
    getMessageType() {
        let data = this.attributes["type"];
        if(data === undefined) { //mms contain type data in other field
            data = this.attributes["msg_box"];
        }

        switch(data["nodeValue"]) { //mms have only 1-4 type
            case "1":
                return "received";
                break;
            case "2":
                return "sent";
                break;
            case "3":
                return "draft";
                break;
            case "4":
                return "outbox";
                break;
            case "5":
                return "failed";
                break;
            case "6":
                return "queued";
                break;
        }
    }

    displayInfo() { //display date + received/sent
        this.messageContainer.className = "messageContainer";
        this.timestamp = this.attributes["date"];
        const address = this.attributes["address"];
        const contactName = this.attributes["contact_name"];
        this.address = address;
        
        //display address
        let addressDiv = document.createElement("div");
        addressDiv.className = "address";
        addressDiv.innerHTML = address["nodeValue"];
        this.messageContainer.appendChild(addressDiv);

        //display contact name if avaliable
        if(contactName !== undefined && contactName["nodeValue"] !== '(Unknown)') {
            let contactNameDiv = document.createElement("div");
            contactNameDiv.className = "contactName";
            contactNameDiv.innerHTML = contactName["nodeValue"];
            this.messageContainer.appendChild(contactNameDiv);
        }
        
        //display message type (sent, received etc)
        const messageType = this.getMessageType();
        let messageTypeNode = document.createElement("div");
        messageTypeNode.className = "messageType";
        messageTypeNode.innerHTML = messageType;
        this.messageContainer.className += (' '+messageType); 
        this.messageContainer.appendChild(messageTypeNode);

        //display time
        const readableDate = this.attributes["readable_date"];

        if(typeof readableDate !== 'undefined') { //not every message part has a timestamp
            let dateDiv = document.createElement("div");
            dateDiv.className = "messageDate";
            dateDiv.innerHTML = readableDate["nodeValue"];
            this.messageContainer.appendChild(dateDiv); 
        }
    }

    getMessage() {
        this.displayInfo();
        //document.getElementById("container").appendChild(this.messageContainer);
        return [this.address, this.timestamp, this.messageContainer];
    }
}