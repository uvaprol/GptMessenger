const OPENAI_API_KEY = "";//your ApiKey


class CreateMessage {
    constructor(name = 'UserName', text = NaN) {
        this.name = name
        this.text = text
        this.chat = document.getElementById('chat')
        this.message = document.createElement('div');

        this.areaName = document.createElement('h1')
        this.areaText = document.createElement('p')

        this.message.classList.add('message')
        this.areaName.classList.add('name');
        this.areaText.classList.add('text')

        this.areaName.textContent = this.name
        this.areaText.textContent = this.text

        this.message.appendChild(this.areaName)
        this.message.appendChild(this.areaText)
        this.chat.appendChild(this.message)

    }
}

function Send() {

    var sQuestion = txtMsg.value;
    if (sQuestion == "") {
        txtMsg.style.background = "#e92f32a5"
        setTimeout(() => { txtMsg.style.background = "#6767671a" }, 500)
        txtMsg.focus();
        return;
    }

    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {
            var oJson = {}
            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                alert("Error: " + ex.message)
            }

            if (oJson.error && oJson.error.message) {
                alert("Error: " + oJson.error.message)
            } else if (oJson.choices && oJson.choices[0].text) {
                var s = oJson.choices[0].text;

                
                var a = s.split("?\n");
                if (a.length == 2) {
                    s = a[1];
               }
            

                if (s == "") s = "No response";
                new CreateMessage('ChatGpt', s)
                txtMsg.disabled = false
                txtMsg.placeholder = 'Введите запрос'
                chat.scrollTo(0, chat.scrollHeight)
            }            
        }
    };

    var sModel = "text-davinci-003";
    var iMaxTokens = 2048;
    var sUserId = "1";
    var dTemperature = 0.5;    

    var data = {
        model: sModel,
        prompt: sQuestion,
        max_tokens: iMaxTokens,
        user: sUserId,
        temperature:  dTemperature,
        frequency_penalty: 0.0, //Number between -2.0 and 2.0  
                                //Positive values decrease the model's likelihood 
                                //to repeat the same line verbatim.
        presence_penalty: 0.0,  //Number between -2.0 and 2.0. 
                                //Positive values increase the model's likelihood 
                                //to talk about new topics.
        stop: ["#", ";"]        //Up to 4 sequences where the API will stop 
                                //generating further tokens. The returned text 
                                //will not contain the stop sequence.
    }

    oHttp.send(JSON.stringify(data));

    new CreateMessage('you', sQuestion)
    txtMsg.value = "";
    txtMsg.disabled = true
    txtMsg.placeholder = 'Ждите ответа...'
    chat.scrollTo(0, chat.scrollHeight)
    
}

document.addEventListener('keypress', function (e) {
    txtMsg.focus()
    if (e.key === 'Enter') {
        Send()
    }
});






