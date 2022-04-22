import { JetView } from "webix-jet";
import ActivitiesDatatable from "./details/activitiesDatatable";
import ActivitiesToolbar from "./details/activitiesToolbar";

export default class ActivitiesClass extends JetView {
    config() {
        return {
            rows: [
                ActivitiesToolbar,
                ActivitiesDatatable
            ]
        }
    }
}
