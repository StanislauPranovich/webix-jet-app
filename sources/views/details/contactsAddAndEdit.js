import { JetView } from "webix-jet";
import contactsData from "../../models/contactsData";
import statusesData from "../../models/statusesData";
import ContactsList from "./contactsList";


export default class ContactsAddAndEdit extends JetView{
    constructor(app) {
        super(app);
    }
    config(){
        return {
            cols: [
                {
                    view: "form",
                    localId: "contactsForm",
                    elements: [
                        {
                            template: "Add new contact",
                            type: "section"
                        },
                        {
                            cols: [
                                {
                                    rows: [
                                        {
                                            view: "text",
                                            label: "Firstname",
                                            name: "FirstName",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Lastname",
                                            name: "LastName",
                                            required: true
                                        },
                                        {
                                            view: "datepicker",
                                            label: "Joining",
                                            name: "dayOfStart",
                                            required: true
                                        },
                                        {
                                            view: "combo",
                                            label: "Status",
                                            name: "StatusID",
                                            options: statusesData,
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Job",
                                            name: "Job",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Company",
                                            name: "Company",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Website",
                                            name: "Website",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Address",
                                            name: "Address",
                                            required: true
                                        }
                                    ]
                                },
                                {
                                    rows: [
                                        {
                                            view: "text",
                                            label: "Email",
                                            name: "Email",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Skype",
                                            name: "Skype",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            label: "Phone",
                                            name: "Phone",
                                            required: true
                                        },
                                        {
                                            view: "datepicker",
                                            label: "Birthday",
                                            name: "dayOfBirth",
                                            required: true
                                        },
                                        {
                                            cols: [
                                                {
                                                    template: (obj) => {
                                                        const notFound = "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
                                                        return `
                                                            <img class="contactsInfoPhoto" src=${obj.Photo || notFound} />
                                                        `
                                                    },
                                                    borderless: true
                                                },
                                                {
                                                    rows: [
                                                        {},
                                                        {
                                                            view: "button",
                                                            value: "Change photo"
                                                        },
                                                        {
                                                            view: "button",
                                                            value: "Delete photo"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {},
                        {
                            view: "toolbar",
                            borderless: true,
                            cols: [
                                { gravity: 3 },
                                {
                                    view: "button",
                                    value: "Cancel",
                                    css: "webix_primary",
                                    click: () => {
                                        this.clearForm()
                                    }
                                },
                                {
                                    view: "button",
                                    value: "Add",
                                    css: "webix_primary",
                                    click: () => {
                                        const form = this.$getContactsForm();
                                        const values = this.getFormData();
                                        if (form.validate()) {
                                            contactsData.add(values);
                                            this.clearForm();
                                            this.show(`contacts?id=${contactsData.getFirstId()}`);
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    $getContactsForm() {
		return this.$$("contactsForm");
	}

	clearForm() {
		this.$getContactsForm().clear();
		this.$getContactsForm().clearValidation();
	}

	getFormData() {
		const dataObj = this.$getContactsForm().getValues();
		const formatDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
		dataObj.StartDate = formatDate(dataObj.dayOfStart);
		dataObj.Birthday = formatDate(dataObj.dayOfBirth);
		return dataObj;
	}
}