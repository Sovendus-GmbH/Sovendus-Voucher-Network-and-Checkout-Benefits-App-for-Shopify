import {
  reactExtension,
  BlockStack,
  useApi,
  useCurrency,
  useDiscountCodes,
  useTotalShippingAmount,
  useTotalTaxAmount,
  useTotalAmount,
  useShippingAddress,
  useEmail,
  usePhone,
} from "@shopify/ui-extensions-react/checkout";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import CheckoutBenefits from "./CheckoutBenefits";
import { SovendusImageBanner, SovendusNativeBanner } from "./VoucherNetwork";
import type { BannerResponseData } from "./api";
import { getBannerData, useGetTrafficNumbers } from "./api";

const thankYouBlock = reactExtension("purchase.thank-you.block.render", () => (
  <ThankYouSovendusBanner />
));
export { thankYouBlock };

const orderDetailsBlock = reactExtension(
  "customer-account.order-status.block.render",
  () => <OrderStatusSovendusBanner />
);
export { orderDetailsBlock };

interface Api {
  orderConfirmation?: { current: { number: string } };
  order?: { current: { confirmationNumber: string } };
}

function ThankYouSovendusBanner(): ReactNode {
  const api = useApi();
  const orderConfirmationNumber = (api as Api).orderConfirmation.current.number;
  return (
    orderConfirmationNumber !== undefined && (
      <SovendusBanner orderConfirmationNumber={orderConfirmationNumber} />
    )
  );
}

function OrderStatusSovendusBanner(): ReactNode {
  const api = useApi();
  const orderConfirmationNumber = (api as Api).order.current.confirmationNumber;
  return (
    orderConfirmationNumber !== undefined && (
      <SovendusBanner orderConfirmationNumber={orderConfirmationNumber} />
    )
  );
}

function SovendusBanner({
  orderConfirmationNumber,
}: {
  orderConfirmationNumber: string;
}): ReactNode {
  const [bannerData, setBannerData] = useState<BannerResponseData>();
  const currency = useCurrency();
  const addressData = useShippingAddress();
  const [isEnabled, trafficSourceNumber, trafficMediumNumber] =
    useGetTrafficNumbers(addressData);
  const voucherCodes = useDiscountCodes();
  const voucherCode = voucherCodes?.length > 0 ? voucherCodes[0].code : "";
  const shippingPrice = useTotalShippingAmount();
  const taxPrice = useTotalTaxAmount();
  const grossPrice = useTotalAmount();
  const email = useEmail();
  const phone = usePhone();
  const netOrderValue =
    Number(grossPrice?.amount) -
    Number(taxPrice?.amount) -
    Number(shippingPrice?.amount);

  useEffect(() => {
    console.log("started", isEnabled, netOrderValue)
    if (isEnabled && netOrderValue) {
      console.log("enabled")
      getBannerData({
        setBannerData,
        trafficSourceNumber,
        trafficMediumNumber,
        orderConfirmationNumber,
        netOrderValue,
        currency,
        voucherCode,
        addressData,
        email,
        phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);
  return (
    !!bannerData && (
      <BlockStack border="base" padding="base" borderRadius="base">
        {bannerData.nativeBanner ? (
          <SovendusNativeBanner bannerData={bannerData.nativeBanner} />
        ) : (
          <SovendusImageBanner bannerData={bannerData.imageBanner} />
        )}
        {bannerData.checkoutBenefits && (
          <CheckoutBenefits
            checkoutBenefits={bannerData.checkoutBenefits}
            country={addressData.countryCode}
            zipCode={addressData.zip}
          />
        )}
      </BlockStack>
    )
  );
}
