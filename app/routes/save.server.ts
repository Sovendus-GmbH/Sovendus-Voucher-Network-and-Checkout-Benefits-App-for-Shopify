import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export async function saveSovendusSettings(
  admin: AdminApiContext<RestResources>,
  session: Session,
  dataToSave: formData
) {
  const errors = {};
  const minifiedDataToSafe: storedFormData = {};
  dataToSave &&
    Object.entries(dataToSave).map(async ([countryKey, values]) => {
      try {
        minifiedDataToSafe[countryKey] = [
          values.trafficSourceNumber,
          values.trafficMediumNumber,
          values.isEnabled,
        ];
      } catch (error) {
        errors[countryKey] = error;
      }
    });

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
) {
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
        Object.entries(sovSettings)?.forEach(([countryCode, values]) => {
          const [sourceNumber, mediumNumber, isEnabled] = values;
          initialData[countryCode] = {
            trafficSourceNumber: sourceNumber || "",
            trafficMediumNumber: mediumNumber || "",
            isEnabled,
          };
        });
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

interface storedFormData {
  DE?: [string, string, boolean];
  AT?: [string, string, boolean];
  NL?: [string, string, boolean];
  CH?: [string, string, boolean];
  FR?: [string, string, boolean];
  IT?: [string, string, boolean];
  IE?: [string, string, boolean];
  UK?: [string, string, boolean];
  DK?: [string, string, boolean];
  SE?: [string, string, boolean];
  ES?: [string, string, boolean];
  BE?: [string, string, boolean];
  PL?: [string, string, boolean];
}
export interface formData {
  DE?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  AT?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  NL?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  CH?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  FR?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  IT?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  IE?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  UK?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  DK?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  SE?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  ES?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  BE?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
  PL?: {
    isEnabled?: boolean;
    trafficSourceNumber?: string;
    trafficMediumNumber?: string;
  };
}
