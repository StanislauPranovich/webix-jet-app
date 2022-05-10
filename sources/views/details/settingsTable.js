import {JetView} from "webix-jet";

export default class SettingsTable extends JetView {
	constructor(app, name, data) {
		super(app);
		this.name = name;
		this.data = data;
	}

	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "datatable",
					select: true,
					editable: true,
					editaction: "dblclick",
					columns: [
						{
							id: "Value",
							header: _("Value"),
							fillspace: true,
							editor: "text"
						},
						{
							id: "Icon",
							header: _("Icon"),
							fillspace: true,
							editor: "text"
						},
						{
							id: "delete",
							header: "",
							template: "<span class='fas fa-trash on_delete'></span>"
						}
					],
					localId: "table",
					onClick: {
						on_delete: (e, id) => {
							this.webix.confirm({
								title: _("Deleting an entry"),
								text: _("Do you want to delete entry?")
							}).then(() => {
								this.data.remove(id);
							});
						}
					}
				},
				{
					cols: [
						{
							view: "text",
							localId: `${this.name}Input`
						},
						{
							view: "button",
							value: _(`${`Add ${this.name}`}`),
							css: "webix_primary",
							click: () => {
								const input = this.$getInput();
								const value = input.getValue();
								if (value) {
									this.data.add({
										Value: value,
										Icon: "someIcon"
									});
								}
								input.setValue("");
							}
						}
					]
				}
			]
		};
	}

	$getInput() {
		return this.$$(`${this.name}Input`);
	}

	$getTable() {
		return this.$$("table");
	}

	init() {
		const table = this.$getTable();
		table.parse(this.data);
		this.on(table, "onAfterEditStop", (state, editor) => {
			this.data.updateItem(editor.row, {value: state.value});
		});
	}
}
