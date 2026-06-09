# Brands By Status

Custom storefront for Brands By Status with Printify-ready product sync and order API routes.

## Local Development

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
```

## Printify Setup

Create a local `.env` from `.env.example`:

```bash
PRINTIFY_API_TOKEN=your_printify_personal_access_token
PRINTIFY_SHOP_ID=your_printify_shop_id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=choose_a_private_admin_password
STRIPE_SECRET_KEY=sk_test_or_live_key
SITE_URL=https://brandsbystatus.vercel.app
SHIPPING_RATE_CENTS=599
PRINTIFY_SHIPPING_METHOD=1
```

The API token must stay server-side. Do not put it in `src/` or expose it with a `VITE_` prefix.

Useful routes:

- `GET /api/printify-shops`: lists shops connected to the Printify account. Use this to find `PRINTIFY_SHOP_ID`.
- `GET /api/printify-products`: loads products for `PRINTIFY_SHOP_ID` and maps them into storefront product cards.
- `POST /api/printify-order`: creates a Printify order for existing Printify products.

For deployment on Vercel, add `PRINTIFY_API_TOKEN` and `PRINTIFY_SHOP_ID` in the project environment variables.

## Supabase Category Backend

The admin backend stores custom categories and product assignments in Supabase.

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase-schema.sql`.
4. Add these variables locally and in Vercel production:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=choose_a_private_admin_password
```

The service role key must stay server-side. Never expose it with a `VITE_` prefix.

Useful category routes:

- `GET /api/product-categories`: returns categories and product assignments.
- `POST /api/admin-auth`: validates the admin password.
- `POST /api/product-categories`: creates/deletes categories and assigns/unassigns products. Requires `x-admin-password`.

Admin dashboard:

```text
/admin
```

Use it to create categories and assign Printify products to them. The storefront uses those saved categories for the customer-facing filter tabs.

## Important Fulfillment Note

Customer checkout goes through Stripe first. After Stripe returns a paid checkout session to `/checkout-success`, the app calls `/api/stripe-fulfill`, verifies the payment server-side, and creates the Printify order exactly once.

Useful checkout routes:

- `POST /api/create-checkout-session`: creates a Stripe Checkout Session from verified Printify products and variants.
- `POST /api/stripe-fulfill`: verifies a paid Stripe session and creates the Printify order.
- `POST /api/printify-order`: protected admin/test route for direct Printify order creation.

Printify can auto-approve orders depending on the store's order approval settings, so keep Printify set to manual approval until checkout is fully tested.
