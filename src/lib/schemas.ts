import { z } from "zod";

export type Category = {
  id: string;
  slug: string;
  name: string;
  number: string;
  blurb: string;
  hero_image_url: string;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  price_paise: number;
  image_url: string;
  available: boolean;
  sort_order: number;
  created_at: string;
  category_id: string | null;
  flavour: string;
  weight_grams: number;
  coming_soon: boolean;
};

export type ProductWithCategory = Product & {
  categories: { slug: string; name: string; number: string } | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  flavour: string;
  unit_price_paise: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  total_paise: number;
  status: string;
  created_at: string;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, { message: "Name is required" }).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, { message: "Enter a valid mobile number" }),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  address: z.string().trim().min(6, { message: "Enter your full address" }).max(500),
  city: z.string().trim().min(1, { message: "City is required" }).max(100),
  state: z.string().trim().min(1, { message: "State is required" }).max(100),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, { message: "Enter a 6-digit pincode" }),
  notes: z.string().trim().max(500).default(""),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1, { message: "Your cart is empty" })
    .max(30),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productInputSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, { message: "Lowercase letters, numbers and hyphens only" })
    .max(120),
  description: z.string().trim().max(500).default(""),
  price_paise: z.number().int().min(0).max(10000000),
  image_url: z.string().trim().max(1000).default(""),
  available: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(10000).default(0),
  category_id: z.string().uuid().nullable().default(null),
  flavour: z.string().trim().min(1).max(60).default("ORIGINAL"),
  weight_grams: z.number().int().min(0).max(100000).default(200),
  coming_soon: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export function formatINR(pricePaise: number): string {
  return `₹${(pricePaise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
