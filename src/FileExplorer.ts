import { TAbstractFile, TFolder } from 'obsidian';

class AbstractNode {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
}

class FileNode extends AbstractNode {
    constructor(name: string) {
        super(name);
    }
}

class FolderNode extends AbstractNode {
    children: AbstractNode[];
    
    constructor(name: string) {
        super(name);
        
        this.children = [];
    }
    
    public addChild(child: AbstractNode) {
        this.children.push(child);
    }
}

export class FileExplorer {
    files: TAbstractFile[];
    fileMap: Map<string, AbstractNode>;
    
    root: FolderNode;
    tree: any;
    
    constructor() {
        this.files = app.vault.getAllLoadedFiles();
        this.fileMap = new Map<string, AbstractNode>();
        
        this.root = this.getNode("/") as FolderNode;
        this.tree = this.buildTree(this.files[0], this.fileMap);
    }
    
    private buildTree(file: TAbstractFile, fileMap: Map<string, AbstractNode>) {
        const path = file.path;
        
        if (fileMap.has(path)) {
            return fileMap.get(path);
        }
        
        const node = file instanceof TFolder ? new FolderNode(file.name) : new FileNode(file.name);
        
        fileMap.set(path, node);
        
        if (file instanceof TFolder) {
            for (let child of file.children) {
                let childNode = this.buildTree(child, fileMap);
                
                if (childNode) {
                    (node as FolderNode).addChild(childNode);
                }
            }
        }
        
        return node;
    }

    private renderTree(node: AbstractNode): HTMLElement {
        const element = document.createElement("div");
        element.appendText(node.name);
        
        if (node instanceof FileNode) {
            element.classList.add("file");
        } else if (node instanceof FolderNode) {
            element.classList.add("folder");
        }
        
        if (node instanceof FolderNode) {
            for (const child of node.children) {
                const childElement = this.renderTree(child);
                element.appendChild(childElement);
            }
        }
        
        return element;
    }
    
    public getNode(path: string): AbstractNode | null {
        return this.fileMap.get(path) || null;
    }

    public getTree() {
        return this.renderTree(this.tree);
    }
}