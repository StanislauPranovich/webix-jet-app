import {JetView} from "webix-jet";

import activitiesTypeData from "../models/activitiesTypeData";
import statusesData from "../models/statusesData";
import SettingsTable from "./details/settingsTable";

export default class SettingsView extends JetView {
	config() {
		const initialLang = this.app.getService("locale").getLang();
		return {
			rows: [
				{
					view: "segmented",
					value: initialLang,
					options: [
						{id: "en", value: "en-US"},
						{id: "ru", value: "ru-RU"}
					],
					on: {
						onChange: id => webix.delay(() => this.SetLocale(id))
					}
				},
				{
					cols: [
						new SettingsTable(this.app, "Activity", activitiesTypeData),
						new SettingsTable(this.app, "Status", statusesData)
					]
				}
			]
		};
	}

	SetLocale(locale) {
		this.app.getService("locale").setLang(locale);
	}
}
