import { Plugin } from "obsidian";

import { NavigatorView, VIEW_TYPE_NAVIGATOR } from "src/NavigatorView";

export default class NavigatorPlugin extends Plugin {
	async onload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_NAVIGATOR);
		
		this.registerView(VIEW_TYPE_NAVIGATOR, (leaf) => new NavigatorView(leaf));

		await this.app.workspace.getLeftLeaf(false).setViewState({
			type: VIEW_TYPE_NAVIGATOR,
			active: true,
		});
	}
}