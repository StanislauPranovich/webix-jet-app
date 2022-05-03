import { JetView } from "webix-jet";

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
							template: "<span class='fas fa-user'></span>#FirstName# #LastName# <div class='company-name'>#Company#</div>",
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
								if (!this.getUrlString().includes("contactsAddAndEdit")) {
									this.show("contactsAddAndEdit");
								}
							}
						}
					]
				},
				{ $subview: true }
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
	}
	urlChange(view, url) {
		const listOfContacts = this.$getListOfContacts();
		if (url[1]) {
			if (url[1].params.id === `${contactsData.getLastId()}` || url[1].params.id === `${contactsData.getFirstId()}`) {
				listOfContacts.select(url[1].params.id);
			}
		}
	}
}
