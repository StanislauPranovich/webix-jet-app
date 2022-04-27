import {JetView} from "webix-jet";

import contactsData from "../../models/contactsData";
import statusesData from "../../models/statusesData";

export default class ContactsTemplate extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					localId: "contactsHeader",
					rows: [
						{
							cols: [
								this.createLabel("FirstName", "FirstName", "text-align-end"),
								this.createLabel("LastName", "LastName"),
								this.createButton("<span class='fas fa-trash'></span> Delete", "webix_primary", true),
								this.createButton("<span class='fas fa-pen'></span> Edit", "webix_primary", true)
							]
						}
					]
				},
				{
					localId: "contactsTemplate",
					template: (obj) => {
						const status = statusesData.getItem(obj.StatusID);
						const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
						return `
						<div class="contactsInfo">
							<div class="contactsInfoFirstColumn">
								<img class="contactsInfoPhoto" src=${obj.Photo || notFound} />
								<p>${status ? status.value : "No Status"}</p>
							</div>
							<div>
								<p><span class="fas fa-envelope"></span> ${obj.Email || "-"}</p>
								<p><span class="fab fa-skype"><span/> ${obj.Skype || "-"}</p>
								<p><span class="fas fa-briefcase"></span> ${obj.Job || "-"}</p>
								<p><span class="fas fa-building"></span> ${obj.Company || "-"}</p>
							</div>
							<div>
								<p><span class="fas fa-calendar"></span> ${obj.Birthday || "-"}</p>
								<p><span class="fas fa-compass"></span> ${obj.Address || "-"}</p>
							</div>
						</div>`;
					}
				}
			]
		};
	}

	$getContactsHeader() {
		return this.$$("contactsHeader");
	}

	$getContactsTemplate() {
		return this.$$("contactsTemplate");
	}

	createLabel(label, title, style) {
		return {
			view: "label",
			label,
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
				this.$getContactsHeader().parse(contactsData.getItem(contactId));
				this.$getContactsTemplate().parse(contactsData.getItem(contactId));
			}
		});
	}
}
