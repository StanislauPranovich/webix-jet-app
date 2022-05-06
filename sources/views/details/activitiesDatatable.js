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
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "tabbar",
					localId: "activitiesTabs",
					value: "all",
					options: [
						{
							id: "all",
							value: _("All")
						},
						{
							id: "overdue",
							value: _("Overdue")
						},
						{
							id: "completed",
							value: _("Completed")
						},
						{
							id: "today",
							value: _("Today")
						},
						{
							id: "tomorrow",
							value: _("Tomorrow")
						},
						{
							id: "thisWeek",
							value: _("This week")
						},
						{
							id: "thisMonth",
							value: _("This month")
						}
					]
				},
				{
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
							header: [_("Activity"), {content: "selectFilter"}],
							sort: "text",
							collection: activitiesTypeData,
							fillspace: true
						},
						{
							id: "dateObj",
							header: [_("Due date"), {content: "datepickerFilter", compare: compareDate}],
							sort: "date",
							fillspace: true,
							format: webix.Date.dateToStr("%Y-%m-%d %h:%i")
						},
						{
							id: "Details",
							header: [_("Details"), {content: "textFilter"}],
							sort: "string",
							fillspace: true
						},
						{
							id: "ContactID",
							header: [_("Contact"), {content: "selectFilter"}],
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
							const contactId = this.getParam("id");
							this.popup.showWindow(id, contactId);
							return false;
						},
						on_delete: (e, id) => {
							this.webix.confirm({
								title: _("Deleting an entry"),
								text: _("Do you want to delete entry?")
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
				}
			]
		};
	}

	$getActivitiesTable() {
		return this.$$("activitiesTable");
	}

	$getActivitiesTabs() {
		return this.$$("activitiesTabs");
	}

	init() {
		const table = this.$getActivitiesTable();
		const tabs = this.$getActivitiesTabs();
		const contactId = this.getParam("id");
		table.sync(activitiesData);
		this.on(activitiesData.data, "onStoreUpdated", () => {
			table.filterByAll();
		});
		this.popup = this.ui(new ActivitiesPopup(this.app, "Edit", "Save"));
		if (contactId) {
			table.hideColumn("ContactID");
			tabs.hide();
		}
		else {
			table.registerFilter(
				tabs,
				{
					columnId: "State",
					compare(value, filter, item) {
						const today = new Date();
						const format = webix.Date.dateToStr("%Y-%m-%d");
						const lastDayOfWeek = 7 - new Date(item.DueDate).getDay() +
							new Date(item.DueDate).getDate();
						const firstDayOfWeek = lastDayOfWeek - 6;
						switch (filter) {
							case "overdue":
								if (format(today) > format(item.DueDate) && value === "Open") {
									return value;
								}
								break;
							case "completed":
								return value === "Close";
							case "today":
								if (webix.Date.equal(format(item.DueDate), format(today))) {
									return value;
								}
								break;
							case "tomorrow":
								if (webix.Date.equal(format(item.DueDate),
									format(new Date(today.setDate(today.getDate() + 1))))) {
									return value;
								}
								break;
							case "thisWeek":
								if (lastDayOfWeek > today.getDate() && today.getDate() > firstDayOfWeek) {
									return value;
								}
								break;
							case "thisMonth":
								if (today.getMonth() === new Date(item.DueDate).getMonth()) {
									return value;
								}
								break;
							default:
								return value;
						}
						return undefined;
					}
				},
				{
					getValue(view) {
						return view.getValue();
					},
					setValue(view, value) {
						view.setValue(value);
					}
				}
			);
			this.on(tabs, "onChange", () => {
				table.filterByAll();
			});
		}
	}

	urlChange() {
		const contactId = this.getParam("id");
		const table = this.$getActivitiesTable();
		if (contactId) {
			table.filter(obj => `${obj.ContactID}` === contactId);
			table.filterByAll();
		}
	}
}
