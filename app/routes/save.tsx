import { authenticate } from "~/shopify.server";
import type { formData } from "./save.server";
import { getSovendusSettings, saveSovendusSettings } from "./save.server";
import type { ActionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionArgs): Promise<formData> => {
  const { admin, session } = await authenticate.admin(request);
  const dataToSave: formData = await request.json();
  await saveSovendusSettings(admin, session, dataToSave);
  return await getSovendusSettings(admin);
};
