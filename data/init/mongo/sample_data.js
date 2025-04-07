// ==== INSERT USERS ====
db.users.insertMany([
	{
		first_name: "Anna",
		last_name: "Kowalska",
		email: "anna.k@example.com",
		passwordHash: "hashed_pw_123",
		rating_points: 1200,
		club: {
			club_name: "High Climbers",
			location: "Zakopane"
		},
		roles: ["user", "coach"],
		certificates: [
			{ name: "Alpine Safety", description: "Certificate for alpine safety training" },
			{ name: "Lead Climbing" }
		]
	},
	{
		first_name: "Tomek",
		last_name: "Nowak",
		email: "tomek.n@example.com",
		passwordHash: "hashed_pw_456",
		rating_points: 980,
		roles: ["user"],
		certificates: []
	}
]);

// ==== FETCH USER IDs ====
const anna = db.users.findOne({ email: "anna.k@example.com" });
const tomek = db.users.findOne({ email: "tomek.n@example.com" });

// ==== BUG REPORT ====
db.bug_reports.insertOne({
    title: "Nie działa przycisk zapisu",
    content: "Po kliknięciu w 'Zapisz się' na wydarzenie nic się nie dzieje.",
    user: {
        user_id: anna._id,
        first_name: "Anna",
		last_name: "Kowalska",
		email: "anna.k@example.com"
    }
});

// ==== COMPETITION EVENT ====
db.events.insertOne({
    name: "Mistrzostwa Polski Boulder 2025",
    description: "Zawody w boulderingu – poziom mistrzowski.",
    location: "Warszawa, Hala Wspinaczkowa XYZ",
    start_time: new Date("2025-05-10T10:00:00Z"),
    end_time: new Date("2025-05-10T18:00:00Z"),
    type: "Competition",
    participation_cost: 100.00,
    discipline: "Bouldering",
    rank: "Mistrzostwa Polski",
    reward_pool: 5000.00,
    participants: [
		{ user_id: anna._id, name: "Anna Kowalska", points: 85.5, placement: 2 },
		{ user_id: tomek._id, name: "Tomek Nowak", points: 78.0, placement: 4 }
	],
	reviews: [
		{
			user_id: tomek._id,
			rating: 4,
			description: "Fun comp, great routes, but the music was too loud."
		}
	]
});

// ==== TRAINING EVENT ====
db.events.insertOne({
    name: "Techniki asekuracji – kurs podstawowy",
    description: "Szkolenie dla początkujących wspinaczy.",
    location: "Kraków, CW Reni Sport",
    start_time: new Date("2025-06-01T09:00:00Z"),
    end_time: new Date("2025-06-01T15:00:00Z"),
    type: "Training",
    participation_cost: 60.00,
    training_type: "Asekuracja",
    participants: [
		{ user_id: anna._id, name: "Anna Kowalska" }
	],
	reviews: [
		{
			user_id: anna._id,
			rating: 5,
			description: "Intense and well-structured session!"
		}
	]
});

// ==== EXPEDITION EVENT ====
db.events.insertOne({
    name: "Wyprawa w Tatry – Rysy",
    description: "Całodniowa wyprawa na Rysy z przewodnikiem.",
    location: "Tatry, Morskie Oko",
    start_time: new Date("2025-07-15T06:00:00Z"),
    end_time: new Date("2025-07-15T18:00:00Z"),
    type: "Expedition",
    participation_cost: 150.00,
    difficulty: "Średnia",
    mountain_chain: "Tatry",
    participants: [
		{ user_id: tomek._id, name: "Tomek Nowak" }
	],
	reviews: [
		{
			user_id: tomek._id,
			rating: 5,
			description: "Unforgettable views and great team spirit!"
		}
	]
});

// ==== THREAD ====
db.threads.insertOne({
	name: "Best climbing shoes?",
	user_id: anna._id,
	posts: [
		{
			user_id: anna._id,
			content: "What shoes would you recommend for steep overhangs?",
			timestamp: new Date("2025-04-07T10:00:00Z")
		},
		{
			user_id: tomek._id,
			content: "Try La Sportiva Solution – aggressive and precise!",
			timestamp: new Date("2025-04-07T11:00:00Z")
		}
	]
});
