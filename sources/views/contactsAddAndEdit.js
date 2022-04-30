import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";
import statusesData from "../models/statusesData";


export default class ContactsAddAndEdit extends JetView {
	config() {
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
								{
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
								},
								{
									rows: [
										{
											view: "text",
											label: "Email",
											name: "Email",
											required: true
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
											required: true
										},
										{
											view: "datepicker",
											label: "Birthday",
											name: "dayOfBirth",
											required: true
										},
										{
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
																	photo: this.notFound
																});
															}
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{},
						{
							view: "toolbar",
							borderless: true,
							cols: [
								{gravity: 3},
								{
									view: "button",
									value: "Cancel",
									css: "webix_primary",
									click: () => {
										const contactId = this.getParam("id");
										this.clearForm();
										if (contactId) {
											this.show(`contactsTemplate?id=${contactId}`);
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
										const contactId = this.getParam("id");
										if (form.validate()) {
											if (contactId) {
												this.getFormData();
												contactsData.updateItem(contactId, this.getFormData());
											}
											else {
												contactsData.add(values);
											}
											this.clearForm();
											this.show(`contactsTemplate?id=${contactsData.getFirstId()}`);
										}
									}
								}
							]
						}
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
		const contactId = this.getParam("id");
		this.notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
		const form = this.$getContactsForm();
		contactsData.waitData.then(() => {
			if (contactId) {
				form.setValues(contactsData.getItem(contactId));
			}
		});
		this.on(contactsData.data, "onStoreUpdated", () => {
			this.show(`contactsTemplate?id=${contactsData.getItem(contactsData.getFirstId())}`);
		});
		this.$$("upload").setValues({
			photo: this.notFound
		});
	}
}
