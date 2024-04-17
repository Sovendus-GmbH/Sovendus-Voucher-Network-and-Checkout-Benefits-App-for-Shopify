import { useCallback, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Layout,
  Page,
  Text,
  TextField,
  BlockStack,
  PageActions,
  Checkbox,
} from "@shopify/polaris";
import type { formData } from "./save.server";
import { getSovendusSettings } from "./save.server";

export async function loader({ request }: { request: Request }) {
  const { admin } = await authenticate.admin(request);
  return await getSovendusSettings(admin);
}

export default function SovendusBackendForm() {
  const errors = useActionData()?.errors || {};
  const initialData = useLoaderData();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formState, setFormState] = useState<formData>(initialData);
  const handleSave = useCallback(async () => {
    setIsSaving(true);

    const result = await fetch("/save", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });
    const newSettings = await result.json();
    setFormState(newSettings);
    setIsSaving(false);
  }, [formState]);

  function handleFormChange(
    countryKey: string,
    id: string,
    value: string | boolean
  ) {
    setFormState((prevState) => {
      const newFormState = { ...prevState };
      if (newFormState[countryKey]) {
        newFormState[countryKey][id] = value;
      } else {
        newFormState[countryKey] = { [id]: value };
      }
      console.log("countryKey", countryKey, id, value);
      console.log("prevState", prevState);
      console.log("newFormState", newFormState);
      return newFormState;
    });
  }
  const availableCountries = {
    DE: "Germany",
    AT: "Austria",
    NL: "Netherland",
    CH: "Switzerland",
    FR: "France",
    IT: "Italy",
    IE: "Ireland",
    UK: "United Kingdom",
    DK: "Denmark",
    SE: "Sweden",
    ES: "Spain",
    BE: "Belgium",
    PL: "Poland",
  };
  return (
    <Page>
      <ui-title-bar title={"Sovendus Voucher Network Settings"}>
        <button disabled={isSaving} onClick={handleSave}>
          Save Settings
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {Object.entries(availableCountries).map(
              ([countryKey, countryName]) => {
                const isEnabledId = "isEnabled";
                const sourceId = "trafficSourceNumber";
                const mediumId = "trafficMediumNumber";
                console.log("countryKey, countryName", countryKey, countryName);
                return (
                  <Card key={countryKey}>
                    <BlockStack gap="500">
                      <Text as={"h2"} variant="headingLg">
                        {countryName + " Settings"}
                      </Text>
                      <Checkbox
                        id={countryKey + isEnabledId}
                        label={"Enable Sovendus for " + countryName}
                        checked={formState?.[countryKey]?.[isEnabledId]}
                        onChange={(value) =>
                          handleFormChange(countryKey, isEnabledId, value)
                        }
                      />
                      <TextField
                        id={countryKey + sourceId}
                        helpText={
                          "Enter the traffic source number for " + countryName
                        }
                        label={countryName + " traffic source number"}
                        // labelHidden
                        autoComplete="off"
                        value={formState?.[countryKey]?.[sourceId]}
                        onChange={(value) =>
                          handleFormChange(countryKey, sourceId, value)
                        }
                        error={errors[sourceId]}
                      />
                      <TextField
                        id={countryKey + mediumId}
                        helpText={
                          "Enter the traffic medium number for " + countryName
                        }
                        label={countryName + " traffic medium number"}
                        autoComplete="off"
                        value={formState?.[countryKey]?.[mediumId]}
                        onChange={(value) =>
                          handleFormChange(countryKey, mediumId, value)
                        }
                        error={errors[mediumId]}
                      />
                    </BlockStack>
                  </Card>
                );
              }
            )}
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: isSaving,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
