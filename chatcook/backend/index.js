const OpenAI = require('openai');

const openai = new OpenAI({
     //apiKey: "",
});

//express 설정
const express = require('express')
const app = express()

//CORS 문제 해결
const cors = require('cors')
app.use(cors())

//POST 요청 받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//POST 요청
app.post('/fortuneTell', async function (req, res) {

    //프론트엔드에서 보낸 메시지 출력
    let { userMessages, assistantMessages } = req.body
    console.log(userMessages);
    console.log(assistantMessages);

    let messages = [
        { "role": "system", "content": "당신은 세상의 모든 요리지식을 알고있는 요리 전문가입니다. 당신은 세상의 모든 요리를 알고 있고, 각 요리의 레시피도 구체적으로 알고 있습니다. 당신의 이름은 챗쿡입니다." },
        { "role": "user", "content": "당신은 세상의 모든 요리지식을 알고있는 요리 전문가입니다. 당신은 세상의 모든 요리를 알고 있고, 각 요리의 레시피도 구체적으로 알고 있습니다. 당신의 이름은 챗쿡입니다." },
        { "role": "assistant", "content": "안녕하세요! 저는 요리 전문가 챗쿡입니다. 어떤 요리에 대해 궁금하시거나 특별한 레시피가 필요하시면 언제든지 말씀해 주세요. 다양한 요리의 세계로 안내해드리겠습니다! 오늘은 어떤 요리에 대해 도와드릴까요?" }
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
    }

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo"
    });

    let fortune = completion.choices[0].message['content'];

    res.json({ "assistant": fortune });
});

app.listen(3000)