import { Scope } from "./Scope";
export interface Token {
    type: TokenType;
    value: string;
}
export declare enum BlockType {
    BRACE = 0,
    BRACKET = 1,
    PAREN = 2
}
export declare enum TokenType {
    WHITESPACE = 0,
    RETURN = 1,
    IF = 2,
    ELSE_IF = 3,
    ELSE = 4,
    NAME = 5,
    L_BRACE = 6,
    R_BRACE = 7,
    L_BRACKET = 8,
    R_BRACKET = 9,
    L_PAREN = 10,
    R_PAREN = 11,
    PERIOD = 12,
    COMMA = 13,
    COLON = 14,
    SEMI_COLON = 15,
    STRING_LITERAL = 16,
    NUMBER_LITERAL = 17,
    BOOLEAN_LITERAL = 18,
    NULL_LITERAL = 19,
    STRICT_EQUALS = 20,
    STRICT_NOT_EQUALS = 21,
    EQUALS = 22,
    NOT_EQUALS = 23,
    GREATER_THAN = 24,
    LESS_THAN = 25,
    GREATER_THAN_EQUAL = 26,
    LESS_THAN_EQUAL = 27,
    ASSIGN = 28,
    AND = 29,
    OR = 30,
    ADD = 31,
    SUBTRACT = 32,
    MULTIPLY = 33,
    DIVIDE = 34
}
export declare function tokenize(code: string): Token[];
export interface TreeNode<T = any> {
    evaluate(scope: Scope): T;
}
export declare class BlockNode implements TreeNode {
    readonly statements: TreeNode[];
    constructor(statements: TreeNode[]);
    evaluate(scope: any): any;
}
export declare class Tree {
    readonly code: string;
    protected rootNode: TreeNode;
    constructor(code: string);
    parse(): void;
    evaluate(scope: Scope): any;
    static stripWhiteSpace(tokens: Token[]): Token[];
    static processTokens(tokens: Token[]): BlockNode;
    static toCode(tokens: Token[], limit?: any): string;
    static getNextStatmentTokens(tokens: Token[]): Token[];
    static getBlockTokens(tokens: Token[], blockType?: BlockType): Token[][];
}
