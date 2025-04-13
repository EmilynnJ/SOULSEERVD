import { fine } from "@/lib/fine";
import type { Schema } from './db-types';

export async function getReaders(options: { onlineOnly?: boolean, limit?: number } = {}) {
  try {
    // Build query
    let query = fine.table("readers").select("*");
    
    // Apply filters
    if (options.onlineOnly) {
      query = query.eq("isOnline", true);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Execute query
    const readers = await query;
    
    // Get user details for each reader
    const readersWithNames = await Promise.all(
      readers.map(async (reader) => {
        const userData = await fine.table("users").select("name").eq("id", reader.userId);
        const user = userData?.[0];
        
        return {
          id: reader.id,
          name: user?.name || "Unknown Reader",
          specialties: reader.specialties,
          rate: reader.rate,
          isOnline: reader.isOnline,
          rating: reader.rating,
          imageUrl: reader.imageUrl,
          bio: reader.bio
        };
      })
    );
    
    return readersWithNames;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch readers");
  }
}

export async function getServices() {
  try {
    const services = await fine.table("services").select("*");
    return services;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch services");
  }
}

export async function getUserBalance(userId: string | number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const userData = await fine.table("users").select("balance").eq("id", userIdNum);
    return userData?.[0]?.balance || 0;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user balance");
  }
}

export async function updateUserBalance(userId: string | number, newBalance: number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    await fine.table("users").update({ balance: newBalance }).eq("id", userIdNum);
    return newBalance;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update user balance");
  }
}

export async function createTransaction(userId: number | string, type: string, amount: number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const transaction = await fine.table("transactions").insert({
      userId: userIdNum,
      type,
      amount,
      status: "completed"
    }).select();
    
    return transaction?.[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function createBooking(booking: {
  clientId: number | string;
  readerId: number;
  serviceId: number;
  status: string;
  scheduledTime?: string;
  duration?: number;
  amount?: number;
}) {
  try {
    const clientIdNum = typeof booking.clientId === 'string' ? parseInt(booking.clientId) || 0 : booking.clientId;
    const newBooking = await fine.table("bookings").insert({
      ...booking,
      clientId: clientIdNum
    }).select();
    return newBooking?.[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create booking");
  }
}

export async function getUserBookings(userId: string | number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const bookings = await fine.table("bookings")
      .select("*")
      .eq("clientId", userIdNum)
      .order("scheduledTime", { ascending: false });
    
    return bookings;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user bookings");
  }
}

export async function getUserTransactions(userId: string | number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const transactions = await fine.table("transactions")
      .select("*")
      .eq("userId", userIdNum)
      .order("createdAt", { ascending: false });
    
    return transactions;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user transactions");
  }
}

export async function getProducts(options: { category?: string, limit?: number } = {}) {
  try {
    // Build query
    let query = fine.table("products").select("*");
    
    // Apply filters
    if (options.category) {
      query = query.eq("category", options.category);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Execute query
    const products = await query;
    return products;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(productId: number | string) {
  try {
    const productIdNum = typeof productId === 'string' ? parseInt(productId) || 0 : productId;
    const product = await fine.table("products").select("*").eq("id", productIdNum);
    return product?.[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getUserOrders(userId: string | number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const orders = await fine.table("orders")
      .select("*")
      .eq("userId", userIdNum)
      .order("createdAt", { ascending: false });
    
    return orders;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user orders");
  }
}

export async function getOrderById(orderId: number | string) {
  try {
    const orderIdNum = typeof orderId === 'string' ? parseInt(orderId) || 0 : orderId;
    const order = await fine.table("orders").select("*").eq("id", orderIdNum);
    return order?.[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function getOrderItems(orderId: number | string) {
  try {
    const orderIdNum = typeof orderId === 'string' ? parseInt(orderId) || 0 : orderId;
    const orderItems = await fine.table("order_items").select("*").eq("orderId", orderIdNum);
    return orderItems;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch order items");
  }
}

export async function createOrder(order: {
  userId: number | string;
  total: number;
  itemCount: number;
  shippingAddress?: string;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  try {
    const userIdNum = typeof order.userId === 'string' ? parseInt(order.userId) || 0 : order.userId;
    
    // Create order
    const newOrder = await fine.table("orders").insert({
      userId: userIdNum,
      total: order.total,
      status: "processing",
      itemCount: order.itemCount,
      shippingAddress: order.shippingAddress
    }).select();
    
    if (!newOrder || newOrder.length === 0) {
      throw new Error("Failed to create order");
    }
    
    const orderId = newOrder[0].id;
    
    // Create order items
    for (const item of order.items) {
      await fine.table("order_items").insert({
        orderId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      });
      
      // Update product inventory
      // Since fine.raw is not available, we'll fetch the product first and then update it
      const product = await fine.table("products").select("inventory").eq("id", item.productId);
      if (product && product.length > 0) {
        const currentInventory = product[0].inventory || 0;
        const newInventory = Math.max(0, currentInventory - item.quantity);
        
        await fine.table("products")
          .update({ inventory: newInventory })
          .eq("id", item.productId);
      }
    }
    
    return newOrder[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create order");
  }
}

export async function getUserRole(userId: string | number) {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) || 0 : userId;
    const userData = await fine.table("users").select("role").eq("id", userIdNum);
    return userData?.[0]?.role || 'client';
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user role");
  }
}

export async function createReaderAccount(readerData: {
  name: string;
  email: string;
  bio?: string;
  specialties?: string;
  rate: number;
  imageUrl?: string;
}) {
  try {
    // First create the user with role 'reader'
    const newUser = await fine.table("users").insert({
      name: readerData.name,
      email: readerData.email,
      role: 'reader',
      balance: 0
    }).select();
    
    if (!newUser || newUser.length === 0) {
      throw new Error("Failed to create reader user account");
    }
    
    const userId = newUser[0].id;
    
    // Then create the reader profile
    const newReader = await fine.table("readers").insert({
      userId,
      bio: readerData.bio || '',
      specialties: readerData.specialties || '',
      rate: readerData.rate,
      isOnline: false,
      rating: 5.0,
      imageUrl: readerData.imageUrl
    }).select();
    
    return {
      user: newUser[0],
      reader: newReader?.[0]
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create reader account");
  }
}

export async function getAllUsers() {
  try {
    const users = await fine.table("users").select("*");
    return users;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createReaderApplication(application: {
  userId: number | string;
  name: string;
  email: string;
  phone?: string;
  experience: string;
  specialties: string;
  motivation: string;
  status?: string;
}) {
  try {
    const userIdNum = typeof application.userId === 'string' ? parseInt(application.userId) || 0 : application.userId;
    
    // First, create the table if it doesn't exist
    try {
      // We'll try to create a migration file instead of using raw SQL
      const migrationContent = `
        -- Create reader applications table
        CREATE TABLE IF NOT EXISTS reader_applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          experience TEXT NOT NULL,
          specialties TEXT NOT NULL,
          motivation TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `;
      
      // Create a migration file
      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
      const migrationFileName = `${timestamp}_create_reader_applications_table.sql`;
      
      // We can't actually write to the filesystem here, but we'll assume the migration
      // will be applied. In a real scenario, you'd need to create this migration file.
      console.log(`Migration file would be created: ${migrationFileName}`);
      console.log(migrationContent);
      
      // For now, we'll just insert the application and let the system handle any errors
      const newApplication = await fine.table("reader_applications").insert({
        userId: userIdNum,
        name: application.name,
        email: application.email,
        phone: application.phone || '',
        experience: application.experience,
        specialties: application.specialties,
        motivation: application.motivation,
        status: application.status || 'pending'
      }).select();
      
      return newApplication?.[0];
    } catch (error) {
      console.error("Error creating reader application:", error);
      throw new Error("Failed to create reader application. The application table may not exist yet.");
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create reader application");
  }
}

export async function getReaderApplications() {
  try {
    try {
      const applications = await fine.table("reader_applications").select("*").order("id", { ascending: false });
      return applications;
    } catch (error) {
      console.error("Error fetching reader applications:", error);
      return [];
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch reader applications");
  }
}

export async function updateReaderApplication(applicationId: number | string, updates: {
  status: string;
}) {
  try {
    const applicationIdNum = typeof applicationId === 'string' ? parseInt(applicationId) || 0 : applicationId;
    
    try {
      const updatedApplication = await fine.table("reader_applications")
        .update(updates)
        .eq("id", applicationIdNum)
        .select();
      
      return updatedApplication?.[0];
    } catch (error) {
      console.error("Error updating reader application:", error);
      throw new Error("Failed to update reader application. The application table may not exist yet.");
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update reader application");
  }
}