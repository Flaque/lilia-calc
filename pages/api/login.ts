// A next.js api endpoint

import { NextApiRequest, NextApiResponse } from "next";
import { PASSWORD } from "../../lib/constants";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const pass = req.body.password;

  if (pass !== PASSWORD) {
    return res.status(401).json({});
  }

  return res.status(200).json({ success: pass === PASSWORD });
};
