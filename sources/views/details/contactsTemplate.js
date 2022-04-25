import { JetView } from "webix-jet";

import contactsData from "../../models/contactsData";
import statusesData from "../../models/statusesData";

export default class ContactsTemplate extends JetView {
	config() {
		return {
			view: "toolbar",
			localId: "contactsTemplate",
			rows: [
				{
					cols: [
						this.createLabel("FirstName", "FirstName", "text-align-end"),
						this.createLabel("LastName", "LastName"),
						this.createButton("<span class='fas fa-trash'></span> Delete", "webix_primary", true),
						this.createButton("<span class='fas fa-pen'></span> Edit", "webix_primary", true)
					]
				},
				{
					cols: [
						{
							rows: [
								{
									view: "template",
									name: "Photo",
									height: 150
								},
								this.createLabel("Status", "StatusID", "text-align-center", statusesData, "#Value#")
							]
						},
						{
							rows: [
								this.createLabel("Email", "Email", "text-align-center"),
								this.createLabel("Skype", "Skype", "text-align-center"),
								this.createLabel("Job", "Job", "text-align-center"),
								this.createLabel("Company", "Company", "text-align-center")
							]
						},
						{
							rows: [
								this.createLabel("Birthday", "Birthday", "text-align-center"),
								this.createLabel("Address", "Address", "text-align-center")
							]
						}
					]
				},
				{}
			]
		};
	}

	$getContactsTemplate() {
		return this.$$("contactsTemplate");
	}

	createLabel(label, title, style) {
		return {
			view: "label",
			label: label,
			name: title,
			css: style
		};
	}

	createButton(value, style, active) {
		return {
			view: "button",
			value,
			css: style,
			disabled: active
		};
	}

	urlChange() {
		const contactId = this.getParam("id");
		this.webix.promise.all([
			contactsData.waitData,
			statusesData.waitData
		]).then(() => {
			if (contactId) {
				this.$getContactsTemplate().parse(contactsData.getItem(contactId));
				contactsData.data.each(obj => {
					obj.StatusID = statusesData.getItem(obj.StatusID).value;
				})
			}
		})
	}
}
