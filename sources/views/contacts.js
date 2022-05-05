import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";


export default class ContactsView extends JetView {
	config() {
		const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
		return {
			cols: [
				{
					rows: [
						{
							view: "list",
							localId: "listOfContacts",
							template: obj => `
								<div class="ellipsis"><img class="list_photo" src="${obj.Photo || notFound}" width="20px" height="20px"></img>${obj.FirstName} ${obj.LastName} <div class='company_name'>${obj.Company}</div></div>
								`,
							select: true,
							type: {
								height: 43,
								width: 200
							}
						},
						{
							view: "button",
							localId: "addButton",
							value: "<span class='fas fa-plus'></span> Add Contact",
							css: "webix_primary",
							click: () => {
								this.show("contactsAddAndEdit");
							}
						}
					]
				},
				{$subview: true}
			]
		};
	}

	$getListOfContacts() {
		return this.$$("listOfContacts");
	}

	init() {
		const listOfContacts = this.$getListOfContacts();
		listOfContacts.parse(contactsData);
		this.on(listOfContacts, "onAfterSelect", (id) => {
			this.show(`contactsTemplate?id=${id}`);
		});
		this.on(contactsData.data, "onAfterDelete", () => {
			listOfContacts.select(listOfContacts.getFirstId());
		});
		contactsData.waitData.then(() => {
			listOfContacts.select(listOfContacts.getFirstId());
		});
		this.on(contactsData.data, "onStoreUpdated", () => {
			if (contactsData.count() === 0) {
				this.show("emptyView");
			}
		});
		this.on(this.app, "onAfterContactAdd", (id) => {
			listOfContacts.select(id);
		});
		this.on(this.app, "onAfterCancelAdd", (id) => {
			listOfContacts.select(id);
		});
	}
}
