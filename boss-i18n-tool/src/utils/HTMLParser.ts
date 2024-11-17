// 文件名：HTMLParser.ts
import { JSDOM } from "jsdom";

// 定义 AST 节点类型
export type ASTNode = 
  | { type: "text"; value: string } 
  | { type: "element"; tag: string; attributes: Record<string, string>; children: ASTNode[] };

export class HTMLParser {
  constructor() {}

  /**
   * 将 HTML 字符串解析为 AST
   * @param htmlString HTML 字符串
   * @returns AST 树
   */
  public parse(htmlString: string): ASTNode | null {
    const dom = new JSDOM(htmlString);
    return this._createAST(dom.window.document.body);
  }

  /**
   * 将 DOM 节点递归转成 AST 节点
   * @param node DOM 节点
   * @returns AST 节点
   */
  private _createAST(node: Node): ASTNode | null {
    if (node.nodeType === 3) {
      // 文本节点
      const value = node.nodeValue?.trim();
      return value ? { type: "text", value } : null;
    }

    if (node.nodeType === 1) {
      // 元素节点
      const element = node as Element;
      return {
        type: "element",
        tag: element.tagName.toLowerCase(),
        attributes: this._getAttributes(element),
        children: Array.from(element.childNodes)
          .map((child) => this._createAST(child))
          .filter((child): child is ASTNode => child !== null), // 过滤空节点
      };
    }

    return null; // 忽略其他节点
  }

  /**
   * 获取节点的属性
   * @param node 元素节点
   * @returns 属性键值对
   */
  private _getAttributes(node: Element): Record<string, string> {
    return Array.from(node.attributes).reduce<Record<string, string>>((attrs, attr) => {
      attrs[attr.name] = attr.value;
      return attrs;
    }, {});
  }
}
