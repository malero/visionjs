import {Attribute} from "../Attribute";
import {Tree} from "../ast";

export class Bind extends Attribute {
    protected tree: Tree;

    public set value(v: any) {
        this.tree.set(v, this.tag.scope);
    }

    public get value(): any {
        return this.tree.evaluate(this.tag.scope);
    }

    public setup(): void {
        this.tree = new Tree(this.tag.rawAttributes['v-bind']);

        if (!this.value)
            this.updateFrom();
        else
            this.updateTo();

        if (this.tag.isInput)
            this.tag.element.onkeyup = this.updateFrom.bind(this);
    }

    updateFrom() {
        if (this.tag.isInput) {
            this.value = (this.tag.element as any).value;
        } else {
            this.value = this.tag.element.innerText;
        }
    }

    updateTo() {
        if (this.tag.isInput) {
            (this.tag.element as any).value = this.value;
        } else {
            this.tag.element.innerText = this.value;
        }
    }
}
