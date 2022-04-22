import { JetView } from "webix-jet";
import contactsData from "../../models/contactsData";
import ContactsButton from "./contactsButton";
import ContactsLabel from "./contactsLabel";

export default class ContactsTemplate extends JetView {
    config() {
        return {
            view: "toolbar",
            localId: "contactsTemplate",
            rows: [
                {
                    cols: [
                        new ContactsLabel(this.app, "FirstName", "FirstName", true, "margin-right"),
                        new ContactsLabel(this.app, "LastName", "LastName"),
                        new ContactsButton(this.app, "<span class='fas fa-trash'></span> Delete", "webix_primary", true),
                        new ContactsButton(this.app, "<span class='fas fa-pen'></span> Edit", "webix_primary", true)
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
                                new ContactsLabel(this.app, "Status", "StatusID", false, "text-align")
                            ]
                        },
                        {
                            rows: [
                                new ContactsLabel(this.app, "Email", "Email", false, "text-align"),
                                new ContactsLabel(this.app, "Skype", "Skype", false, "text-align"),
                                new ContactsLabel(this.app, "Job", "Job", false, "text-align"),
                                new ContactsLabel(this.app, "Company", "Company", false, "text-align")
                            ]
                        },
                        {
                            rows: [
                                new ContactsLabel(this.app, "Birthday", "Birthday", false, "text-align"),
                                new ContactsLabel(this.app, "Address", "Address", false, "text-align")
                            ]
                        }
                    ]
                },
                {}
            ]
        }
    }
    $getContactsTemplate() {
        return this.$$("contactsTemplate")
    }
    urlChange() {
        const contactId = this.getParam("id");
        contactsData.waitData.then(() => {
            if (contactId) {
                this.$getContactsTemplate().parse(contactsData.getItem(contactId));
            }
        })
    }
}