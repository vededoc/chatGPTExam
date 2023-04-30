import {Configuration, OpenAIApi} from "openai";
import {ChatCompletionRequestMessage} from "openai/api";
import {Readable} from "stream";

export class ChatClient {

    openai: OpenAIApi
    messages: ChatCompletionRequestMessage[] =[]

    constructor(apiKey: string) {
        const configuration = new Configuration({
            apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async chat(question: string, ansCb?: (msg: string) => void) {
        return new Promise( async (res, rej) => {
            let resultError
            this.messages.push({
                role: 'user',
                content: question
            })
            const resp = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: this.messages,
                stream: true,
            },{
                responseType: 'stream'
            });

            let ansMsg: string = ''
            const stream: Readable = resp.data as any as Readable
            stream.on('data', data => {
                const lines = data.toString().split('\n')
                for(let line of lines) {
                    // console.info('line:', line)
                    if(line) {
                        const message = line.slice(6)
                        if(message=='[DONE]') {
                            // console.info('DONE')
                        } else {
                            const lo = JSON.parse(message)
                            const ch = lo.choices[0]
                            if (ch.delta?.content) {
                                // console.info(ch.delta.content)
                                ansMsg += ch.delta.content
                                if(ansCb) {
                                    ansCb(ch.delta.content)
                                }
                            }
                        }
                    }
                }
            })

            stream.on('end', () => {
                this.messages.push({
                    role: 'assistant',
                    content: ansMsg
                })
                if(!resultError) {
                    res(0)
                } else {
                    rej(resultError)
                }
            })

            stream.on('error', (err)=> {
                resultError = err
            })
        })

    }
}