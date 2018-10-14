import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Messages } from '../api/messages.js';
import { Recorders } from '../api/recorders.js';

var APISECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImVtYWlsIjoiaGFja2F0aG9uQHdvbmRlcnRlY2guY29tLmNuIiwiZXhwIjoxNjk3MDc4NTI1LCJ1c2VyaWQiOiJjNjBjYzcxNy02NDczLTRkMDctOWU3Yi02NWJlNTM5MDFiZjQifQ.LpZXDpIqOoZZb4537xKVwvjvadiAf1AjRVTvWQBSMog";

export function insertRecorder() {
    Recorders.insert({});
}

export function clearRecorders() {
    Recorders.remove({});
}

Template.recorder.onCreated(function recorderOnCreated() {
    // counter starts at 0
    this.recorder = null;
    this.available = new ReactiveVar(false);
    this.recording = new ReactiveVar(false);
    var instance = this;

    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

        var constraints = { audio: true };

        var onSuccess = function(stream) {
            var ctx = new AudioContext();
            var audioIn = ctx.createMediaStreamSource(stream);
            instance.recorder = new WebAudioRecorder(audioIn, { encodeAfterRecord: true });
            instance.available.set(true);
            console.log("success");
        };

        var onError = function(err) {
            console.log('The following error occured: ' + err);
        };

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        console.log('getUserMedia is not supported.');
    }
});

Template.recorder.helpers({
    isavailable() {
        return Template.instance().available.get();
    },
    isrecording() {
        return Template.instance().recording.get();
    }
});

Template.recorder.events({
    'click li'(event, instance) {
        console.log("record press");
        if (instance.recorder) {
            if (instance.recorder.isRecording()) {
                instance.recorder.finishRecording();
                console.log("recorder stopped");
                instance.recording.set(false);
            } else {
                instance.recorder.onComplete = function(recorder, blob) {
                    var formData = new FormData();
                    formData.set('file', blob, 'file.wav');

                    var xhr = new XMLHttpRequest();
                    xhr.open("post", 'https://venus.wondertech.com.cn/api/', true);
                    xhr.setRequestHeader("API_SECRET", APISECRET);
                    xhr.onreadystatechange = function() {
                        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                            console.log("got response:");
                            var json = JSON.parse(this.responseText);
                            if (!json.error) {
                                var emotion = json.venus.group11_primary + " and " + json.venus.group11_secondary;
                                Messages.insert({
                                    text: `I think you are feeling ${emotion} now? Is that how you feel?`
                                });
                            } else {
                                console.log(`error: ${json.error}`);
                            }
                        } else if (this.status == 500) {
                            console.log(`error: ${this.response}`);
                        }
                    };

                    console.log("sending request ...");
                    xhr.send(formData);
                };

                instance.recorder.startRecording();
                if (instance.recorder.isRecording()) {
                    console.log("recorder started");
                    instance.recording.set(true);
                } else {
                    console.log("failed to start recorder");
                }
            }
        } else {
            console.log("recorder not initialized");
        }
    }
});
