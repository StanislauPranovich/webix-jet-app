import { JetView } from "webix-jet";

import contactsData from "../../models/contactsData";

export default class ContactsList extends JetView {
    config() {
        return {
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
                    localId: "kek",
                    value: "<span class='fas fa-plus'></span> Add Contact",
                    css: "webix_primary"
                }
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
            this.show(`contacts?id=${id}`);
        });
        listOfContacts.select(listOfContacts.getFirstId());
    }
    urlChange() {
        const contactId = this.getParam("id");
        const listOfContacts = this.$getListOfContacts();
        contactsData.waitData.then(() => {
            if (contactId) {
                listOfContacts.select(contactId);
            }
            else {
                listOfContacts.select(listOfContacts.getFirstId());
            }
        });
    }
}
