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
var Attribute_1 = require("../Attribute");
var ast_1 = require("../ast");
var If = /** @class */ (function (_super) {
    __extends(If, _super);
    function If() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    If.prototype.setup = function () {
        var statement = this.tag.rawAttributes['v-if'];
        this.tree = new ast_1.Tree(statement);
        this.tag.scope.bind('change', this.onChange.bind(this));
    };
    If.prototype.onChange = function () {
        var result = !!this.tree.evaluate(this.tag.scope);
        if (result)
            console.log('true');
        else
            console.log('false');
    };
    return If;
}(Attribute_1.Attribute));
exports.If = If;
//# sourceMappingURL=If.js.map