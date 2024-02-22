import {
  Heading,
  Text,
  Button,
  Image,
  InlineLayout,
  Link,
} from "@shopify/ui-extensions-react/checkout";
import type { ReactNode } from "react";
import type { BannerImageResponseData, BannerNativeResponseData } from "./api";

export function SovendusImageBanner({
  bannerData,
}: {
  bannerData: BannerImageResponseData;
}): ReactNode {
  return (
    <>
      <Link external={true} to={bannerData.bannerUrl}>
        <Image source={bannerData.bannerImageUrl} />
      </Link>
      <DataUsageText bannerData={bannerData} />
    </>
  );
}

export function SovendusNativeBanner({
  bannerData,
}: {
  bannerData: BannerNativeResponseData;
}): ReactNode {
  return (
    <>
      <Heading level={1}>{bannerData.title}</Heading>
      <InlineLayout
        columns={[90, "fill"]}
        spacing={[`base`, `base`]}
        // inlineAlignment="center"
        blockAlignment="center"
        // blockAlignment="end"
      >
        <Image source={bannerData.imageUrl} />
        <Text>
          {bannerData.description.map((textItem, index) =>
            textItem.bold ? (
              <Text key={index} emphasis="bold">
                {textItem.text}
              </Text>
            ) : (
              textItem.text
            )
          )}
        </Text>
      </InlineLayout>
      <Link external={true} to={bannerData.bannerUrl}>
        <Button>{bannerData.selectVoucherText}</Button>
      </Link>
      <DataUsageText bannerData={bannerData} />
    </>
  );
}

function DataUsageText({
  bannerData,
}: {
  bannerData: BannerImageResponseData | BannerNativeResponseData;
}): ReactNode {
  return (
    <Text size="extraSmall">
      {bannerData.dataUsageText?.map((textBlock, index) => {
        if (textBlock.url) {
          return (
            <Link key={index} to={textBlock.url}>
              {textBlock.text}
            </Link>
          );
        }
        return textBlock.text;
      })}
    </Text>
  );
}
