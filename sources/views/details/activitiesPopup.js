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
					{
						view: "template",
						template: `${this.name} activity`,
						type: "header",
						css: "text_align_center"
					},
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
								localId: "ContactID",
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
								name: "State",
								checkValue: "Close",
								uncheckValue: "Open"
							}
						]
					},
					{
						view: "button",
						value: `${this.buttonName}`,
						css: "webix_primary",
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
						css: "webix_primary",
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

	showWindow(rowId, contactId) {
		this.rowID = rowId;
		const ContactID = this.$$("ContactID");
		if (contactId) {
			ContactID.setValue(contactId);
			ContactID.disable();
		}
		this.getRoot().show();
		if (this.name === "Edit") {
			this.$getForm().setValues(activitiesData.getItem(this.rowID));
		}
	}

	clearForm() {
		this.$getForm().clear();
		this.$getForm().clearValidation();
		this.getRoot().hide();
	}

	getFormData() {
		const dataObj = this.$getForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		dataObj.DueDate = formatDate(dataObj.dateObj);
		return dataObj;
	}
}
