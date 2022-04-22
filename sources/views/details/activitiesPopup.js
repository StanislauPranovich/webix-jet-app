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
								name: "DueDate",
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
							if (this.name === "Edit" && this.$getForm().validate()) {
								activitiesData.updateItem(this.rowID, this.getFormData());
								this.$getForm().clear();
								this.$getForm().clearValidation();
								this.hideWindow();
							}
							else if (this.$getForm().isDirty() && this.$getForm().validate()) {
								this.getFormData();
								this.addDataToCollection();
								this.$getForm().clear();
								this.$getForm().clearValidation();
								this.hideWindow();
							}
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							this.$getForm().clear();
							this.$getForm().clearValidation();
							this.hideWindow();
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

	init() {
		this.webix.promise.all([
			activitiesData.waitData,
			contactsData.waitData
		]).then(() => {
			this.$getForm().sync(activitiesData);
			this.$getForm().sync(contactsData);
		});
		if (this.name === "Edit") {
			this.$getForm().setValues(activitiesData.getItem(this.rowID));
		}
	}

	getFormData() {
		const dataObj = this.$getForm().getValues();
		dataObj.DueDate = `${`${dataObj.DueDate.getFullYear()}-${
			dataObj.DueDate.getMonth() + 1 < 10 ? `0${dataObj.DueDate.getMonth() + 1}` : dataObj.DueDate.getMonth() + 1
		}-${dataObj.DueDate.getDate() < 10 ? `0${dataObj.DueDate.getDate()}` : dataObj.DueDate.getDate()
		} ${dataObj.DueDate.getHours() < 10 ? `0${dataObj.DueDate.getHours()}` : dataObj.DueDate.getHours()}:${
			dataObj.DueDate.getMinutes() < 10 ? `0${dataObj.DueDate.getMinutes()}` : dataObj.DueDate.getMinutes()}`}`;
		return dataObj;
	}

	addDataToCollection() {
		activitiesData.add(this.getFormData());
	}
}
