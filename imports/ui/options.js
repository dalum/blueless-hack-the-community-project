import { Template } from 'meteor/templating';
import { Options } from '../api/options.js';

export function insertOption(msg, val, fn) {
    Options.insert({
        text: msg,
        val: val,
        fn: fn
    });
}

export function clearOptions() {
    Options.remove({});
}

Template.option.events({
    'click li'(event, instance) {
        instance.data.fn(instance.data.val);
    }
});
