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
					view: "segmented",
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
					compare: this.compareActivities
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

	compareActivities(value, filter, item) {
		const today = webix.Date.dayStart(new Date());
		const dueDate = webix.Date.dayStart(item.DueDate);
		const firstDayOfWeek = webix.Date.add(webix.Date.weekStart(today), 1, "day", true);
		const lastDayOfWeek = webix.Date.add(firstDayOfWeek, 6, "day", true);
		switch (filter) {
			case "overdue":
				return today > dueDate && value === "Open";
			case "completed":
				return value === "Close";
			case "today":
				return webix.Date.equal(dueDate, today);
			case "tomorrow":
				return webix.Date.equal(dueDate,
					webix.Date.add(today, 1, "day", true));
			case "thisWeek":
				return lastDayOfWeek >= dueDate && firstDayOfWeek <= dueDate;
			case "thisMonth":
				return today.getMonth() === dueDate.getMonth() &&
						today.getFullYear() === dueDate.getFullYear();
			default:
				return value;
		}
	}
}
