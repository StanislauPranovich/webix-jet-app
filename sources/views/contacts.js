import {JetView} from "webix-jet";

import contactsData from "../models/contactsData";
import statusesData from "../models/statusesData";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
		return {
			cols: [
				{
					rows: [
						{
							view: "text",
							placeholder: _("Type to find contacts"),
							localId: "listFilter",
							css: "list_filter"
						},
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
							value: `<span class='fas fa-plus'></span> ${_("Add Contact")}`,
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

	$getListFilter() {
		return this.$$("listFilter");
	}

	init() {
		const listOfContacts = this.$getListOfContacts();
		const listFilter = this.$getListFilter();
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
		this.on(listFilter, "onTimedKeyPress", () => {
			const text = listFilter.getValue().toLowerCase().trim();
			if (text) {
				listOfContacts.filter((obj) => {
					let contactTextValues = [];
					for (let item in obj) {
						if (!Number(obj[item]) && item !== "Photo" && item !== "Birthday" && item !== "StartDate") {
							contactTextValues.push(obj[item]);
						}
					}
					const status = statusesData.getItem(obj.StatusID);
					let filter = [contactTextValues, status ? status.value : "No Status"].join("|");
					filter = filter.toLowerCase();
					if (text.includes("=") || text.includes(">") || text.includes("<")) {
						const birthdayDate = parseInt(obj.Birthday);
						const equalsBirthday = parseInt(text.replace("=", ""));
						const lessThanBirthday = parseInt(text.replace(">", ""));
						const moreThanBirthday = parseInt(text.replace("<", ""));
						if (text.includes("=")) {
							if (birthdayDate === equalsBirthday) {
								return birthdayDate;
							}
						}
						else if (text.includes(">")) {
							if (birthdayDate > lessThanBirthday) {
								return birthdayDate;
							}
						}
						else if (text.includes("<")) {
							if (birthdayDate < moreThanBirthday) {
								return birthdayDate;
							}
						}
					}
					else {
						return filter.indexOf(text) !== -1;
					}
					return undefined;
				});
			}
			else {
				listOfContacts.filter();
			}
		});
	}
}
