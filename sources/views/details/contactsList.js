import { JetView } from "webix-jet";
import contactsData from "../../models/contactsData";

export default class ContactsList extends JetView {
    config() {
        return {
            view: "list",
            localId: "listOfContacts",
            template: "<span class='fas fa-user'></span>#FirstName# #LastName# <div class='company-name'>#Company#</div>",
            select: true,
            type: {
                height: 43,
                width: 200
            }
        }
    }

    $getListOfContacts() {
        return this.$$("listOfContacts");
    }

    init() {
        const listOfContacts = this.$getListOfContacts();
        const contactId = this.getParam("id");
        listOfContacts.sync(contactsData);
        this.on(listOfContacts, "onAfterSelect", (id) => {
            this.show(`contacts?id=${id}`);
        });
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