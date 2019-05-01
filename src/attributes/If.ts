import {Attribute} from "../Attribute";
import {Tree} from "../ast";

export class If extends Attribute {
    protected tree: Tree;

    public setup(): void {
        const statement: string = this.tag.rawAttributes['v-if'];
        this.tree = new Tree(statement);
        this.tag.scope.bind('change', this.onChange.bind(this));
    }

    onChange() {
        const result: boolean = !!this.tree.evaluate(this.tag.scope);
        if (result)
            console.log('true');
        else
            console.log('false');
    }
}
