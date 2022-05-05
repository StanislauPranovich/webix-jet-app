import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";
import statusesData from "../models/statusesData";


export default class ContactsAddAndEdit extends JetView {
	config() {
		const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
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
						const firstId = contactsData.getFirstId();
						const id = this.contactId || firstId;
						this.show(`contactsTemplate?id=${id}`);
						this.app.callEvent("onAfterCancelAdd", [id]);
					}
				},
				{
					view: "button",
					value: `${this.getParam("id") ? "Save" : "Add"}`,
					css: "webix_primary",
					click: () => {
						const form = this.$getContactsForm();
						if (form.validate()) {
							const values = this.getFormData();
							if (this.contactId) {
								values.Photo = this.$$("upload").getValues().Photo;
								values.value = `${values.FirstName} ${values.LastName}`;
								contactsData.updateItem(this.contactId, values);
								this.show(`contactsTemplate?id=${this.contactId}`);
							}
							else {
								contactsData.waitSave(() => {
									values.Photo = this.$$("upload").getValues().Photo;
									contactsData.add(values);
								}).then((obj) => {
									this.show(`contactsTemplate?id=${obj.id}`);
									this.app.callEvent("onAfterContactAdd", [obj.id]);
								});
							}
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
					template: obj => `<img class='contacts_info_photo' src="${obj.Photo || notFound}" />`,
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
											Photo: reader.result
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
									Photo: ""
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
					required: true,
					labelWidth: 85
				},
				{
					view: "text",
					label: "Lastname",
					name: "LastName",
					required: true,
					labelWidth: 85
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
		const formValues = this.$getContactsForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		formValues.StartDate = formatDate(formValues.dayOfStart);
		formValues.Birthday = formatDate(formValues.dayOfBirth);
		return formValues;
	}

	init() {
		this.contactId = this.getParam("id");
		const form = this.$getContactsForm();
		contactsData.waitData.then(() => {
			if (this.contactId) {
				const contactsItem = contactsData.getItem(this.contactId);
				form.setValues(contactsItem);
				this.$$("upload").parse(contactsItem);
			}
		});
	}
}
