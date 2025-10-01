// User & Auth
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

// Category
export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    productCount?: number;
}

// Product
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    images: string[];
    categoryId: string;
    categoryName?: string;
    categorySlug?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Cart
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: {
        name: string;
        price: number;
        stock: number;
        images: string[];
        sku: string;
        isActive: boolean;
    };
    itemTotal: number;
}

export interface Cart {
    cartId: string;
    items: CartItem[];
    itemCount: number;
    total: number;
}

// Order
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    total: number;
    paymentMethod?: string;
    paymentStatus?: string;
    shippingAddress: Address;
    billingAddress: Address;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
    itemCount?: number;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        name: string;
        sku: string;
        images: string[];
    };
}

export interface CreateOrderData {
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod?: string;
    notes?: string;
}

// Quotation
export interface Quotation {
    id: string;
    quotationNumber: string;
    userId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    total: number;
    validUntil: string;
    notes?: string;
    customerNotes?: string;
    createdAt: string;
    updatedAt: string;
    items?: QuotationItem[];
    itemCount?: number;
}

export interface QuotationItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        name: string;
        sku: string;
        images: string[];
    };
}

export interface CreateQuotationData {
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    validUntil: string;
    notes?: string;
    customerNotes?: string;
}

// API Response
export interface ApiResponse<T> {
    status: 'success' | 'error' | 'fail';
    message?: string;
    data?: T;
}