import { JetView } from "webix-jet";

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
					template: obj => `
						<div class="contactsInfo">
							<div class="contactsInfoFirstColumn">
								<img class="contactsInfoPhoto" src=${obj.Photo}  />
								<p>${statusesData.getItem(obj.StatusID)?.value || "No Status"}</p>
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
						</div>`
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
				this.$getContactsHeader().parse(contactsData.getItem(contactId));
				this.$getContactsTemplate().parse(contactsData.getItem(contactId));
			}
		});
	}
}
