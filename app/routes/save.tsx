import { authenticate } from "~/shopify.server";
import type { formData} from "./save.server";
import { getSovendusSettings, saveSovendusSettings } from "./save.server";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const dataToSave: formData = await request.json();
  await saveSovendusSettings(admin, session, dataToSave);
  return await getSovendusSettings(admin);
};
