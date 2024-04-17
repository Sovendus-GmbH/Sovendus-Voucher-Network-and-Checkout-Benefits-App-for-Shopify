cp -n .env-example .env
# add the shopify api key and the app domain to .env
docker build --tag sovendus-shopify .
docker stop sovendus-shopify
docker rm sovendus-shopify
docker run --name sovendus-shopify -v ./path-to-session-storage:/app/prisma/db sovendus-shopify