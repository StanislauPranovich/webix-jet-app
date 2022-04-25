import {JetView} from "webix-jet";

import activitiesData from "../../models/activitiesData";
import activitiesTypeData from "../../models/activitiesTypeData";
import contactsData from "../../models/contactsData";

export default class ActivitiesPopup extends JetView {
	constructor(app, name, buttonName) {
		super(app);
		this.name = name;
		this.buttonName = buttonName;
	}

	config() {
		return {
			view: "popup",
			position: "center",
			body: {
				rows: [
					{view: "template", template: `${this.name} activity`, type: "header", css: "text-align-center"},
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
							if (form.validate()) {
								if (this.name === "Edit") {
									activitiesData.updateItem(this.rowID, values);
								}
								else {
									activitiesData.add(values);
								}
								this.clearForm();
							}
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							this.clearForm();
						}
					}
				]
			}
		};
	}

	$getForm() {
		return this.$$("formInPopup");
	}

	showWindow(id) {
        const form = this.$getForm();
		this.rowID = id;
		form.show();
		if (this.name === "Edit") {
			form.setValues(activitiesData.getItem(this.rowID));
		}
	}

	clearForm() {
        const form = this.$getForm();
		form.clear();
		form.clearValidation();
		form.hide();
	}

	getFormData() {
		const dataObj = this.$getForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		dataObj.DueDate = formatDate(dataObj.dateObj);
		return dataObj;
	}
}
