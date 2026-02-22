const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/Users";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("Users");
    const users = db.collection("users");

    // 🔍 Find one user
      const user = await users.findOne({ email: "riya.verma@gmail.com" });
      const adult = await users.find({ age: { $gt: 25 } }).toArray();
      const teen = await users.find({ age: { $lt: 24 } }).toArray();
      console.log(teen)
      console.log(adult);
      console.log(user);
      const limit = await users.find({ role: "user" }).limit(10).toArray();
      console.log(limit);

  } finally {
    await client.close();
  }
}

run();