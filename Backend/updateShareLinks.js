import { MongoClient } from "mongodb";

const uri = "mongodb+srv://derrickmugisha169:yLiuLOe1Y219EqZW@cluster0.hkctzvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function updateShareLinks() {
  try {
    await client.connect();
    const db = client.db("YOUR_DB_NAME");
    const questions = db.collection("questions");

    const result = await questions.updateMany(
      { shareLink: { $regex: "localhost:5000" } },
      [
        {
          $set: {
            shareLink: {
              $replaceOne: {
                input: "$shareLink",
                find: "http://localhost:5000/quiz/",
                replacement: "https://quiz-five-rho-90.vercel.app/quiz/"
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} questions`);
  } finally {
    await client.close();
  }
}

updateShareLinks().catch(console.error);
