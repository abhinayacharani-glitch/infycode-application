import "dotenv/config";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import app from "./src/app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
