const contactsData = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init(obj) {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.dayOfBirth = new Date(obj.Birthday);
			obj.dayOfStart = new Date(obj.StartDate);
		}
	}
});
export default contactsData;
