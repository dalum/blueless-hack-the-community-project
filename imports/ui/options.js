import { Template } from 'meteor/templating';
import { Options } from '../api/options.js';

export function insertOption(positive, msg, val, fn) {
    Options.insert({
        positive: positive,
        text: msg,
        val: val,
        typed: false,
        fn: fn
    });
}

export function insertTypedOption(positive, msg, val, fn) {
    Options.insert({
        positive: positive,
        text: msg,
        val: val,
        typed: true,
        fn: fn
    });
}

export function clearOptions() {
    Options.remove({});
}

Template.option.events({
    'click li'(event, instance) {
        if (!instance.data.typed)
            instance.data.fn(instance.data.val);
    },
    'submit'(event, instance) {
        event.preventDefault();
        instance.data.fn(instance.data.val);
    }
});
