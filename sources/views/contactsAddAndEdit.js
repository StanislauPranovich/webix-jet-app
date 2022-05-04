import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";
import statusesData from "../models/statusesData";


export default class ContactsAddAndEdit extends JetView {
	config() {
		const formToolbar = {
			view: "toolbar",
			borderless: true,
			cols: [
				{gravity: 3},
				{
					view: "button",
					value: "Cancel",
					css: "webix_primary",
					click: () => {
						this.clearForm();
						const form = this.$getContactsForm();
						if (this.contactId) {
							this.show(`contactsTemplate?id=${this.contactId}`);
						}
						else if (contactsData.count() === 0) {
							form.hide();
							this.show("emptyView");
						}
						else {
							this.show(`contactsTemplate?id=${contactsData.getFirstId()}`);
						}
					}
				},
				{
					view: "button",
					value: `${this.getParam("id") ? "Save" : "Add"}`,
					css: "webix_primary",
					click: () => {
						const form = this.$getContactsForm();
						const values = this.getFormData();
						if (form.validate()) {
							if (this.contactId) {
								values.Photo = this.$$("upload").getValues().photo;
								values.value = `${values.FirstName} ${values.LastName}`;
								contactsData.updateItem(this.contactId, values);
								this.show(`contactsTemplate?id=${this.contactId}`);
							}
							else {
								contactsData.waitSave(() => {
									values.Photo = this.$$("upload").getValues().photo;
									contactsData.add(values);
								}).then(() => {
									const lastElementId = contactsData.getLastId();
									this.show(`contactsTemplate?id=${lastElementId}`);
								});
							}
							this.clearForm();
						}
					}
				}
			]
		};

		const formPhoto = {
			cols: [
				{
					view: "template",
					localId: "upload",
					template: "<img class='contactsInfoPhoto' src=#photo# />",
					borderless: true
				},
				{
					rows: [
						{},
						{
							view: "uploader",
							accept: "image/png, image/gif, image/jpeg",
							apiOnly: true,
							multiple: false,
							value: "Change photo",
							autosend: false,
							on: {
								onBeforeFileAdd: (item) => {
									const reader = new FileReader();
									const file = item.file;
									reader.onloadend = () => {
										this.$$("upload").setValues({
											photo: reader.result
										});
									};
									if (file) {
										reader.readAsDataURL(file);
									}
								}
							}
						},
						{
							view: "button",
							value: "Delete photo",
							css: "webix_primary",
							click: () => {
								this.$$("upload").setValues({
									photo: ""
								});
							}
						}
					]
				}
			]
		};

		const formLeftColumn = {
			rows: [
				{
					view: "text",
					label: "Firstname",
					name: "FirstName",
					required: true
				},
				{
					view: "text",
					label: "Lastname",
					name: "LastName",
					required: true
				},
				{
					view: "datepicker",
					label: "Joining",
					name: "dayOfStart",
					required: true
				},
				{
					view: "combo",
					label: "Status",
					name: "StatusID",
					options: statusesData,
					required: true
				},
				{
					view: "text",
					label: "Job",
					name: "Job",
					required: true
				},
				{
					view: "text",
					label: "Company",
					name: "Company",
					required: true
				},
				{
					view: "text",
					label: "Website",
					name: "Website",
					required: true
				},
				{
					view: "text",
					label: "Address",
					name: "Address",
					required: true
				}
			]
		};

		const formRightColumn = {
			rows: [
				{
					view: "text",
					label: "Email",
					name: "Email",
					required: true,
					validate: webix.rules.isEmail
				},
				{
					view: "text",
					label: "Skype",
					name: "Skype",
					required: true
				},
				{
					view: "text",
					label: "Phone",
					name: "Phone",
					required: true,
					validate: webix.rules.isNumber
				},
				{
					view: "datepicker",
					label: "Birthday",
					name: "dayOfBirth",
					required: true
				},
				formPhoto
			]
		};

		return {
			cols: [
				{
					view: "form",
					localId: "contactsForm",
					elements: [
						{
							template: `${this.getParam("id") ? "Edit" : "Add new"} Contact`,
							type: "section"
						},
						{
							cols: [
								formLeftColumn,
								formRightColumn
							]
						},
						{},
						formToolbar
					]
				}
			]
		};
	}

	$getContactsForm() {
		return this.$$("contactsForm");
	}

	clearForm() {
		this.$getContactsForm().clear();
		this.$getContactsForm().clearValidation();
	}

	getFormData() {
		const dataObj = this.$getContactsForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		dataObj.StartDate = formatDate(dataObj.dayOfStart);
		dataObj.Birthday = formatDate(dataObj.dayOfBirth);
		return dataObj;
	}

	init() {
		this.contactId = this.getParam("id");
		this.notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
		const form = this.$getContactsForm();
		contactsData.waitData.then(() => {
			if (this.contactId) {
				form.setValues(contactsData.getItem(this.contactId));
			}
		});
		if (this.contactId === undefined) {
			this.$$("upload").setValues({
				photo: this.notFound
			});
		}
		else {
			this.$$("upload").setValues({
				photo: contactsData.getItem(this.contactId).Photo || this.notFound
			});
		}
	}
}
