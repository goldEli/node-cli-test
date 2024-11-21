export enum Project {
    WEB = 'web',
    TRADE = 'trade'
}

export const ProjectList = [
    {
        name: Project.WEB,
        source: '/Users/eli/Documents/weex/web-language',
        target: '/Users/eli/Documents/weex/web_separation/client/locales',
    },
    {
        name: Project.TRADE,
        source: '/Users/eli/Documents/weex/trade-language',
        target: '/Users/eli/Documents/weex/web-trade/client/locales',
    }
]