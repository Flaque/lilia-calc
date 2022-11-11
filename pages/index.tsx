import { useState } from "react";

export default function Home() {
  const [amh, setAMH] = useState("30.0");
  const [age, setAge] = useState("28");

  const [runs, setRuns] = useState<{ amh: any; age: any; prediction: any }[]>(
    []
  );

  async function calculate() {
    const result = await fetch("/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amh,
        age,
      }),
    });

    if (result.status !== 200) {
      alert("Something went wrong! Did someone change the Airtable?");
      return;
    }

    const { prediction } = await result.json();

    setRuns([
      ...runs,
      {
        amh,
        age,
        prediction,
      },
    ]);
  }

  return (
    <>
      <div className="sm:p-4 flex items-center justify-center pattern h-screen flex-col justify-between border-b ">
        <div className="max-w-lg p-4 mt-24 bg-white border rounded ">
          <h1 className="text-lg font-serif pb-1">Cost Calculator</h1>
          <p className="text-gray-700 pb-6">
            This tool predicts the cost of a patient for Lilia, based on the AMH
            and age.
          </p>

          <div className="flex flex-wrap gap-2 flex-grow">
            <label className="flex-1">
              <span className="text-xs text-gray-500 pb-1 flex">AMH</span>
              <input
                className="border px-4 py-2 rounded-sm shadow-inner w-full"
                value={amh}
                onChange={(e) => setAMH(e.target.value)}
                placeholder="12.5"
              />
            </label>

            <label className="flex-1">
              <span className="text-xs text-gray-500 pb-1 flex">Age</span>
              <input
                className="border px-4 py-2 rounded-sm shadow-inner w-full"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={"28"}
              />
            </label>
          </div>

          <div className="pt-4">
            <button
              className="px-4 py-2 interact-bounce w-full bg-blue-500 text-white rounded  flex justify-between items-center"
              onClick={calculate}
            >
              Calculate! <span className="text-sm">✨</span>
            </button>
          </div>

          {runs && (
            <div className="bg-gray-50 p-2 mt-4">
              <div className="bg-white border rounded-sm">
                <div className=" flex  border-b ">
                  <div className="flex-1 text-sm font-mono p-2">Age</div>
                  <div className="flex-1 text-sm font-mono p-2">AMH</div>
                  <div className=" flex-1 text-sm font-mono p-2">Cost</div>
                </div>

                {runs.map((r) => (
                  <div className=" flex border-b font-mono">
                    <div className="flex-1 p-2 ">{r.age}</div>
                    <div className="flex-1 border-l p-2">{r.amh}</div>
                    <div className=" flex-1 border-l p-2 ">{r.prediction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div></div>
        </div>
        <div className="text-gray-700 text-sm">👇 Learn about this tool 👇</div>
      </div>
      <div className="max-w-2xl mx-auto w-full py-8 px-4">
        <h2 className="font-serif text-xl pb-4">FAQ</h2>
        <h3 className="font-bold pb-1">How does this tool work?</h3>
        <p className="pb-4">
          This tool runs a{" "}
          <a href="https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm">
            KNN
          </a>{" "}
          on AMH and age and spits out the cost, using a little python script.
          It reads the data from the Airtable setup by Lilia, so it's always up
          to date, so long as the data in the Airtable is good.
        </p>

        <h3 className="font-bold pb-1">Who made this?</h3>
        <p className="pb-4">
          <a href="https://twitter.com/evanjconrad" className="underline">
            Evan Conrad!
          </a>{" "}
          I claim 0 long-term support for this, but if you need to hire an
          engineer, I would recommend having them rebuild a tool like this as an
          interview. An engineer should be able to do this within a day
          (realistically within a few hours).
        </p>

        <h3 className="font-bold pb-1">Where does the code live?</h3>
        <p className="pb-4">
          I setup a Github for Lilia and put the code there.
        </p>

        <h3 className="font-bold pb-1">It's broken! What gives?</h3>
        <p className="pb-4">
          It's probably the airtable. Don't change the field names in the
          airtable or this tool breaks! (sorry!)
        </p>

        <div>Go build the future friends!</div>
      </div>
    </>
  );
}
