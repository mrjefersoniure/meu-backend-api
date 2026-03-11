export type User = {
  id: number;
  username: string;
  role: 'global_admin' | 'manager' | 'employee';
  unit_id: number | null;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
};

export type Unit = {
  id: number;
  name: string;
  address: string;
  created_at: string;
};

export type InventoryTemplate = {
  id: number;
  name: string;
  description: string;
  items: {
    name: string;
    category: string;
    unit: string;
    min_quantity: number;
    max_quantity: number;
  }[];
};

export type Product = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
  max_quantity: number;
  unit: string;
  active: number; // 1 for active, 0 for disabled
  image_url?: string;
};

export type RequestItem = {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit: string;
};

export type Request = {
  id: number;
  user_id: number;
  employee_name: string;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  items: RequestItem[];
};

export type UsageLog = {
  id: number;
  product_id: number;
  product_name: string;
  employee_name: string;
  quantity: number;
  usage_date: string;
};

export type Stats = {
  topUsage: { name: string; total: number }[];
  lowStock: Product[];
  summary: {
    total_products: number;
    pending_requests: number;
    total_items_in_stock: number;
  };
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ConfirmationState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning';
  onConfirm: () => void;
};
