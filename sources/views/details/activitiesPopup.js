import {JetView} from "webix-jet";

import activitiesData from "../../models/activitiesData";
import activitiesTypeData from "../../models/activitiesTypeData";
import contactsData from "../../models/contactsData";

export default class ActivitiesPopup extends JetView {
	constructor(app, name, buttonName, rowID) {
		super(app);
		this.name = name;
		this.rowID = rowID;
		this.buttonName = buttonName;
	}

	config() {
		return {
			view: "popup",
			position: "center",
			body: {
				rows: [
					{view: "template", template: `${this.name} activity`, type: "header", css: "text-align"},
					{
						view: "form",
						localId: "formInPopup",
						elements: [
							{
								view: "text",
								label: "Details",
								name: "Details"
							},
							{
								view: "combo",
								label: "Type",
								name: "TypeID",
								options: activitiesTypeData,
								required: true
							},
							{
								view: "combo",
								label: "Contact",
								name: "ContactID",
								options: contactsData,
								required: true
							},
							{
								view: "datepicker",
								label: "Date",
								timepicker: true,
								name: "dateObj",
								required: true
							},
							{
								view: "checkbox",
								label: "Confirmed",
								name: "State"
							}
						]
					},
					{
						view: "button",
						value: `${this.buttonName}`,
						click: () => {
							const form = this.$getForm();
							const values = this.getFormData();
							if (form.validate() && this.name === "Edit") {
								activitiesData.updateItem(this.rowID, values);
								this.clearForm();
								this.closeWindow();
							}
							else if (form.isDirty() && form.validate()) {
								activitiesData.add(values);
								this.clearForm();
								this.hideWindow();
							}
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							if (this.name === "Edit") {
								this.clearForm();
								this.closeWindow();
							}
							else {
								this.clearForm();
								this.hideWindow();
							}
						}
					}
				]
			}
		};
	}

	$getForm() {
		return this.$$("formInPopup");
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}

	closeWindow() {
		this.getRoot().close();
	}

	clearForm() {
		this.$getForm().clear();
		this.$getForm().clearValidation();
	}

	init() {
		if (this.name === "Edit") {
			this.$getForm().setValues(activitiesData.getItem(this.rowID));
		}
	}

	getFormData() {
		const dataObj = this.$getForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		dataObj.DueDate = formatDate(dataObj.dateObj);
		return dataObj;
	}
}
