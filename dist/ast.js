"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function lower(str) {
    return str ? str.toLowerCase() : null;
}
var BlockType;
(function (BlockType) {
    BlockType[BlockType["BRACE"] = 0] = "BRACE";
    BlockType[BlockType["BRACKET"] = 1] = "BRACKET";
    BlockType[BlockType["PAREN"] = 2] = "PAREN";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["WHITESPACE"] = 0] = "WHITESPACE";
    TokenType[TokenType["RETURN"] = 1] = "RETURN";
    TokenType[TokenType["IF"] = 2] = "IF";
    TokenType[TokenType["ELSE_IF"] = 3] = "ELSE_IF";
    TokenType[TokenType["ELSE"] = 4] = "ELSE";
    TokenType[TokenType["NAME"] = 5] = "NAME";
    TokenType[TokenType["L_BRACE"] = 6] = "L_BRACE";
    TokenType[TokenType["R_BRACE"] = 7] = "R_BRACE";
    TokenType[TokenType["L_BRACKET"] = 8] = "L_BRACKET";
    TokenType[TokenType["R_BRACKET"] = 9] = "R_BRACKET";
    TokenType[TokenType["L_PAREN"] = 10] = "L_PAREN";
    TokenType[TokenType["R_PAREN"] = 11] = "R_PAREN";
    TokenType[TokenType["PERIOD"] = 12] = "PERIOD";
    TokenType[TokenType["COMMA"] = 13] = "COMMA";
    TokenType[TokenType["COLON"] = 14] = "COLON";
    TokenType[TokenType["SEMI_COLON"] = 15] = "SEMI_COLON";
    TokenType[TokenType["STRING_LITERAL"] = 16] = "STRING_LITERAL";
    TokenType[TokenType["NUMBER_LITERAL"] = 17] = "NUMBER_LITERAL";
    TokenType[TokenType["BOOLEAN_LITERAL"] = 18] = "BOOLEAN_LITERAL";
    TokenType[TokenType["NULL_LITERAL"] = 19] = "NULL_LITERAL";
    TokenType[TokenType["STRICT_EQUALS"] = 20] = "STRICT_EQUALS";
    TokenType[TokenType["STRICT_NOT_EQUALS"] = 21] = "STRICT_NOT_EQUALS";
    TokenType[TokenType["EQUALS"] = 22] = "EQUALS";
    TokenType[TokenType["NOT_EQUALS"] = 23] = "NOT_EQUALS";
    TokenType[TokenType["GREATER_THAN"] = 24] = "GREATER_THAN";
    TokenType[TokenType["LESS_THAN"] = 25] = "LESS_THAN";
    TokenType[TokenType["GREATER_THAN_EQUAL"] = 26] = "GREATER_THAN_EQUAL";
    TokenType[TokenType["LESS_THAN_EQUAL"] = 27] = "LESS_THAN_EQUAL";
    TokenType[TokenType["ASSIGN"] = 28] = "ASSIGN";
    TokenType[TokenType["AND"] = 29] = "AND";
    TokenType[TokenType["OR"] = 30] = "OR";
    TokenType[TokenType["ADD"] = 31] = "ADD";
    TokenType[TokenType["SUBTRACT"] = 32] = "SUBTRACT";
    TokenType[TokenType["MULTIPLY"] = 33] = "MULTIPLY";
    TokenType[TokenType["DIVIDE"] = 34] = "DIVIDE";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var TOKEN_PATTERNS = [
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
function tokenize(code) {
    var tokens = [];
    var foundToken;
    do {
        foundToken = false;
        for (var _i = 0, TOKEN_PATTERNS_1 = TOKEN_PATTERNS; _i < TOKEN_PATTERNS_1.length; _i++) {
            var tp = TOKEN_PATTERNS_1[_i];
            var match = tp.pattern.exec(code);
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
exports.tokenize = tokenize;
var BlockNode = /** @class */ (function () {
    function BlockNode(statements) {
        this.statements = statements;
    }
    BlockNode.prototype.evaluate = function (scope) {
        var returnValue = null;
        for (var i = 0; i < this.statements.length; i++) {
            returnValue = this.statements[i].evaluate(scope);
        }
        return returnValue;
    };
    return BlockNode;
}());
exports.BlockNode = BlockNode;
var ComparisonNode = /** @class */ (function () {
    function ComparisonNode(left, right, type) {
        this.left = left;
        this.right = right;
        this.type = type;
    }
    ComparisonNode.prototype.evaluate = function (scope) {
        var left = this.left.evaluate(scope);
        var right = this.right.evaluate(scope);
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
    };
    ComparisonNode.match = function (tokens) {
        return [
            TokenType.EQUALS,
            TokenType.NOT_EQUALS,
            TokenType.GREATER_THAN,
            TokenType.LESS_THAN,
            TokenType.GREATER_THAN_EQUAL,
            TokenType.LESS_THAN_EQUAL
        ].indexOf(tokens[0].type) > -1;
    };
    ComparisonNode.parse = function (lastNode, token, tokens) {
        tokens.splice(0, 1); // Remove comparison operator
        return new ComparisonNode(lastNode, Tree.processTokens(Tree.getNextStatmentTokens(tokens)), token.type);
    };
    return ComparisonNode;
}());
var ArithmeticNode = /** @class */ (function () {
    function ArithmeticNode(left, right, type) {
        this.left = left;
        this.right = right;
        this.type = type;
    }
    ArithmeticNode.prototype.evaluate = function (scope) {
        var left = this.left.evaluate(scope);
        var right = this.right.evaluate(scope);
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
    };
    ArithmeticNode.match = function (tokens) {
        return [
            TokenType.ADD,
            TokenType.SUBTRACT,
            TokenType.MULTIPLY,
            TokenType.DIVIDE
        ].indexOf(tokens[0].type) > -1;
    };
    ArithmeticNode.parse = function (lastNode, token, tokens) {
        tokens.splice(0, 1); // Remove arithmetic operator
        return new ArithmeticNode(lastNode, Tree.processTokens(Tree.getNextStatmentTokens(tokens)), token.type);
    };
    return ArithmeticNode;
}());
var ConditionalNode = /** @class */ (function () {
    function ConditionalNode(condition, block) {
        this.condition = condition;
        this.block = block;
    }
    ConditionalNode.prototype.evaluate = function (scope) {
        if (this.condition.evaluate(scope))
            return this.block.evaluate(scope);
        return null;
    };
    return ConditionalNode;
}());
var IfStatementNode = /** @class */ (function () {
    function IfStatementNode(nodes) {
        this.nodes = nodes;
    }
    IfStatementNode.prototype.evaluate = function (scope) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var condition = _a[_i];
            if (condition.condition.evaluate(scope))
                return condition.block.evaluate(scope);
        }
    };
    IfStatementNode.parseConditional = function (tokens) {
        if ([
            TokenType.IF,
            TokenType.ELSE_IF
        ].indexOf(tokens[0].type) === -1)
            throw SyntaxError('Invalid Syntax');
        tokens.splice(0, 1); // consume if and else if
        return new ConditionalNode(Tree.processTokens(Tree.getBlockTokens(tokens)[0]), Tree.processTokens(Tree.getBlockTokens(tokens, BlockType.BRACE)[0]));
    };
    IfStatementNode.parse = function (lastNode, token, tokens) {
        if (tokens[1].type !== TokenType.L_PAREN)
            throw SyntaxError('If statement needs to be followed by a condition encased in parenthesis.');
        var nodes = [];
        nodes.push(IfStatementNode.parseConditional(tokens));
        while (tokens.length > 0 && TokenType.ELSE_IF === tokens[0].type) {
            nodes.push(IfStatementNode.parseConditional(tokens));
        }
        if (tokens.length > 0 && TokenType.ELSE === tokens[0].type) {
            tokens.splice(0, 1); // Consume else
            nodes.push(new ConditionalNode(new LiteralNode(true), Tree.processTokens(Tree.getBlockTokens(tokens, BlockType.BRACE)[0])));
        }
        return new IfStatementNode(nodes);
    };
    return IfStatementNode;
}());
var MemberExpressionNode = /** @class */ (function () {
    function MemberExpressionNode(obj, name) {
        this.obj = obj;
        this.name = name;
    }
    MemberExpressionNode.prototype.evaluate = function (scope) {
        return this.obj.evaluate(scope)[this.name.evaluate(scope)];
    };
    return MemberExpressionNode;
}());
var LiteralNode = /** @class */ (function () {
    function LiteralNode(value) {
        this.value = value;
    }
    LiteralNode.prototype.evaluate = function (scope) {
        return this.value;
    };
    return LiteralNode;
}());
var BooleanLiteralNode = /** @class */ (function (_super) {
    __extends(BooleanLiteralNode, _super);
    function BooleanLiteralNode(value) {
        var _this = _super.call(this, value) || this;
        _this.value = value;
        _this.value = value === 'true';
        return _this;
    }
    return BooleanLiteralNode;
}(LiteralNode));
var NumberLiteralNode = /** @class */ (function (_super) {
    __extends(NumberLiteralNode, _super);
    function NumberLiteralNode(value) {
        var _this = _super.call(this, value) || this;
        _this.value = value;
        if (_this.value.indexOf('.') > -1) {
            _this.value = parseFloat(_this.value);
        }
        else {
            _this.value = parseInt(_this.value);
        }
        return _this;
    }
    return NumberLiteralNode;
}(LiteralNode));
var StringNode = /** @class */ (function () {
    function StringNode(node) {
        this.node = node;
    }
    StringNode.prototype.evaluate = function (scope) {
        return "" + this.node.evaluate(scope);
    };
    return StringNode;
}());
var FunctionCallNode = /** @class */ (function () {
    function FunctionCallNode(fnc, args) {
        this.fnc = fnc;
        this.args = args;
    }
    FunctionCallNode.prototype.evaluate = function (scope) {
        return this.fnc.evaluate(scope).apply(void 0, this.args.evaluate(scope));
    };
    return FunctionCallNode;
}());
var FunctionArgumentNode = /** @class */ (function () {
    function FunctionArgumentNode(args) {
        this.args = args;
    }
    FunctionArgumentNode.prototype.evaluate = function (scope) {
        var values = [];
        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
            var arg = _a[_i];
            values.push(arg.evaluate(scope));
        }
        return values;
    };
    return FunctionArgumentNode;
}());
var ScopeMemberNode = /** @class */ (function () {
    function ScopeMemberNode(scope, name) {
        this.scope = scope;
        this.name = name;
    }
    ScopeMemberNode.prototype.evaluate = function (scope) {
        var parent = this.scope.evaluate(scope);
        if (!parent)
            throw Error("Cannot access " + this.name.evaluate(scope) + " of undefined.");
        return parent.get(this.name.evaluate(scope));
    };
    return ScopeMemberNode;
}());
var RootScopeMemberNode = /** @class */ (function () {
    function RootScopeMemberNode(name) {
        this.name = name;
    }
    RootScopeMemberNode.prototype.evaluate = function (scope) {
        return scope.get(this.name.evaluate(scope));
    };
    return RootScopeMemberNode;
}());
var AssignmentNode = /** @class */ (function () {
    function AssignmentNode(rootNode, toAssign) {
        this.rootNode = rootNode;
        this.toAssign = toAssign;
    }
    AssignmentNode.prototype.evaluate = function (scope) {
        var name = this.rootNode.name.evaluate(scope);
        var value = this.toAssign.evaluate(scope);
        scope.set(name, value);
        if (scope.get(name) !== value)
            throw Error("System Error: Failed to assign " + name + " to " + value);
        return value;
    };
    AssignmentNode.parse = function (lastNode, token, tokens) {
        if (!(lastNode instanceof RootScopeMemberNode) && !(lastNode instanceof ScopeMemberNode))
            throw SyntaxError('Invalid assignment syntax.');
        tokens.splice(0, 1); // consume =
        var assignmentTokens = Tree.getNextStatmentTokens(tokens);
        return new AssignmentNode(lastNode, Tree.processTokens(assignmentTokens));
    };
    return AssignmentNode;
}());
var Tree = /** @class */ (function () {
    function Tree(code) {
        this.code = code;
        this.parse();
    }
    Tree.prototype.parse = function () {
        var tokens = tokenize(this.code);
        this.rootNode = Tree.processTokens(tokens);
    };
    Tree.prototype.evaluate = function (scope) {
        return this.rootNode.evaluate(scope);
    };
    Tree.stripWhiteSpace = function (tokens) {
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].type === TokenType.WHITESPACE) {
                tokens.splice(i, 1);
                i--;
            }
        }
        return tokens;
    };
    Tree.processTokens = function (tokens) {
        var blockNodes = [];
        var node = null;
        var count = 0;
        Tree.stripWhiteSpace(tokens);
        while (tokens.length > 0) {
            count++;
            if (count > 1000)
                break; // Limit to 1000 iterations while in development
            if (tokens[0].type === TokenType.RETURN)
                tokens.splice(0, 1);
            var token = tokens[0];
            if (token.type === TokenType.NAME) {
                node = new RootScopeMemberNode(new LiteralNode(token.value));
                tokens.splice(0, 1);
            }
            else if (token.type === TokenType.ASSIGN) {
                node = AssignmentNode.parse(node, token, tokens);
            }
            else if (token.type === TokenType.IF) {
                node = IfStatementNode.parse(node, token, tokens);
            }
            else if (token.type === TokenType.STRING_LITERAL) {
                node = new LiteralNode(token.value);
                tokens.splice(0, 1);
            }
            else if (token.type === TokenType.NUMBER_LITERAL) {
                node = new NumberLiteralNode(token.value);
                tokens.splice(0, 1);
            }
            else if (token.type === TokenType.PERIOD && tokens[1].type === TokenType.NAME) {
                node = new ScopeMemberNode(node, new LiteralNode(tokens[1].value));
                tokens.splice(0, 2);
            }
            else if (tokens[0].type === TokenType.L_PAREN) {
                var funcArgs = Tree.getBlockTokens(tokens);
                var nodes = [];
                for (var _i = 0, funcArgs_1 = funcArgs; _i < funcArgs_1.length; _i++) {
                    var arg = funcArgs_1[_i];
                    nodes.push(Tree.processTokens(arg));
                }
                node = new FunctionCallNode(node, // Previous node should be a NAME
                new FunctionArgumentNode(nodes));
            }
            else if (tokens[0].type === TokenType.SEMI_COLON) {
                if (node) {
                    blockNodes.push(node);
                }
                node = null;
                tokens.splice(0, 1);
            }
            else if (ComparisonNode.match(tokens)) {
                node = ComparisonNode.parse(node, token, tokens);
            }
            else if (ArithmeticNode.match(tokens)) {
                node = ArithmeticNode.parse(node, token, tokens);
            }
            else if (tokens[0].type === TokenType.WHITESPACE) {
                tokens.splice(0, 1);
            }
            else if (tokens[0].type === TokenType.BOOLEAN_LITERAL) {
                node = new BooleanLiteralNode(tokens[0].value);
                tokens.splice(0, 1);
            }
            else if (tokens[0].type === TokenType.NULL_LITERAL) {
                node = new LiteralNode(null);
                tokens.splice(0, 1);
            }
            else {
                var code = Tree.toCode(tokens, 10);
                throw Error("Syntax Error. Near " + code);
            }
        }
        if (node) {
            blockNodes.push(node);
        }
        return new BlockNode(blockNodes);
    };
    Tree.toCode = function (tokens, limit) {
        var code = '';
        limit = limit || tokens.length;
        for (var i = 0; i < limit; i++) {
            if (!tokens[i])
                break;
            code += tokens[i].value;
        }
        return code;
    };
    Tree.getNextStatmentTokens = function (tokens) {
        var statementTokens = [];
        // Consume opening block
        if ([
            TokenType.L_BRACKET,
            TokenType.L_BRACE,
            TokenType.L_PAREN
        ].indexOf(tokens[0].type) > -1) {
            tokens.splice(0, 1);
        }
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
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
    };
    Tree.getBlockTokens = function (tokens, blockType) {
        if (blockType === void 0) { blockType = BlockType.PAREN; }
        var open = TokenType.L_PAREN;
        var close = TokenType.R_PAREN;
        var closeSymbol = ')';
        switch (blockType) {
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
        var openBlocks = 0;
        var args = [];
        var arg = [];
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === open) {
                openBlocks += 1;
                if (openBlocks > 1)
                    arg.push(token);
            }
            else if (token.type === close) {
                openBlocks -= 1;
                if (openBlocks > 0)
                    arg.push(token);
            }
            else if (token.type === TokenType.COMMA && openBlocks == 1) {
                args.push(arg);
                arg = [];
            }
            else if (token.type !== TokenType.WHITESPACE) {
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
        throw Error("Invalid Syntax, missing " + closeSymbol);
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=ast.js.map