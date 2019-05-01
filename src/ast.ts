import {Scope} from "./Scope";
import {Promise as SimplePromise, IDeferred} from 'simple-ts-promise';

function lower(str: string): string {
    return str ? str.toLowerCase() : null;
}

interface TokenPattern {
    type: TokenType,
    pattern: RegExp
}

export interface Token {
    type: TokenType,
    value: string
}

export enum BlockType {
    BRACE,
    BRACKET,
    PAREN
}

export enum TokenType {
    WHITESPACE,
    RETURN,
    IF,
    ELSE_IF,
    ELSE,
    NAME,
    L_BRACE,
    R_BRACE,
    L_BRACKET,
    R_BRACKET,
    L_PAREN,
    R_PAREN,
    PERIOD,
    COMMA,
    COLON,
    SEMI_COLON,
    STRING_LITERAL,
    NUMBER_LITERAL,
    BOOLEAN_LITERAL,
    NULL_LITERAL,
    STRICT_EQUALS,
    STRICT_NOT_EQUALS,
    EQUALS,
    NOT_EQUALS,
    GREATER_THAN,
    LESS_THAN,
    GREATER_THAN_EQUAL,
    LESS_THAN_EQUAL,
    ASSIGN,
    AND,
    OR,
    ADD,
    SUBTRACT,
    MULTIPLY,
    DIVIDE
}

const TOKEN_PATTERNS: TokenPattern[] = [
    {
        type: TokenType.WHITESPACE,
        pattern: /^[\s\n\r]+/
    },
    {
        type: TokenType.BOOLEAN_LITERAL,
        pattern: /^(true|false)/
    },
    {
        type: TokenType.NULL_LITERAL,
        pattern: /^null/
    },
    {
        type: TokenType.RETURN,
        pattern: /^return\s/
    },
    {
        type: TokenType.IF,
        pattern: /^if/
    },
    {
        type: TokenType.ELSE_IF,
        pattern: /^else if/
    },
    {
        type: TokenType.ELSE,
        pattern: /^else/
    },
    {
        type: TokenType.NAME,
        pattern: /^[_a-zA-Z][_a-zA-Z0-9]*/
    },
    {
        type: TokenType.NUMBER_LITERAL,
        pattern: /^-?\d+(?:\.\d+)?(?:e[+\-]?\d+)?/i
    },
    {
        type: TokenType.L_BRACE,
        pattern: /^{/
    },
    {
        type: TokenType.R_BRACE,
        pattern: /^}/
    },
    {
        type: TokenType.L_BRACKET,
        pattern: /^\[/
    },
    {
        type: TokenType.R_BRACKET,
        pattern: /^]/
    },
    {
        type: TokenType.L_PAREN,
        pattern: /^\(/
    },
    {
        type: TokenType.R_PAREN,
        pattern: /^\)/
    },
    {
        type: TokenType.PERIOD,
        pattern: /^\./
    },
    {
        type: TokenType.COMMA,
        pattern: /^,/
    },
    {
        type: TokenType.EQUALS,
        pattern: /^==/
    },
    {
        type: TokenType.NOT_EQUALS,
        pattern: /^!=/
    },
    {
        type: TokenType.GREATER_THAN,
        pattern: /^>/
    },
    {
        type: TokenType.LESS_THAN,
        pattern: /^</
    },
    {
        type: TokenType.GREATER_THAN_EQUAL,
        pattern: /^>=/
    },
    {
        type: TokenType.LESS_THAN_EQUAL,
        pattern: /^<=/
    },
    {
        type: TokenType.ASSIGN,
        pattern: /^=/
    },
    {
        type: TokenType.COLON,
        pattern: /^:/
    },
    {
        type: TokenType.SEMI_COLON,
        pattern: /^;/
    },
    {
        type: TokenType.STRING_LITERAL,
        pattern: /^"([^"]*)"/
    },
    {
        type: TokenType.STRING_LITERAL,
        pattern: /^'([^']*)'/ // Try to make this work: /^(?<!\\)(?:\\\\)*"([^(?<!\\)(?:\\\\)*"]*)(?<!\\)(?:\\\\)*"/
    },
    {
        type: TokenType.AND,
        pattern: /^&&/
    },
    {
        type: TokenType.OR,
        pattern: /^\|\|/
    },
    {
        type: TokenType.ADD,
        pattern: /^\+/
    },
        {
        type: TokenType.SUBTRACT,
        pattern: /^-/
    },
    {
        type: TokenType.MULTIPLY,
        pattern: /^\*/
    },
    {
        type: TokenType.DIVIDE,
        pattern: /^\//
    },
];


export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let foundToken: boolean;
    do {
        foundToken = false;
        for (const tp of TOKEN_PATTERNS) {
            const match: RegExpMatchArray = tp.pattern.exec(code);
            if (match) {
                tokens.push({
                    type: tp.type,
                    value: match[match.length - 1]
                });

                code = code.substring(match[0].length);
                foundToken = true;
                break;
            }
        }
    } while (code.length > 0 && foundToken);

    return tokens;
}


export interface TreeNode<T = any> {
    evaluate(scope: Scope): T;
}


export class BlockNode implements TreeNode {
    constructor(
        public readonly statements:  TreeNode[]
    ) {

    }

    public evaluate(scope) {
        let returnValue: any = null;
        for (let i = 0; i < this.statements.length; i++) {
            returnValue = this.statements[i].evaluate(scope);
        }
        return returnValue;
    }
}

class ComparisonNode implements TreeNode {
    constructor(
        public readonly left: TreeNode,
        public readonly right: TreeNode,
        public readonly type: TokenType
    ) {}

    public evaluate(scope) {
        const left: any = this.left.evaluate(scope);
        const right: any = this.right.evaluate(scope);

        switch (this.type) {
            case TokenType.EQUALS:
                return left === right;
            case TokenType.NOT_EQUALS:
                return left !== right;
            case TokenType.GREATER_THAN:
                return left > right;
            case TokenType.LESS_THAN:
                return left < right;
            case TokenType.GREATER_THAN_EQUAL:
                return left >= right;
            case TokenType.LESS_THAN_EQUAL:
                return left <= right;
        }
    }

    public static match(tokens: Token[]): boolean {
        return [
            TokenType.EQUALS,
            TokenType.NOT_EQUALS,
            TokenType.GREATER_THAN,
            TokenType.LESS_THAN,
            TokenType.GREATER_THAN_EQUAL,
            TokenType.LESS_THAN_EQUAL
        ].indexOf(tokens[0].type) > -1
    }

    public static parse(lastNode, token, tokens: Token[]) {
        tokens.splice(0, 1); // Remove comparison operator
        return new ComparisonNode(lastNode, Tree.processTokens(Tree.getNextStatmentTokens(tokens)), token.type)
    }
}

class ArithmeticNode implements TreeNode {
    constructor(
        public readonly left: TreeNode,
        public readonly right: TreeNode,
        public readonly type: TokenType
    ) {}

    public evaluate(scope) {
        const left: any = this.left.evaluate(scope);
        const right: any = this.right.evaluate(scope);

        switch (this.type) {
            case TokenType.ADD:
                return left + right;
            case TokenType.SUBTRACT:
                return left - right;
            case TokenType.MULTIPLY:
                return left * right;
            case TokenType.DIVIDE:
                return left / right;
        }
    }

    public static match(tokens: Token[]): boolean {
        return [
            TokenType.ADD,
            TokenType.SUBTRACT,
            TokenType.MULTIPLY,
            TokenType.DIVIDE
        ].indexOf(tokens[0].type) > -1
    }

    public static parse(lastNode, token, tokens: Token[]) {
        tokens.splice(0, 1); // Remove arithmetic operator
        return new ArithmeticNode(lastNode, Tree.processTokens(Tree.getNextStatmentTokens(tokens)), token.type)
    }
}

class ConditionalNode implements TreeNode {
    constructor(
        public readonly condition: TreeNode,
        public readonly block: BlockNode
    ) {}

    public evaluate(scope) {
        if (this.condition.evaluate(scope))
            return this.block.evaluate(scope);
        return null;
    }
}

class IfStatementNode implements TreeNode {
    constructor(
        protected nodes: ConditionalNode[]
    ) {}

    public evaluate(scope: Scope) {
        for (const condition of this.nodes) {
            if (condition.condition.evaluate(scope))
                return condition.block.evaluate(scope);
        }
    }

    public static parseConditional(tokens: Token[]): ConditionalNode {
        if ([
            TokenType.IF,
            TokenType.ELSE_IF
        ].indexOf(tokens[0].type) === -1) throw SyntaxError('Invalid Syntax');

        tokens.splice(0, 1); // consume if and else if
        return new ConditionalNode(
            Tree.processTokens(Tree.getBlockTokens(tokens)[0]),
            Tree.processTokens(Tree.getBlockTokens(tokens, BlockType.BRACE)[0])
        );
    }

    public static parse(lastNode, token, tokens: Token[]): IfStatementNode {
        if (tokens[1].type !== TokenType.L_PAREN) throw SyntaxError('If statement needs to be followed by a condition encased in parenthesis.');
        const nodes: ConditionalNode[] = [];
        nodes.push(IfStatementNode.parseConditional(tokens));

        while(tokens.length > 0 && TokenType.ELSE_IF === tokens[0].type) {
            nodes.push(IfStatementNode.parseConditional(tokens));
        }

        if (tokens.length > 0 && TokenType.ELSE === tokens[0].type) {
            tokens.splice(0, 1); // Consume else
            nodes.push(new ConditionalNode(
                new LiteralNode(true),
                Tree.processTokens(Tree.getBlockTokens(tokens, BlockType.BRACE)[0])
            ))
        }

        return new IfStatementNode(nodes);
    }
}

class MemberExpressionNode implements TreeNode {
    constructor(
        protected obj: TreeNode,
        protected name: TreeNode<string>
    ) {}

    public evaluate(scope: Scope): any {
        return this.obj.evaluate(scope)[this.name.evaluate(scope)];
    }
}

class LiteralNode<T> implements TreeNode {
    constructor(
        public readonly value: T
    ) {}

    public evaluate(scope): T {
        return this.value;
    }
}

class BooleanLiteralNode extends LiteralNode<number> {
    constructor(
        public readonly value: any
    ) {
        super(value);
        this.value = value === 'true';
    }
}

class NumberLiteralNode extends LiteralNode<number> {
    constructor(
        public readonly value: any
    ) {
        super(value);
        if (this.value.indexOf('.') > -1) {
            this.value = parseFloat(this.value)
        } else {
            this.value = parseInt(this.value);
        }
    }
}


class StringNode implements TreeNode<string> {
    constructor(
        public readonly node: TreeNode
    ) {}

    public evaluate(scope: Scope): string {
        return `${this.node.evaluate(scope)}`;
    }
}


class FunctionCallNode<T = any> implements TreeNode {
    constructor(
        public readonly fnc: TreeNode<(...args: any[]) => any>,
        public readonly args:  TreeNode<any[]>
    ) {}

    public evaluate(scope: Scope): T {
        return this.fnc.evaluate(scope)(...this.args.evaluate(scope));
    }
}


class FunctionArgumentNode<T = any> implements TreeNode {
    constructor(
        protected args: TreeNode<any>[]
    ) {}

    evaluate(scope: Scope): any[] {
        const values: any[] = [];
        for (const arg of this.args) {
            values.push(arg.evaluate(scope));
        }
        return values;
    }
}


class ScopeMemberNode implements TreeNode {
    constructor(
        protected scope: TreeNode<Scope>,
        public readonly name: TreeNode<string>
    ) {}

    evaluate(scope: Scope): Scope {
        const parent: Scope = this.scope.evaluate(scope);
        if (!parent)
            throw Error(`Cannot access ${this.name.evaluate(scope)} of undefined.`);
        return parent.get(this.name.evaluate(scope));
    }
}


class RootScopeMemberNode<T = any> implements TreeNode {
    constructor(
        public readonly name: TreeNode<string>
    ) {}

    evaluate(scope: Scope): T {
        return scope.get(this.name.evaluate(scope));
    }
}

class AssignmentNode implements TreeNode {
    constructor(
        public readonly rootNode: RootScopeMemberNode,
        public readonly toAssign: TreeNode,
    ) {}

    evaluate(scope: Scope) {
        const name: string = this.rootNode.name.evaluate(scope);
        const value: any = this.toAssign.evaluate(scope);
        scope.set(name, value);

        if (scope.get(name) !== value)
            throw Error(`System Error: Failed to assign ${name} to ${value}`);
        return value;
    }

    public static parse(lastNode, token, tokens: Token[]): AssignmentNode {
        if (!(lastNode instanceof RootScopeMemberNode) && !(lastNode instanceof ScopeMemberNode))
            throw SyntaxError('Invalid assignment syntax.');
        tokens.splice(0, 1); // consume =
        const assignmentTokens: Token[] = Tree.getNextStatmentTokens(tokens);
        return new AssignmentNode(
            lastNode,
            Tree.processTokens(assignmentTokens)
        );
    }
}

export class Tree {
    protected rootNode: TreeNode;

    constructor(
        public readonly code: string
    ) {
        this.parse();
    }

    public parse() {
        const tokens = tokenize(this.code);
        this.rootNode = Tree.processTokens(tokens);
    }

    evaluate(scope: Scope) {
        return this.rootNode.evaluate(scope);
    }

    public static stripWhiteSpace(tokens: Token[]): Token[] {
        for (let i: number = 0; i < tokens.length; i++) {
            if (tokens[i].type === TokenType.WHITESPACE) {
                tokens.splice(i, 1);
                i--;
            }
        }
        return tokens;
    }

    public static processTokens(tokens: Token[]): BlockNode {
        let blockNodes: TreeNode[] = [];
        let node: TreeNode = null;
        let count: number = 0;

        Tree.stripWhiteSpace(tokens);

        while (tokens.length > 0) {
            count++;
            if (count > 1000) break; // Limit to 1000 iterations while in development

            if (tokens[0].type === TokenType.RETURN)
                tokens.splice(0, 1);

            const token: Token = tokens[0];
            if (token.type === TokenType.NAME) {
                node = new RootScopeMemberNode<string>(
                    new LiteralNode<string>(token.value)
                );
                tokens.splice(0, 1);
            } else if (token.type === TokenType.ASSIGN) {
                node = AssignmentNode.parse(node, token, tokens);
            } else if (token.type === TokenType.IF) {
                node = IfStatementNode.parse(node, token, tokens);
            } else if (token.type === TokenType.STRING_LITERAL) {
                node = new LiteralNode(token.value);
                tokens.splice(0, 1);
            } else if (token.type === TokenType.NUMBER_LITERAL) {
                node = new NumberLiteralNode(token.value);
                tokens.splice(0, 1);
            } else if (token.type === TokenType.PERIOD && tokens[1].type === TokenType.NAME) {
                node = new ScopeMemberNode(
                    node,
                    new LiteralNode<string>(tokens[1].value)
                );
                tokens.splice(0, 2);
            } else if (tokens[0].type === TokenType.L_PAREN) {
                const funcArgs: Token[][] = Tree.getBlockTokens(tokens);
                const nodes: TreeNode[] = [];
                for (const arg of funcArgs) {
                    nodes.push(Tree.processTokens(arg));
                }
                node = new FunctionCallNode(
                    node, // Previous node should be a NAME
                    new FunctionArgumentNode(nodes)
                );
            } else if (tokens[0].type === TokenType.SEMI_COLON) {
                if (node) {
                    blockNodes.push(node);
                }
                node = null;
                tokens.splice(0, 1);
            } else if (ComparisonNode.match(tokens)) {
                node = ComparisonNode.parse(node, token, tokens);
            } else if (ArithmeticNode.match(tokens)) {
                node = ArithmeticNode.parse(node, token, tokens);
            } else if (tokens[0].type === TokenType.WHITESPACE) {
                tokens.splice(0, 1);
            } else if (tokens[0].type === TokenType.BOOLEAN_LITERAL) {
                node = new BooleanLiteralNode(tokens[0].value);
                tokens.splice(0, 1);
            } else if (tokens[0].type === TokenType.NULL_LITERAL) {
                node = new LiteralNode(null);
                tokens.splice(0, 1);
            } else {
                let code: string = Tree.toCode(tokens, 10);
                throw Error(`Syntax Error. Near ${code}`);
            }
        }

        if (node) {
            blockNodes.push(node);
        }

        return new BlockNode(blockNodes);
    }

    public static toCode(tokens: Token[], limit?): string {
        let code: string = '';
        limit = limit || tokens.length;
        for (let i = 0; i < limit; i++) {
            if (!tokens[i]) break;
            code += tokens[i].value;
        }

        return code;
    }

    public static getNextStatmentTokens(tokens: Token[]): Token[] {
        const statementTokens: Token[] = [];

        // Consume opening block
        if ([
                TokenType.L_BRACKET,
                TokenType.L_BRACE,
                TokenType.L_PAREN
            ].indexOf(tokens[0].type) > -1) {
            tokens.splice(0, 1);
        }

        for (let i: number = 0; i < tokens.length; i++) {
            const token: Token = tokens[i];
            if ([
                TokenType.SEMI_COLON,
                TokenType.R_BRACKET,
                TokenType.R_BRACE,
                TokenType.R_PAREN
            ].indexOf(token.type) > -1) {
                if (token.type !== TokenType.SEMI_COLON)
                    tokens.splice(0, 1); // Consume end of block
                break;
            }

            statementTokens.push(token);
            tokens.splice(0, 1);
            i--;
        }
        return statementTokens;
    }

    public static getBlockTokens(tokens: Token[], blockType: BlockType = BlockType.PAREN): Token[][] {
        let open: TokenType = TokenType.L_PAREN;
        let close: TokenType = TokenType.R_PAREN;
        let closeSymbol: string = ')';
        switch(blockType) {
            case BlockType.BRACE:
                open = TokenType.L_BRACE;
                close = TokenType.R_BRACE;
                closeSymbol = '}';
                break;
            case BlockType.BRACKET:
                open = TokenType.L_BRACKET;
                close = TokenType.R_BRACKET;
                closeSymbol = ']';
                break;
        }
        let openBlocks: number = 0;
        const args: Token[][] = [];
        let arg: Token[] = [];
        for (let i: number = 0; i < tokens.length; i++) {
            const token: Token = tokens[i];
            if (token.type === open) {
                openBlocks += 1;
                if (openBlocks > 1)
                    arg.push(token);
            } else if (token.type === close) {
                openBlocks -= 1;
                if (openBlocks > 0)
                    arg.push(token);
            } else if (token.type === TokenType.COMMA && openBlocks == 1) {
                args.push(arg);
                arg = [];
            } else if (token.type !== TokenType.WHITESPACE) {
                arg.push(token);
            }

            // Consume token
            tokens.splice(0, 1);
            i--;

            if (openBlocks === 0) {
                if (arg.length > 0)
                    args.push(arg);

                return args;
            }
        }
        throw Error(`Invalid Syntax, missing ${closeSymbol}`);
    }
}
