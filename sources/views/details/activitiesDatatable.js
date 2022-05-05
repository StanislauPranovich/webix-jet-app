import {JetView} from "webix-jet";

import activitiesData from "../../models/activitiesData";
import activitiesTypeData from "../../models/activitiesTypeData";
import contactsData from "../../models/contactsData";
import ActivitiesPopup from "./activitiesPopup";

const compareDate = (value, filter) => webix.Date.equal(
	webix.Date.dayStart(value),
	webix.Date.dayStart(filter)
);

export default class ActivitiesDatatable extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "activitiesTable",
			editable: true,
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					editor: "checkbox",
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					localId: "type",
					header: ["Activity type", {content: "selectFilter"}],
					sort: "text",
					collection: activitiesTypeData
				},
				{
					id: "dateObj",
					header: ["Due date", {content: "datepickerFilter", compare: compareDate}],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%Y-%m-%d %h:%i")
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					sort: "string",
					fillspace: true
				},
				{
					id: "ContactID",
					header: ["Contact", {content: "selectFilter"}],
					sort: "text",
					collection: contactsData,
					fillspace: true
				},
				{
					id: "edit",
					header: "",
					template: "<span class='fas fa-pen on_edit'></span>"
				},
				{
					id: "delete",
					header: "",
					template: "<span class='fas fa-trash on_delete'></span>"
				}
			],
			onClick: {
				on_edit: (e, id) => {
					this.popup.showWindow(id);
					return false;
				},
				on_delete: (e, id) => {
					this.webix.confirm({
						title: "Deleting an entry",
						text: "Do you want to delete entry?"
					}).then(() => {
						activitiesData.remove(id);
					});
				}
			},
			on: {
				onAfterFilter() {
					const urlId = this.$scope.getParam("id");
					if (urlId) {
						this.filter(item => `${item.ContactID}` === urlId, "", true);
					}
				}
			}
		};
	}

	$getActivitiesTable() {
		return this.$$("activitiesTable");
	}

	init() {
		const table = this.$getActivitiesTable();
		const contactId = this.getParam("id");
		this.on(activitiesData.data, "onStoreUpdated", () => {
			table.filterByAll();
		});
		this.popup = this.ui(new ActivitiesPopup(this.app, "Edit", "Save"));
		if (contactId) {
			table.hideColumn("ContactID");
		}
		table.sync(activitiesData);
	}

	urlChange() {
		const contactId = this.getParam("id");
		const table = this.$getActivitiesTable();
		if (contactId) {
			this.on(activitiesData.data, "onStoreUpdated", () => {
				table.filter(obj => `${obj.ContactID}` === contactId);
			});
		}
		table.filterByAll();
	}
}
