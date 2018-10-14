import { Meteor } from 'meteor/meteor';
import { Messages } from '../api/messages.js';
import { insertOption, clearOptions } from './options.js';
import { insertRecorder } from './recorder.js';

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
export function greet() {
    insertMessage("Hi.");
    Meteor.setTimeout(function (e) {
        insertMessage("How are you feeling?");
        Meteor.setTimeout(function (e) {
            insertOption("Give me options", "", function (msg) {
                // clearOptions();
                // clearMessages();
                // insertRecorder();
            });
            insertOption("I don't know", "", function (msg) {
                clearOptions();
                clearMessages();
                insertRecorder();
            });
        }, 1000);
    }, 1000);
}
export function queryEmotion(e) { insertMessage(`I think you are feeling ${e} now? Is that how you feel?`); }
