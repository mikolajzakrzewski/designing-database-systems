// ==== INSERT USERS ====
db.users.insertMany([
	{
		first_name: "Anna",
		last_name: "Kowalska",
		email: "anna.k@example.com",
		passwordHash: "hashed_password_1",
		rating_points: 2100,
		club: {
			club_name: "Climbing Club Warsaw",
			location: "Warsaw"
		},
		roles: ["user", "coach"],
		certificates: [
			{ name: "Alpine Safety", description: "Certificate for alpine safety training" }
		]
	},
	{
		first_name: "Jan",
		last_name: "Kowalski",
		email: "jan.k@example.com",
		passwordHash: "hashed_password_2",
		rating_points: 540,
		roles: ["user"],
		certificates: []
	}
]);

// ==== FETCH USER IDs ====
const anna = db.users.findOne({ email: "anna.k@example.com" });
const jan = db.users.findOne({ email: "jan.k@example.com" });

// ==== BUG REPORT ====
db.bug_reports.insertOne({
    title: "Competition Event Registration Issue",
    content: "Unable to register for the competition event",
    user: {
        user_id: anna._id,
        first_name: "Anna",
		last_name: "Kowalska",
		email: "anna.k@example.com"
    }
});

// ==== COMPETITION EVENT ====
db.events.insertOne({
    name: "Polish Bouldering Championships",
    description: "Bouldering competition for all levels.",
    location: "Warsaw Climbing Center",
    start_time: new Date("2025-05-10T10:00:00Z"),
    end_time: new Date("2025-05-10T18:00:00Z"),
    type: "Competition",
    participation_cost: 100.00,
    discipline: "Bouldering",
    rank: "National",
    reward_pool: 5000.00,
    participants: [
		{ user_id: anna._id, name: "Anna Kowalska", points: 85.5, placement: 2 },
		{ user_id: jan._id, name: "Jan Kowalski", points: 78.0, placement: 4 }
	],
	reviews: [
		{
			user_id: jan._id,
			rating: 4,
			description: "Fun, great routes, but the music was bad."
		}
	]
});

// ==== TRAINING EVENT ====
db.events.insertOne({
    name: "Belaying Basics",
    description: "Belaying techniques for beginners.",
    location: "Warsaw Climbing Center",
    start_time: new Date("2025-06-01T09:00:00Z"),
    end_time: new Date("2025-06-01T15:00:00Z"),
    type: "Training",
    participation_cost: 60.00,
    training_type: "Belaying",
    participants: [
		{ user_id: anna._id, name: "Anna Kowalska" }
	],
	reviews: [
		{
			user_id: anna._id,
			rating: 5,
			description: "Learned a lot, great instructor!"
		}
	]
});

// ==== EXPEDITION EVENT ====
db.events.insertOne({
    name: "Tatry Rysy Expedition",
    description: "Climbing expedition to the highest peak in Poland.",
    location: "Tatry Mountains",
    start_time: new Date("2025-07-15T06:00:00Z"),
    end_time: new Date("2025-07-15T18:00:00Z"),
    type: "Expedition",
    participation_cost: 150.00,
    difficulty: "Medium",
    mountain_chain: "Tatry",
    participants: [
		{ user_id: jan._id, name: "Jan Nowak" }
	],
	reviews: [
		{
			user_id: jan._id,
			rating: 5,
			description: "Unforgettable views and great team!"
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
			user_id: jan._id,
			content: "Try La Sportiva Solution – aggressive and precise!",
			timestamp: new Date("2025-04-07T11:00:00Z")
		}
	]
});
