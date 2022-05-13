const icons = [
	{
		id: "Flag",
		value: "flag"
	},
	{
		id: "Comment",
		value: "comment"
	},
	{
		id: "Clock",
		value: "clock"
	},
	{
		id: "Phone",
		value: "phone"
	},
	{
		id: "Skype",
		value: "skype"
	},
	{
		id: "FileVideo",
		value: "file-video"
	},
	{
		id: "Sync",
		value: "sync"
	},
	{
		id: "Coffee",
		value: "coffee"
	},
	{
		id: "account",
		value: "account"
	}
];

const iconsCollection = new webix.DataCollection({
	data: icons
});

export default iconsCollection;
