var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
import template from '@babel/template';
import { isObjectExpression } from '@babel/types';
import prettier from 'prettier';
import { readFile } from 'node:fs/promises';
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
export function transformFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceCode = yield readFile(filePath, 'utf-8');
        const ast = parser.parse(sourceCode, {
            sourceType: 'module',
            plugins: ["decorators"]
        });
        const res = transformFromAstSync(ast, sourceCode, {
            plugins: [myPlugin],
            retainLines: true
        });
        const formatedCode = yield prettier.format(res === null || res === void 0 ? void 0 : res.code, {
            filepath: filePath
        });
        return formatedCode;
    });
}
//# sourceMappingURL=transform.js.map