import { Messages } from '../api/messages.js';

export function insertMessage(msg) {
    Messages.insert({
        text: msg,
        time: new Date()
    });
}

export function clearMessages() {
    Messages.remove({});
}

export function messageError() { insertMessage("I'm sorry, I didn't understand that.  Could you repeat?"); }
export function greet() { insertMessage("Hi, how are you feeling?"); }
export function queryEmotion(e) { insertMessage(`I think you are feeling ${e} now? Is that how you feel?`); }
