import { JetView } from "webix-jet";
import ContactsList from "./details/contactsList";
import ContactsTemplate from "./details/contactsTemplate";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				ContactsTemplate
			]
		}
	}
}
