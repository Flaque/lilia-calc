import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";
import { linearRegression, linearRegressionLine } from "simple-statistics";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appBfaGzKO6Ki5pvQ"
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

  const age = body.age;
  const amh = body.amh;

  // Grab data from Airtable
  const records = await base("EF Outcomes")
    .select({
      maxRecords: 200,
      view: "EF Pilots",
    })
    .all();

  const result = records
    .map((r) => {
      const cost = r.get("Med Cost") as number;
      const age = r.get("Age") as number;
      const amh = r.get("AMH") as string;

      return { age, amh, cost };
    })
    .filter((r) => r.cost && r.age && r.amh) // some are empty
    .map((r) => {
      return {
        age: r.age,
        amh: parseFloatOrZero(r.amh),
        cost: r.cost,
      };
    }); // Convert to numbers

  const x = result.map((r) => [r.amh, r.cost]);

  const reg = linearRegression(x);
  let prediction = linearRegressionLine(reg)(parseFloatOrZero(amh));

  if (prediction < 0) {
    prediction = 0;
  }

  return res.status(200).json({ prediction: prediction });
};
