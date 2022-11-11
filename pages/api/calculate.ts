import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";
import KNN from "ml-knn";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "apprRAaU7QaTzmp9V"
);

function parseFloatOrZero(value: string) {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  if (body.password !== process.env.PASSWORD) {
    return res.status(401);
  }

  const age = body.age;
  const amh = body.amh;

  // Grab data from Airtable
  const records = await base("EF Outcomes")
    .select({
      maxRecords: 200,
      view: "Grid view",
    })
    .all();

  const result = records
    .map((r) => {
      const cost = r.get("Med Cost") as string;
      const age = r.get("Age") as number;
      const amh = r.get("AMH") as string;

      return { age, amh, cost };
    })
    .filter((r) => r.cost && r.age && r.amh) // some are empty
    .map((r) => ({
      age: r.age,
      amh: parseFloatOrZero(r.amh),
      cost: parseFloatOrZero(r.cost.replace("$", "").replace(",", "")),
    })); // Convert to numbers

  const x = result.map((r) => [r.age, r.amh]);
  const y = result.map((r) => [r.cost]);

  const test = [parseInt(age), parseFloatOrZero(amh)];

  const knn = new KNN(x, y, { k: 5 });

  return res.status(200).json({ prediction: knn.predict(test) });
};
