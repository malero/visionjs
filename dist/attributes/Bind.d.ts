import { Attribute } from "../Attribute";
import { Tree } from "../ast";
export declare class Bind extends Attribute {
    protected tree: Tree;
    value: any;
    setup(): void;
    updateFrom(): void;
    updateTo(): void;
}
