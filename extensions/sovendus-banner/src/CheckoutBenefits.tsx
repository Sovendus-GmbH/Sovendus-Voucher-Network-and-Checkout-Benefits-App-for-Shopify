import {
  BlockStack,
  Heading,
  Button,
  Image,
  InlineLayout,
  Link,
  ListItem,
} from "@shopify/ui-extensions-react/checkout";
import type { ReactNode } from "react";
import type {
  CheckoutBenefitsData,
  CheckoutBenefitsImageData,
  CheckoutBenefitsRecommendationData,
} from "./api";

export default function CheckoutBenefits({
  country,
  zipCode,
  checkoutBenefits,
}: {
  country: string;
  zipCode: string;
  checkoutBenefits: CheckoutBenefitsData;
}): ReactNode {
  return (
    <BlockStack padding={"none"}>
      <Heading level={1}>
        {"Welches Dankeschön möchten Sie als Belohnung?"}
      </Heading>
      {checkoutBenefits.recommendations.map((recommendation, index) => (
        <CheckoutBenefitsOffer
          key={index}
          country={country}
          zipCode={zipCode}
          recommendation={recommendation}
        />
      ))}
    </BlockStack>
  );
}
function CheckoutBenefitsOffer({
  recommendation,
  country,
  zipCode,
}: {
  recommendation: CheckoutBenefitsRecommendationData;
  country: string;
  zipCode: string;
}): ReactNode {
  const teaserImage: CheckoutBenefitsImageData = recommendation.images.find(
    (image) => image.contentName === "teaserImage"
  );
  const heading = recommendation.texts.find(
    (text) => text.contentName === "teaserTitle"
  );
  const content: string[] = recommendation.texts
    .find((text) => text.contentName === "productListOfferAdvantages")
    .content.split("\n");
  // TODO
  const sessionUuid = "cb9d1466-b222-45bc-bc5f-0f204997dffb";
  const tm = "dae204cd-de5b-446c-9a8c-1a03664d3fc8";
  const initialTm = "dae204cd-de5b-446c-9a8c-1a03664d3fc8";

  return (
    <InlineLayout
      columns={[150, "fill"]}
      spacing={[`base`, `base`]}
      blockAlignment="center"
    >
      <Image
        source={
          "https://assets.sovendus.com/images/template/" +
          teaserImage.contentName +
          "/" +
          teaserImage.name +
          "." +
          teaserImage.fileExtension
        }
      />
      <BlockStack padding={"none"}>
        <Heading level={2}>{heading.content}</Heading>
        <CheckoutBenefitsProductAdvantages content={content} />
        <Link
          external={true}
          to={
            "https://press-list-api.sovendus.com/external?sessionUuid=" +
            sessionUuid +
            "&productOfferId=" +
            recommendation.productOfferId +
            "&agentId=" +
            recommendation.agentId +
            "&tm=" +
            tm +
            "&orderRouteId=" +
            recommendation.orderRouteId +
            "&gender=" +
            "null" +
            "&country=" +
            country +
            "&zipCode=" +
            zipCode +
            "&yearOfBirth=" +
            "null" +
            "&initialTm=" +
            initialTm +
            "&openNativeBrowser=true"
          }
        >
          <Button>Hier klicken »</Button>
        </Link>
      </BlockStack>
    </InlineLayout>
  );
}

function CheckoutBenefitsProductAdvantages({ content }: { content: string[] }) {
  return content.map((line, index) => {
    if (line.includes("**")) {
      return (
        <ListItem key={index}>
          {line.split("**").join("").replace("* ", "")}
        </ListItem>
      );
    }
    return <ListItem key={index}>{line.replace("* ", "")}</ListItem>;
  });
}

// function CheckMark() {
//   return (
//     <Image
//       fit={"contain"}
//       source="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg fill='%2321b04b'%3E%3Cpath d='M36.7316965,49.8564659 C40.4671772,52.5610471 43.4196363,58.0821544 45.4100716,62.5 C48.7389616,55.3357417 54.6041608,45.1874759 63,38 C56.1026275,41.8424865 49.8658483,47.0938242 45.4100716,55.0999985 C44.291568,52.8925373 40.4671772,50.3292102 36.7316965,49.8564659 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
//     />
//   );
// }
