import {JetView} from "webix-jet";

import ActivitiesPopup from "./activitiesPopup";

export default class ActivitiesToolbar extends JetView {
	config() {
		return {
			view: "toolbar",
			cols: [
				{gravity: 3},
				{
					view: "button",
					value: "<span class='fas fa-plus'></span> Add Activity",
					css: "webix_primary",
					click: (id) => {
						const contactId = this.getParam("id");
						this.popup.showWindow(id, contactId);
					}
				}
			]
		};
	}

	init() {
		this.popup = this.ui(new ActivitiesPopup(this.app, "Add", "Add"));
	}
}
