import {JetView} from "webix-jet";

export default class ContactsLabel extends JetView {
	constructor(app, name, data, width, style) {
		super(app);
		this.label = name;
		this.title = data;
		this.width = width;
		this.style = style;
	}

	config() {
		return {
			view: "label",
			label: this.label,
			name: this.title,
			autowidth: this.width,
			css: this.style
		};
	}
}
