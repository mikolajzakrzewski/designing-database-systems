// ==== USERS ====
db.createCollection("users", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["first_name", "last_name", "email", "passwordHash"],
			properties: {
				first_name: { bsonType: "string" },
				last_name: { bsonType: "string" },
				email: { bsonType: "string" },
				passwordHash: { bsonType: "string" },
				rating_points: { bsonType: ["int", "double"], minimum: 0 },
				club: {
					bsonType: "object",
					properties: {
						club_name: { bsonType: "string" },
						location: { bsonType: "string" }
					}
				},
				roles: {
					bsonType: "array",
					items: { bsonType: "string" }
				},
				certificates: {
					bsonType: "array",
					items: {
						bsonType: "object",
						required: ["name"],
						properties: {
							name: { bsonType: "string" },
							description: { bsonType: "string" }
						}
					}
				}
			}
		}
	}
});

// ==== EVENTS ====
db.createCollection("events", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "location", "start_time", "end_time", "type"],
            properties: {
                name: { bsonType: "string" },
                description: { bsonType: "string" },
                location: { bsonType: "string" },
                start_time: { bsonType: "date" },
                end_time: { bsonType: "date" },
                participation_cost: { bsonType: ["int", "double"], minimum: 0 },
                type: {
                    enum: ["Competition", "Training", "Expedition"]
                },
                // Competition fields
                discipline: { bsonType: "string" },
                rank: { bsonType: "string" },
                reward_pool: { bsonType: ["int", "double"], minimum: 0 },
                // Training fields
                training_type: { bsonType: "string" },
                // Expedition fields
                difficulty: { bsonType: "string" },
                mountain_chain: { bsonType: "string" }
            },
            allOf: [
                {
                    if: { properties: { type: { const: "Competition" } } },
                    then: {
                        required: ["discipline"],
                        properties: {
                            discipline: {
                                enum: ["Lead", "Bouldering", "Speed", "Combined"]
                            }
                        }
                    }
                },
                {
                    if: { properties: { type: { const: "Training" } } },
                    then: {
                        required: ["training_type"]
                    }
                },
                {
                    if: { properties: { type: { const: "Expedition" } } },
                    then: {
                        required: ["difficulty", "mountain_chain"]
                    }
                }
            ]
        }
    }
});

// ==== BUG REPORTS ====
db.createCollection("bug_reports", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "content", "user"],
            properties: {
                title: { bsonType: "string" },
                content: { bsonType: "string" },
                user: {
                    bsonType: "object",
                    required: ["user_id", "first_name", "last_name", "email"],
                    properties: {
                        user_id: { bsonType: "objectId" },
                        first_name: { bsonType: "string" },
                        last_name: { bsonType: "string" },
                        email: { bsonType: "string" }
                    }
                }
            }
        }
    }
});

// ==== THREADS ====
db.createCollection("threads", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["name", "user_id", "posts"],
			properties: {
				name: { bsonType: "string" },
				user_id: { bsonType: "objectId" },
				posts: {
					bsonType: "array",
					items: {
						bsonType: "object",
						required: ["user_id", "content", "timestamp"],
						properties: {
							user_id: { bsonType: "objectId" },
							content: { bsonType: "string" },
							timestamp: { bsonType: "date" }
						}
					}
				}
			}
		}
	}
});
