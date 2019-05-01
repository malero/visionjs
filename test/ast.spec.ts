import {Scope} from "../src/Scope";
import {Tree} from "../src/ast";


describe('Tree', () => {
    let scope: Scope = null,
        scope2: Scope = null;

    beforeEach(() => {
        scope = new Scope();
        scope2 = new Scope();
        scope.set('foo', 2);
        scope.set('bar', 3);
        scope.set('baz', scope2);
        scope2.set('add', (a, b) => {
            return a + b;
        });

        scope2.set('generate', (a, b) => {
            const _scope: Scope = new Scope();
            _scope.set(a, b);
            return _scope;
        });
    });

    it("should evaluate scope variables correctly", () => {
        let tree: Tree = new Tree('foo');
        expect(tree.evaluate(scope)).toBe(2);

        tree = new Tree('bar');
        expect(tree.evaluate(scope)).toBe(3);
    });

    it("should be able to call functions within the scope", () => {
        const tree: Tree = new Tree('baz.add(foo, bar)');
        expect(tree.evaluate(scope)).toBe(5);

        tree.parse();
        scope.set('foo', 15);
        scope.set('bar', 33);
        expect(tree.evaluate(scope)).toBe(48);
    });

    it("should be able to call functions with literals", () => {
        let tree: Tree = new Tree('baz.add(foo, 5)');
        expect(tree.evaluate(scope)).toBe(7);

        tree.parse();
        scope.set('foo', 15);
        expect(tree.evaluate(scope)).toBe(20);

        tree.parse();
        tree = new Tree('baz.add(100, 5)');
        expect(tree.evaluate(scope)).toBe(105);
    });

    it("should be able to call member variable of value returned from function call", () => {
        const tree: Tree = new Tree('baz.generate("test", foo).test');
        expect(tree.evaluate(scope)).toBe(2);

        tree.parse();
        scope.set('foo', 15);
        expect(tree.evaluate(scope)).toBe(15);
    });

    it("should be able to call nested functions within the scope", () => {
        const tree: Tree = new Tree('baz.add(baz.add(foo, foo), baz.add(bar, bar))');
        expect(tree.evaluate(scope)).toBe(10);

        tree.parse();
        scope.set('foo', 15);
        scope.set('bar', 33);
        expect(tree.evaluate(scope)).toBe(96);
    });

    it("should be able to execute multiple statments properly", () => {
        const tree: Tree = new Tree(`
            1;
            2;
            baz.add(100, 5);
            5;
        `);
        expect(tree.evaluate(scope)).toBe(5);
    });

    it("should be able to compare properly", () => {
        let tree: Tree = new Tree(`1!='1'`);
        expect(tree.evaluate(scope)).toBe(true);
        tree = new Tree(`1==1`);
        expect(tree.evaluate(scope)).toBe(true);
        tree = new Tree(`1>1`);
        expect(tree.evaluate(scope)).toBe(false);
        tree = new Tree(`2>1`);
        expect(tree.evaluate(scope)).toBe(true);
    });

    it("should be able to execute if statements properly", () => {
        let tree: Tree = new Tree('if (true) { return true; } else { return false; }');
        expect(tree.evaluate(scope)).toBe(true);
        tree = new Tree('if (false) { return true; } else { return false; }');
        expect(tree.evaluate(scope)).toBe(false);
        tree = new Tree('if (false) { return true; } else if (true) { return 15; } else { return false; }');
        expect(tree.evaluate(scope)).toBe(15);
        const innerScope: Scope = new Scope();
        innerScope.wrap({method: () => { return 15; }});
        scope.set('test', innerScope);
        tree = new Tree(`
            if (false) {
                return true;
            } else if (test.method() == 15) {
                test.method() + 5;
                return test.method(); 
            } else {
                return false;
            }`);
        expect(tree.evaluate(scope)).toBe(15);
    });

    it("should be able to assign variables properly", () => {
        let tree: Tree = new Tree(`something = 5;return something;`);
        expect(tree.evaluate(scope)).toBe(5);
        expect(scope.get('something')).toBe(5);
    });

    it("should be able to execute basic arithmetic", () => {
        let tree: Tree = new Tree('5 + 3');
        expect(tree.evaluate(scope)).toBe(8);
        tree = new Tree('8 - 3');
        expect(tree.evaluate(scope)).toBe(5);
    });

    it("should be able to block properly with promiseees", () => {
        let tree: Tree = new Tree('5 + 3');
        expect(tree.evaluate(scope)).toBe(8);
        tree = new Tree('8 - 3');
        expect(tree.evaluate(scope)).toBe(5);
    });
});
