import Home from "./lib/views/Home.svelte";
import Statistics from "./lib/views/Statistics.svelte";
import Requests from "./lib/views/Requests.svelte";
import NewRequest from "./lib/views/NewRequest.svelte";
import Notifications from "./lib/views/Notifications.svelte";
import Account from "./lib/views/Account.svelte";
import Settings from "./lib/views/Settings.svelte";
import Login from "./lib/views/Login.svelte";
import Error from "./lib/views/Error.svelte";

export const routes = {
	"/": Home,
	"/statistics": Statistics,
	"/requests": Requests,
	"/requests/new": NewRequest,
	"/requests/edit": NewRequest,
	"/notifications": Notifications,
	"/account": Account,
	"/settings": Settings,
	"/login": Login,
	"*": Error
};
