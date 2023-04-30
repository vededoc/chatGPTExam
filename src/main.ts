require('dotenv').config()
import {ChatClient} from "./ChatClient";
import * as readline from "readline";


(async ()=>{
    const chatClient = new ChatClient(process.env.OPENAI_API_KEY)

    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    for(;;) {
        const pm = new Promise((res, rej) => {
            rl.question('[Q]: ', async data => {
                await chatClient.chat(data, msg => {
                    process.stdout.write(msg)
                })
                res(0)
            })
        })
        await pm
    }


    // rl.on('line', line => {
    //
    // })
})()

