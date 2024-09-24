# Shopify App for Sovendus Voucher Network and Checkout Benefits

## This documentation is only for the new Shopify version
> [!WARNING]
> The Shopify app only works if you have upgraded your thank you / order status page to the "Checkout extensibility" version, the [docs for the old version can be found here](https://developer-hub.sovendus.com/Voucher-Network-Checkout-Benefits/Web-Integration/Shopify-Integration-(old-version))

### How to check if you are using the new Shopify checkout version
To check your thank you / order status page version go to "Settings -> Checkout", if you are on the new version it should look like on the screenshot below:

![New Shopify Checkout Version](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-App-for-Shopify/main/newShopifyCheckoutVersion.png)

## Create discount codes in bulk

If you use the Voucher Network, it's recommended to use a tool to create voucher codes in bulk \
You can use for example [Bulk Discounts](https://apps.shopify.com/bulk-discounts) to create multiple discount codes at once

## 1. Send your Shopify admin URL and color code to Sovendus

a. To generate a installation link, we need the url of your Shopify backend e.g. https://admin.shopify.com/store/my-store

b. Get the color code for the buttons on the checkout page

- Go to Settings -> Checkout -> click on Customize to customize your checkout pages
- Click on the gear icon to open the settings sidebar
- Scroll down to the colors section and copy the color code for buttons

  ![Get the color code of your checkout buttons](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-App-for-Shopify/main/color_code.png)

c. Send the backend url and color code to Sovendus

## 2. Install the app

Open the installation URL you will receive from Sovendus and click on install

## 3. Configure the App

Go to the Sovendus App and enter the traffic source and medium numbers for each country

## 4. Place the widget on the success page

- Go to Settings -> Checkout -> click on Customize to customize your checkout pages
- Click on Checkout in the top middle and then on Thank you
- Click on Add app block on the bottom left, then on Sovendus Voucher Network (make sure the widget is positioned as on the screenshot below) and then Save
  
  ![Thank you page Sovendus widget position](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-App-for-Shopify/main/thank-you-position.png)
- Click on Thank you in the top middle and then on Order status
- Click on Add app block on the bottom left, then on Sovendus Voucher Network (make sure the widget is positioned as on the screenshot below) and then Save
  
  ![Order status page Sovendus widget position](https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-App-for-Shopify/main/order-status-position.png)
