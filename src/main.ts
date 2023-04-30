require('dotenv').config()
import {ChatClient} from "./ChatClient";
import * as readline from "readline";


(async ()=>{
    const chatClient = new ChatClient(process.env.OPENAI_API_KEY)

    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    let answering = false
    for(;;) {
        const pm = new Promise((res, rej) => {
            rl.question('[Q]: ', async data => {
                if(data.length > 0 && !answering) {
                    answering = true
                    await chatClient.chat(data, msg => {
                        process.stdout.write(msg)
                    })
                    answering = false
                }
                res(0)
            })
        })
        await pm
        console.info('')
    }


    // rl.on('line', line => {
    //
    // })
})()

