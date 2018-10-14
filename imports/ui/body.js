import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { States } from '../api/states.js';
import { Messages } from '../api/messages.js';
import { Options } from '../api/options.js';
import { Recorders } from '../api/recorders.js';

import './body.html';
import './recorder.js';

import './WebAudioRecorder.js';
import { greet, clearMessages, insertMessage } from './messages.js';
import { insertOption, clearOptions } from './options.js';
import { insertRecorder } from './recorder.js';

Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('states');
    greet();
    insertMessage("Test.");
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
});

Template.body.helpers({
    states() {
        return States.find({});
    },
    messages() {
        return Messages.find({});
    },
    recorders() {
        return Recorders.find({});
    },
    options() {
        return Options.find({});
    }
});


import './state.js';
