import {JetView} from "webix-jet";

import activitiesData from "../../models/activitiesData";
import activitiesTypeData from "../../models/activitiesTypeData";
import contactsData from "../../models/contactsData";
import ActivitiesPopup from "./activitiesPopup";


const compareDate = (value, filter) => {
	const formatDate = webix.Date.dateToStr("%Y-%m-%d");
	return formatDate(value) === formatDate(filter);
};

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
					checkValue: "1",
					uncheckValue: "0"
				},
				{
					id: "TypeID",
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
					template: "<span class='fas fa-pen'></span>"
				},
				{
					id: "delete",
					header: "",
					template: "<span class='fas fa-trash'></span>"
				}
			],
			onClick: {
				"fa-pen": (e, id) => {
					this.popup = this.ui(new ActivitiesPopup(this.app, "Edit", "Save", id));
					this.popup.showWindow();
					return false;
				},
				"fa-trash": (e, id) => {
					this.webix.confirm({
						title: "Deleting an entry",
						text: "Do you want to delete entry?"
					}).then(() => {
						activitiesData.remove(id);
						return false;
					});
				}
			}
		};
	}

	$getActivitiesTable() {
		return this.$$("activitiesTable");
	}

	init() {
		this.$getActivitiesTable().sync(activitiesData);
        this.on(activitiesData.data, "onStoreUpdated", ()=> {
            this.$getActivitiesTable().filterByAll();
        })
	}
}
