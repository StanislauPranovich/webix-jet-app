const activitiesData = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.dateObj = new Date(obj.DueDate);
		}
	}
});

export default activitiesData;
