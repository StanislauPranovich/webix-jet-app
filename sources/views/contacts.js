import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";


export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [
						{
							view: "list",
							localId: "listOfContacts",
							template: obj => `
								<div class="ellipsis"><span class='fas fa-user'></span>${obj.FirstName} ${obj.LastName} <div class='company_name'>${obj.Company}</div></div>
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
	}
}
