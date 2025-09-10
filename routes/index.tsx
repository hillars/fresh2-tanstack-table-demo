import { define } from "../utils.ts";
import TableIsland from "../islands/TableIsland.tsx";

export default define.page(function Home(ctx) {
  const data = JSON.parse(Deno.readTextFileSync("assets/bonds.json"));
  return <TableIsland data={data.data} />;
});
