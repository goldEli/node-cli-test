export var Project;
(function (Project) {
    Project["WEB"] = "web";
    Project["TRADE"] = "trade";
})(Project || (Project = {}));
export const ProjectList = [
    {
        name: Project.WEB,
        source: '/Users/eli/Documents/weex/web-language',
        target: '/Users/eli/Documents/weex/web_separation/client/locales',
        languageMap: {
            'ar-AR.json': 'ar.json',
        }
    },
    {
        name: Project.TRADE,
        source: '/Users/eli/Documents/weex/trade-language',
        target: '/Users/eli/Documents/weex/web-trade/client/locales',
    }
];
//# sourceMappingURL=project.js.map