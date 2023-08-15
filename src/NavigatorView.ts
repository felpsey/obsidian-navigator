import { 
    ItemView,
    WorkspaceLeaf,
    Menu,
} from 'obsidian';

import { FileExplorer } from './FileExplorer';

export const VIEW_TYPE_NAVIGATOR = "navigator";

export class NavigatorView extends ItemView {
    constructor (leaf: WorkspaceLeaf) {
        super(leaf);

        this.icon = "compass"
    }

    getViewType() {
        return VIEW_TYPE_NAVIGATOR;
    }
    
    getDisplayText() {
        return "Navigator";
    }

    // Override tab-header right click
    onPaneMenu(menu: Menu, source: 'more-options' | 'tab-header') : void {
        console.log("Right click");
    }

    async onOpen() {
        const container = this.containerEl.children[1];

        container.empty();
        
        let fileList = container.createEl("div")
        fileList.addClass("navigator-files-container")

        let fileExplorer = new FileExplorer;

        let fileExplorerElements = fileExplorer.getTree();

        fileList.appendChild(fileExplorerElements);
    }
    
    // Re-open on close
    async onClose() {
		await this.app.workspace.getLeftLeaf(false).setViewState({
			type: VIEW_TYPE_NAVIGATOR,
			active: true,
		});
    }
}