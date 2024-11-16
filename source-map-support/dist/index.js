import fs from 'fs';
Error.prepareStackTrace = (error, stack) => {
    const name = error.name || 'Error';
    const message = error.message || '';
    const errorString = name + ": " + message;
    const processedStack = [];
    for (let i = stack.length - 1; i >= 0; i--) {
        processedStack.push('\n    atat ' + wrapCallSite(stack[i]));
    }
    return errorString + processedStack.reverse().join('');
};
function wrapCallSite(frame) {
    const source = frame.getFileName();
    if (source) {
        const newFrame = {};
        newFrame.getFunctionName = function () {
            return frame.getFunctionName();
        };
        newFrame.getFileName = function () { return frame.getFileName(); };
        newFrame.getLineNumber = function () { return 666; };
        newFrame.getColumnNumber = function () { return frame.getColumnNumber(); };
        newFrame.toString = function () {
            return this.getFunctionName()
                + ' (' + this.getFileName()
                + ':' + this.getLineNumber()
                + ':' + this.getColumnNumber()
                + ')';
        };
        return newFrame;
    }
    return frame;
}
function retrieveSourceMapURL(source) {
    const fileData = fs.readFileSync(source, { encoding: 'utf-8' });
    const regex = /# sourceMappingURL=(.*)$/g;
    // const regex = /\{(.*)\}/g;
    let lastMatch, match;
    while (match = regex.exec(fileData)) {
        lastMatch = match;
    }
    if (!lastMatch)
        return null;
    return lastMatch[1];
}
console.log(retrieveSourceMapURL('./dist/index.js'));
function add(a, b) {
    if (a === 1) {
        throw new Error('xxx');
    }
    return a + b;
}
function main() {
    console.log(add(1, 2));
}
main();
//# sourceMappingURL=index.js.map