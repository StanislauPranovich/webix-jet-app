import { JetView } from "webix-jet";
import activitiesData from "../../models/activitiesData";
import contactsData from "../../models/contactsData";
import statusesData from "../../models/statusesData";
import ActivitiesDatatable from "./activitiesDatatable";
import ActivitiesToolbar from "./activitiesToolbar";

const uploadingData = new webix.DataCollection({});

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
								{},
								{
									view: "button",
									value: "<span class='fas fa-trash'></span> Delete",
									css: "webix_primary",
									click: () => {
										this.webix.confirm({
											title: "Deleting an entry",
											text: "Do you want to delete entry?"
										}).then(() => {
											const urlId = this.getParam("id");
											contactsData.remove(urlId);
											activitiesData.data.each((obj)=>{
												if(obj.ContactID == urlId) {
													activitiesData.remove(obj.id);
												}
											})
											this.show(`contacts?id=${contactsData.getFirstId()}`)
										});
									}
								},
								{
									view: "button",
									value: "<span class='fas fa-pen on_edit'></span> Edit",
									css: "webix_primary"
								}
							]
						}
					]
				},
				{
					localId: "contactsTemplate",
					template: (obj) => {
						const status = statusesData.getItem(obj.StatusID);
						const dataFormat = webix.Date.dateToStr("%Y-%m-%d");
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
								<p><span class="fas fa-calendar"></span> ${dataFormat(obj.dayOfBirth) || "-"}</p>
								<p><span class="fas fa-compass"></span> ${obj.Address || "-"}</p>
							</div>
						</div>`;
					}
				},
				{
					view: "tabview",
					multiview: true,
					cells: [
						{
							header: "Activities",
							body: {
								rows: [
									ActivitiesDatatable,
									ActivitiesToolbar
								]
							}
						},
						{
							header: 'Files',
							body: {
								rows: [
									{
										view: "datatable",
										id: "filesTable",
										localId: "filesTable",
										type: "uploader",
										autosend: false,
										columns: [
											{
												id: "name",
												header: "Name",
												fillspace: true,
												sort: "text"
											},
											{
												id: "date",
												header: "Change date",
												format: webix.Date.dateToStr("%Y-%m-%d"),
												sort: "date",
												fillspace: true
											},
											{
												id: "size",
												header: "Size",
												fillspace: true,
												template: "#size# b",
												sort: "int"
											},
											{
												id: "delete",
												header: "",
												template: "<span class='fas fa-trash on_delete'></span>"
											}
										],
										onClick: {
											on_delete: (e, id) => {
												this.webix.confirm({
													title: "Deleting an entry",
													text: "Do you want to delete entry?"
												}).then(() => {
													uploadingData.remove(id);
												});
											}
										}
									},
									{
										view: "uploader",
										value: "Upload file",
										link: "filesTable",
										upload: uploadingData,
										on: {
											onAfterFileAdd(item) {
												const urlId = this.$scope.getParentView().getParam("id");
												uploadingData.add({
													id: item.id,
													date: new Date(),
													name: item.name,
													size: item.size,
													contactId: urlId
												})
											}
										}
									}
								]
							}
						}
					]
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

	$getFilesTable() {
		return this.$$("filesTable");
	}

	createLabel(label, title, style) {
		return {
			view: "label",
			label,
			name: title,
			css: style
		};
	}
	urlChange() {
		const contactId = this.getParam("id");
		this.webix.promise.all([
			contactsData.waitData,
			statusesData.waitData,
			activitiesData.waitData
		]).then(() => {
			if (contactId) {
				this.$getContactsHeader().parse(contactsData.getItem(contactId));
				this.$getContactsTemplate().parse(contactsData.getItem(contactId));
				uploadingData.data.each(obj => {
					if (obj.contactId == contactId) {
						this.$getFilesTable().parse(uploadingData.getItem(obj.id))
					}
					this.$getFilesTable().filter(obj => {
						return obj.contactId == contactId
					})
				})
			}
		});
	}
}
