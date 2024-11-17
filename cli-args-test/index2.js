const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
    boolean: ['x'],
    string: ['y'],
    unknown: (arg) => {
        return arg === '-u'
    },
    default: {
        y: 'default-y'
    },
    alias: {
        p: 'port'
    }
});
console.log(argv);
