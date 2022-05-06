import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";
import statusesData from "../models/statusesData";


export default class ContactsAddAndEdit extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
		const formToolbar = {
			view: "toolbar",
			borderless: true,
			cols: [
				{gravity: 3},
				{
					view: "button",
					value: _("Cancel"),
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
					value: `${this.getParam("id") ? _("Save") : _("Add")}`,
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
							value: _("Change photo"),
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
							value: _("Delete photo"),
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
					label: _("Firstname"),
					name: "FirstName",
					required: true
				},
				{
					view: "text",
					label: _("Lastname"),
					name: "LastName",
					required: true
				},
				{
					view: "datepicker",
					label: _("Joining"),
					name: "dayOfStart",
					required: true
				},
				{
					view: "combo",
					label: _("Status"),
					name: "StatusID",
					options: statusesData,
					required: true
				},
				{
					view: "text",
					label: _("Job"),
					name: "Job",
					required: true
				},
				{
					view: "text",
					label: _("Company"),
					name: "Company",
					required: true
				},
				{
					view: "text",
					label: _("Website"),
					name: "Website",
					required: true
				},
				{
					view: "text",
					label: _("Address"),
					name: "Address",
					required: true
				}
			]
		};

		const formRightColumn = {
			rows: [
				{
					view: "text",
					label: _("Email"),
					name: "Email",
					required: true,
					validate: webix.rules.isEmail
				},
				{
					view: "text",
					label: _("Skype"),
					name: "Skype",
					required: true
				},
				{
					view: "text",
					label: _("Phone"),
					name: "Phone",
					required: true,
					validate: webix.rules.isNumber
				},
				{
					view: "datepicker",
					label: _("Birthday"),
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
					elementsConfig: {
						labelWidth: 125
					},
					elements: [
						{
							template: `${this.getParam("id") ? _("Edit contact") : _("Add new contact")}`,
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
