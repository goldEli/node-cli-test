import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
import template from '@babel/template';
import { isObjectExpression } from '@babel/types';
const sourceCode = `
import { Module } from '@nestjs/common';

@Module({})
export class AaaModule {}
`;
function myPlugin() {
    return {
        visitor: {
            Program(path) {
                let index = 0;
                while (path.node.body[index].type === 'ImportDeclaration') {
                    index++;
                }
                const ast = template.statement("import { AaaController } from './aaa.controller';")();
                path.node.body.splice(index, 0, ast);
            },
            Decorator(path) {
                const decoratorName = path.node.expression.callee.name;
                if (decoratorName !== 'Module') {
                    return;
                }
                const obj = path.node.expression.arguments[0];
                const controllers = obj.properties.find((item) => item.key.name === 'controllers');
                if (!controllers) {
                    const expression = template.expression('{controllers: [AaaController]}')();
                    if (isObjectExpression(expression)) {
                        obj.properties.push(expression.properties[0]);
                    }
                }
                else {
                    const property = template.expression('AaaController')();
                    controllers.value.elements.push(property);
                }
            }
        }
    };
}
const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ["decorators"]
});
const res = transformFromAstSync(ast, sourceCode, {
    plugins: [myPlugin]
});
console.log(res === null || res === void 0 ? void 0 : res.code);
//# sourceMappingURL=index.js.map