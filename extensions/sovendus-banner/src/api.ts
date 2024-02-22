import { useAppMetafields } from "@shopify/ui-extensions-react/checkout";
import type {
  AppMetafieldEntry,
  Currency,
  MailingAddress,
} from "@shopify/ui-extensions/checkout";

interface SovendusAppMetafieldEntry extends AppMetafieldEntry {
  metafield: {
    key: string;
    namespace: string;
    value: string;
    valueType: "string";
    type: string;
  };
}

export function useGetTrafficNumbers(
  addressData: MailingAddress
): [boolean, string, string] | [boolean, undefined, undefined] {
  const metafields = useAppMetafields({
    namespace: "sovendus_settings",
    key: "sovendus_settings_values",
  });
  const sovendusSettings: storedFormData = metafields?.[0]?.metafield?.value
    ? JSON.parse((metafields as SovendusAppMetafieldEntry[])[0].metafield.value)
    : {};
  const trafficSourceNumber = sovendusSettings[addressData.countryCode]?.[0];
  const trafficMediumNumber = sovendusSettings[addressData.countryCode]?.[1];
  const isEnabled =
    sovendusSettings[addressData.countryCode]?.[2] &&
    Boolean(trafficSourceNumber && trafficMediumNumber);
  return [isEnabled, trafficSourceNumber, trafficMediumNumber];
}

export function getBannerData({
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
}: {
  setBannerData: React.Dispatch<React.SetStateAction<BannerResponseData>>;
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  orderConfirmationNumber: string;
  netOrderValue: number;
  currency: Currency;
  voucherCode: string;
  addressData: MailingAddress;
  email: string;
  phone: string;
}): void {
  const url = "https://identification-api.sovendus.com/token";
  const requestBody: BannerRequestData = {
    trafficSourceNumber: trafficSourceNumber,
    trafficMediumNumber: trafficMediumNumber,
    orderId: orderConfirmationNumber,
    orderValue: netOrderValue,
    orderCurrency: currency.isoCode,
    usedCouponCode: voucherCode,
    firstName: addressData.firstName,
    lastName: addressData.lastName,
    zip: addressData.zip,
    city: addressData.city,
    email: email,
    phone: phone,
    country: addressData.countryCode,
  };
  console.log("requestBody", requestBody);
  fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("response", response);
      console.log("bannerData", newBannerData);
      setBannerData(newBannerData);
    });
}

interface BannerRequestData {
  trafficSourceNumber: string;
  trafficMediumNumber: string;
  orderId: string;
  orderValue: number;
  orderCurrency: string;
  usedCouponCode: string;
  firstName: string;
  lastName: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
  country: string;
}

export interface BannerResponseData {
  nativeBanner?: BannerNativeResponseData;
  imageBanner?: BannerImageResponseData;
  checkoutBenefits?: CheckoutBenefitsData;
}

export interface BannerNativeResponseData {
  title: string;
  description: {
    text: string;
    bold?: boolean;
  }[];
  imageUrl: string;
  selectVoucherText: string;
  bannerUrl: string;
  dataUsageText: {
    text: string;
    url?: string;
  }[];
}

export interface BannerImageResponseData {
  bannerImageUrl: string;
  bannerUrl: string;
  dataUsageText: {
    text: string;
    url?: string;
  }[];
}

const newBannerData: BannerResponseData = {
  imageBanner: {
    bannerImageUrl: "https://i.ibb.co/W2f3xrp/banner6.png",
    bannerUrl: "https://online.sovendus.com/online-datenschutzhinweise/",
    dataUsageText: [
      { text: "Hinweise zur " },
      {
        text: "Datenverarbeitung",
        url: "https://online.sovendus.com/online-datenschutzhinweise/",
      },
      { text: " durch Sovendus" },
    ],
  },
  // nativeBanner: {
  //   title: "1 kleines Geschenk wartet auf Dich!",
  //   description: [
  //     {
  //       text: "Als Dankeschön für Deine Bestellung kannst Du Dir jetzt einen ",
  //     },
  //     { text: "exklusiven Gutschein", bold: true },
  //     { text: " aus unserem Partnernetzwerk aussuchen." },
  //   ],
  //   imageUrl:
  //     "https://assets.sovendus.com/banner/assets/images/giftbox_01_percentage_anim_bounce.svg",
  //   selectVoucherText: "Gutschein auswählen",
  //   bannerUrl:
  //     "https://www.sovendus-network.com/app-sales/4049b0ca-4160-471d-b608-9633140bc28f/4049b0ca-4160-471d-b608-9633140bc28f/cd01ad5e-0f88-4c18-9a9b-ec6fa0e9e282/13f1b537-91c3-5adb-9462-d2276b00f5ce#voucherStyle=noimage",
  //   dataUsageText: [
  //     { text: "Hinweise zur " },
  //     {
  //       text: "Datenverarbeitung",
  //       url: "https://online.sovendus.com/online-datenschutzhinweise/",
  //     },
  //     { text: " durch Sovendus" },
  //   ],
  // },
  checkoutBenefits: {
    recommendations: [
      {
        type: "order_route",
        orderRouteId: 36364,
        template: "product_variant_selection",
        productOfferId: "0fa773f4-0fe1-4b39-8f61-6bb6cfa5bfbe",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: false,
        productName: "Geb\u00fchrenfrei Mastercard Gold",
        displayName: "Geb\u00fchrenfrei Mastercard Gold",
        texts: [
          {
            content:
              "Geb\u00fchrenfrei Mastercard Gold +  50 \u20ac Startguthaben oder 50 \u20ac Tankgutschein gratis",
            contentName: "teaserTitle",
          },
          {
            content:
              "* 0,- \u20ac Jahresgeb\u00fchr\n* Kein Kontowechsel notwendig\n* **0 \u20ac Auslandseinsatzgeb\u00fchr**\n* Umfassende Reiseversicherung\n* **Ihr sicherer Begleiter f\u00fcr die n\u00e4chste Reise**",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "4924ad0d-bfe7-4d25-9cd1-b4a5dcf4d104",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "free",
            value: null,
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 46901,
        template: "external_landingpage",
        productOfferId: "362ef411-e0f5-47bf-9b35-c08e35dd6fa2",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: true,
        productName: "KIA Probefahrt",
        displayName: "KIA Probefahrt",
        texts: [
          {
            content: "Jetzt den neuen vollelektrischen Kia EV6 Probe fahren!",
            contentName: "teaserTitle",
          },
          {
            content:
              "* Athletisches Design\n* Ultraschnelles Laden\u00b9\n* Optimierte Performance",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "6da5e94e-9eff-4700-9b85-72d82cff21a0",
            fileExtension: "jpg",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 32339,
        template: "media_type_selection",
        productOfferId: "ad766859-223f-40b4-9b66-628eef1ff3c8",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: false,
        productName: "Dingolfinger Anzeiger",
        displayName: "Dingolfinger Anzeiger",
        texts: [
          {
            content: "Dingolfinger Anzeiger 2 Wochen gratis",
            contentName: "teaserTitle",
          },
          {
            content:
              "* Jetzt kostenlos testen\n* Belieferung endet automatisch\n* Keine K\u00fcndigung notwendig",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "922a6264-1b84-4d7f-b025-93400888cbd3",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "REGIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "free",
            value: null,
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 38821,
        template: "external_landingpage",
        productOfferId: "92c3f699-dcba-4fbc-a4b2-a52c8192cfbf",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: true,
        productName: "Clark Versicherung",
        displayName: "Clark Versicherung",
        texts: [
          {
            content:
              "Registrieren und bis zu 300 \u20ac Amazon.de Gutscheine sichern",
            contentName: "teaserTitle",
          },
          {
            content:
              "* Manage deine Versicherungen digital & dauerhaft kostenlos\n* Bessere Tarifvorschl\u00e4ge aus dem ganzen Markt\n* Vertr\u00e4ge digitalisieren und je Versicherung einen 15 \u20ac Amazon.de Gutschein erhalten",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "b7f1b065-b40d-492c-83e4-dd4be2a13a34",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "free",
            value: null,
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 39971,
        template: "media_type_selection",
        productOfferId: "e41dfb6f-f289-40ab-a8ce-27fb20d972e2",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: false,
        productName: "Landauer Neue Presse",
        displayName: "Landauer Neue Presse",
        texts: [
          {
            content: "Landauer Neue Presse 2 Wochen gratis",
            contentName: "teaserTitle",
          },
          {
            content:
              "* Jetzt kostenlos testen\n* Belieferung endet automatisch\n* Keine K\u00fcndigung notwendig",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "79d67ac6-691a-44ca-9f16-8048d0db1db2",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "REGIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "free",
            value: null,
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 28501,
        template: "external_landingpage",
        productOfferId: "87ef4eee-390a-4452-b57a-422ad0adc0ff",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: true,
        productName: "KIA Probefahrt",
        displayName: "KIA Probefahrt",
        texts: [
          {
            content: "JETZT DEN NEUEN KIA SPORTAGE PROBE FAHREN!",
            contentName: "teaserTitle",
          },
          {
            content:
              "* Moderne Hybrid-L\u00f6sungen \n* Bequemes und effizientes Ladeerlebnis \n* Technologie f\u00fcr deine Sicherheit",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "ce60e1ac-fcae-4379-8474-e08c5498b053",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "free",
            value: null,
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 8948,
        template: "starting",
        productOfferId: "0f294708-8631-4c89-986d-db6d82a2930e",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: false,
        productName: "c't",
        displayName: "c't",
        texts: [
          {
            content: "4x c't + 10 \u20ac Amazon-Gutschein gratis",
            contentName: "teaserTitle",
          },
          {
            content:
              "* 4 druckfrische Hefte - 34 % sparen\n* Portofreie Lieferung an Ihre Wunschadresse\n* Beliebter 10 \u20ac Amazon-Gutschein gratis\n* Europas gr\u00f6\u00dftes IT- & Tech-Magazin",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "777371de-ed16-4d55-816a-7ec1e96e8690",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [
          {
            name: "savings",
            option: "percent",
            value: "34",
          },
        ],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 37655,
        template: "starting",
        productOfferId: "fc2ab9fc-e8b9-4468-950d-e23369ab171e",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: false,
        productName: "Bergsteiger",
        displayName: "Bergsteiger",
        texts: [
          {
            content: "2x Bergsteiger",
            contentName: "teaserTitle",
          },
          {
            content:
              "* 2 Ausgaben f\u00fcr nur 4,90 \u20ac\n* 64 % sparen\n* Portofreie Lieferung",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "2328fbab-ada4-477f-959d-cfb1d81b601f",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "REGIONAL",
        hideHighlightText: false,
        disturbers: [],
        isAppended: false,
      },
      {
        type: "order_route",
        orderRouteId: 43366,
        template: "external_landingpage",
        productOfferId: "9afd20b0-43e8-4884-b986-3107225ebd82",
        agentId: "b4084f43-60ac-4eb2-8c5e-b4ca81036b53",
        isExternal: true,
        productName: "Gewinnspiele_DE",
        displayName: "Gewinnspiele",
        texts: [
          {
            content: "Gewinnen Sie ein Apple iPhone 14",
            contentName: "teaserTitle",
          },
          {
            content:
              "* 100% kostenfrei\n* Zertifiziertes Gewinnspiel\n* Garantierte Auslosung",
            contentName: "productListOfferAdvantages",
          },
        ],
        images: [
          {
            name: "213344f0-4aea-4cb2-ad98-69bd708024f0",
            fileExtension: "png",
            contentName: "teaserImage",
          },
        ],
        distributionType: "NATIONAL",
        hideHighlightText: false,
        disturbers: [],
        isAppended: false,
      },
    ],
    country: "DE",
    locale: "de_DE",
    gender: "MALE",
    zipCode: "94419",
    yearOfBirth: 1991,
    tm: {
      shopId: 5364,
      shopCss: true,
      shopLogo:
        "https://assets.sovendus.com/images/shop/5364/logo.png?41d8222b",
    },
    hadZip: true,
  },
};

export interface CheckoutBenefitsImageData {
  name: string;
  fileExtension: "png" | "jpg" | "jpeg" | "svg";
  contentName: "teaserImage";
}
export interface CheckoutBenefitsRecommendationData {
  type: string;
  orderRouteId: number;
  template: string;
  productOfferId: string;
  agentId: string;
  isExternal: boolean;
  productName: string;
  displayName: string;
  texts: CheckoutBenefitsTextsData[];
  images: CheckoutBenefitsImageData[];
  distributionType: "NATIONAL" | "REGIONAL";
  hideHighlightText: boolean;
  disturbers: { name: string; option: string; value }[];
  isAppended: boolean;
}

export interface CheckoutBenefitsTextsData {
  content: string;
  contentName: "teaserTitle" | "productListOfferAdvantages";
}

export interface CheckoutBenefitsData {
  recommendations: CheckoutBenefitsRecommendationData[];
  country: string;
  locale: string;
  gender: string;
  zipCode: string;
  yearOfBirth: number;
  tm: { shopId: number; shopCss: boolean; shopLogo: string };
  hadZip: boolean;
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
