import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Messages } from '../api/messages.js';
import { insertOption, insertTypedOption, clearOptions } from './options.js';
import { insertRecorder, clearRecorders } from './recorder.js';

export function insertMessage(msg, src) {
    Messages.insert({
        text: msg,
        src: src,
        time: new Date()
    });
}

export function clearMessages() {
    Messages.remove({});
}

export function messageError() { insertMessage("I'm sorry, I didn't understand that.  Could you repeat?", "hi.ogg"); }
export function greet() {
    insertMessage("Hi.", "hi.ogg");
    Meteor.setTimeout(function (e) {
        insertMessage("How do you feel?", "howdoyoufeel.ogg");
        Meteor.setTimeout(function (e) {
            insertOption(true, "I don't know.", "", function (msg) {
                clearOptions();
                clearMessages();
                insertMessage("Tell me about your day.", "tellmeaboutyourday.ogg");
            });
            insertOption(false, "Let me pick.", "", function (msg) { pickEmotion(); });
            insertRecorder();
        }, 1000);
    }, 1000);
}

export function pickEmotion() {
    clearOptions();
    insertOption(false, "Angry.", "", function (msg) {} );
    insertOption(false, "Anxious.", "", function (msg) {
        clearOptions();
        clearRecorders();
        anxious();
    });
    insertOption(false, "Depressed.", "", function (msg) {} );
    insertOption(false, "Dissatisfied.", "", function (msg) {} );
    insertOption(true, "Hopeful.", "", function (msg) {} );
    insertOption(false, "Hopeless.", "", function (msg) {} );
    insertOption(false, "Hopeless.", "", function (msg) {} );
    insertOption(true, "Joyful.", "", function (msg) {} );
    insertOption(true, "Loving.", "", function (msg) {} );
    insertOption(true, "Relieved.", "", function (msg) {} );
    insertOption(true, "Satisfied.", "", function (msg) {} );
    insertOption(true, "Thankful.", "", function (msg) {} );
    insertOption(false, "Upset.", "", function (msg) {} );
}

export function tryAgain() {
    clearOptions();
    clearMessages();
    insertMessage(`Do you want to try again?`, "tryagain.ogg");
    insertOption(false, "Let me pick.", "", function (msg) { clearMessages(); pickEmotion(); } );
    insertRecorder();
}

export function queryEmotion(e) {
    e = "anxious";
    insertMessage(`I think you are feeling ${e} now?`, `${e}query.ogg`);
    Meteor.setTimeout(function () {
        insertMessage(`Is that how you feel?`, `isthathowyoufeel.ogg`);

        Meteor.setTimeout(function () {
            insertOption(true, "Yes.", "", function (msg) {
                eval(`${e}()`);
                clearOptions();
            });
            insertOption(false, "No.", "", function (msg) {
                tryAgain();
            });
        }, 1000);
    }, 2500);
}

export function anxious() {
    clearMessages();
    // insertMessage("You said you feel anxious.", "yousaidyoufeelanxious.ogg");

    // Meteor.setTimeout(function (e) {
        insertMessage("Now, I am going to ask you some questions.", "nowiamgoingtoask.ogg");

        Meteor.setTimeout(function (e) {
            insertMessage("Please spend some time to reflect on them.", "pleasespendtime.ogg");

            Meteor.setTimeout(function (e) {
                clearMessages();
                insertMessage("What do you think is the cause of this emotion?", "whatdoyouthinkisemotion.ogg");

                Meteor.setTimeout(function (e) {
                    clearMessages();
                    insertMessage("Why is it causing you to feel anxious?", "whyisitcausinganxious.ogg");

                    Meteor.setTimeout(function (e) {
                        clearMessages();
                        insertMessage("Is there anything else making you anxious?", "isthereanythingelseanxious.ogg");

                        Meteor.setTimeout(function (e) {
                            clearMessages();
                            insertMessage("For now, what could you do to reduce your anxiety?", "fornowreduceanxiety.ogg");

                            Meteor.setTimeout(anxiousSuggestion(), 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 3000);
        }, 3000);
    // }, 2000);
}

export function anxiousSuggestion() {
    clearMessages();
    insertMessage("Are there things you could do now to reduce your anxiety?", "aretherethingstoreduceanxiety.ogg");
    insertOption(true, "Yes.", "", function () {
        clearMessages();
        clearOptions();
        insertMessage("What are they?", "whatarethey.ogg");
        insertTypedOption(true, "1. ", "", function () { whatNow(); });
        insertTypedOption(false, "2. ", "", function () { whatNow(); });

    });
    insertOption(false, "No.", "", function () {});
}

export function whatNow() {
    clearMessages();
    clearOptions();
    insertMessage("What now?", "whatnow.ogg");
    insertOption(true, "I'm off to take action.", "", function () { genericActionQuit(); });
    insertOption(false, "Give me more suggestions.", "", function () { genericActionSuggestions(); });
}

export function genericActionSuggestions() {
    clearMessages();
    clearOptions();
    insertMessage("Want to listen to some music?", "wanttolistentomusic.ogg");
    insertOption(true, "Yes.", "", function () { genericActionQuit(); });
    insertOption(false, "No.", "", function () {});
}

export function genericActionQuit() {
    clearMessages();
    clearOptions();
    insertMessage("Great! I am happy for you.", "greatiamhappyforyou.ogg");
    Meteor.setTimeout(function () {
        insertMessage("Make the most of your day.", "makethemostofyourday.ogg");
    }, 2000);
}

