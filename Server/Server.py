import zhipuai

from flask import Flask, request, render_template

from gevent import pywsgi

app = Flask(__name__)


model = "chatglm_lite"  #这里可以选择模型

def chat_with_gpt(prompt, key, AImodel):
    chat_reply=""
    zhipuai.api_key = key
    response = zhipuai.model_api.sse_invoke(
        model=AImodel,
        prompt=[{"role": "user", "content": prompt}],
        top_p=0.7,
        temperature=0.9,
    )
    # response.choices[0].text.strip()
    for event in response.events():
        if event.event == "add":
            chat_reply+=event.data
#    print(chat_reply)
    return chat_reply

@app.route('/',methods = ['POST', 'GET'])
def chat():

    user_message=request.args.get('info')
    key=request.args.get('APIkey')
    model=request.args.get('APIModel')
    res = chat_with_gpt(user_message,key,model)

    return res


if __name__ == "__main__":

    app.run(host='0.0.0.0')

