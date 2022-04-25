const contacts = [
	{id: 1,
		FirstName: "Nelly",
		LastName: "Anderson",
		StatusID: 2,
		Company: "BBN Software",
		Address: "Not specified",
		Job: "Lead Developer",
		Website: "http://bbnsoft.com",
		Skype: "-",
		Phone: "+1 45 455-77-55",
		Email: "alex@gmail.com",
		Photo: "",
		Birthday: "1970-07-07",
		StartDate: "2001-04-18"},
	{id: 2,
		FirstName: "Doris",
		LastName: "Vinisky",
		StatusID:
	4,
		Company: "Self employed",
		Address: "",
		Job: "",
		Website: "",
		Skype: "-",
		Phone: "+1 55 45-787",
		Email: "doris@gmail.com",
		Photo: "",
		Birthday: "1976-05-03",
		StartDate: "2001-05-21"},
	{id: 3,
		FirstName: "Alex",
		LastName: "Brown",
		StatusID: 2,
		Company: "Lenovo LLC",
		Address: "Moskow, Линейная 78-854",
		Job: "Developer",
		Website: "https://lenovo.com",
		Skype: "somekun",
		Phone: "+7 445 45-554-39",
		Email: "alex@gmail.com",
		Photo: "",
		Birthday: "1990-07-17",
		StartDate: "2001-09-21"}
];

const contactsCollection = new webix.DataCollection({
	data: contacts
});

// const contactsCollection = new webix.DataCollection({
// 	url: "http://localhost:8096/api/v1/contacts/",
// 	// save: "rest->http://localhost:8096/api/v1/contacts/"
// });

export default contactsCollection;
