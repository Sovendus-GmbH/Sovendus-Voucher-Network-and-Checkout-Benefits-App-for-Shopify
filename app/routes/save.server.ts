import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export async function saveSovendusSettings(
  admin: AdminApiContext<RestResources>,
  session: Session,
  dataToSave: formData
): Promise<errorsObject> {
  const errors: errorsObject = {};
  const minifiedDataToSafe: storedFormData = {};
  dataToSave &&
    (Object.entries(dataToSave) as formDataArray[]).map(
      async ([countryKey, values]) => {
        try {
          minifiedDataToSafe[countryKey] = [
            values.trafficSourceNumber,
            values.trafficMediumNumber,
            values.isEnabled,
          ];
        } catch (error) {
          errors[countryKey] = error;
        }
      }
    );

  try {
    const metafield = new admin.rest.resources.Metafield({
      session: session,
    });
    metafield.namespace = "sovendus_settings";
    metafield.key = "sovendus_settings_values";
    metafield.value = JSON.stringify(minifiedDataToSafe);
    metafield.type = "single_line_text_field";
    await metafield.save({
      update: true,
    });

    await admin.graphql(
      `#graphql
        mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
      {
        variables: {
          definition: {
            name: "sovendus_settings_values",
            namespace: "sovendus_settings",
            key: "sovendus_settings_values",
            type: "single_line_text_field",
            ownerType: "SHOP",
          },
        },
      }
    );
  } catch (error) {
    errors["sovendus_settings_values"] = error;
  }

  return errors;
}

export async function getSovendusSettings(
  admin: AdminApiContext<RestResources>
): Promise<formData> {
  const response = await admin.graphql(
    `#graphql
    query getSovendusSettings {
      shop {
        metafields(namespace: "sovendus_settings", first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }`
  );
  const data: metafieldResponseData = await response.json();
  const metafields = data?.data?.shop?.metafields?.edges;

  const initialData: formData = {};
  metafields?.forEach((element) => {
    if ("sovendus_settings_values" === element?.node?.key) {
      const sovSettings: storedFormData =
        element?.node?.value && JSON.parse(element.node.value);
      sovSettings &&
        (Object.entries(sovSettings) as storedFormDataArray[])?.forEach(
          ([countryCode, values]) => {
            const [sourceNumber, mediumNumber, isEnabled] = values;
            initialData[countryCode] = {
              trafficSourceNumber: sourceNumber || "",
              trafficMediumNumber: mediumNumber || "",
              isEnabled,
            };
          }
        );
    }
  });
  return initialData;
}

interface metafieldResponseNodeData {
  node?: { key?: string; value?: string };
}
interface metafieldResponseData {
  data?: { shop?: { metafields?: { edges: metafieldResponseNodeData[] } } };
}

export type countryCodesType =
  | "DE"
  | "AT"
  | "NL"
  | "CH"
  | "FR"
  | "IT"
  | "IE"
  | "UK"
  | "DK"
  | "SE"
  | "ES"
  | "BE"
  | "PL";

type storedFormDataArray = [
  countryCodesType,
  [string | undefined, string | undefined, boolean | undefined]
];
type storedFormData = {
  [key in countryCodesType]?: [
    string | undefined,
    string | undefined,
    boolean | undefined
  ];
};

type errorsObject = {
  [key in countryCodesType | "sovendus_settings_values"]?: unknown;
};

export type formKeys =
  | "isEnabled"
  | "trafficSourceNumber"
  | "trafficMediumNumber";

type formDataArray = [
  countryCodesType,
  {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  }
];
export type formData = {
  [key in countryCodesType]?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
};
