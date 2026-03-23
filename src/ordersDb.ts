// IndexedDB helper for orders storage

const DB_NAME = 'zintago-orders';
const DB_VERSION = 1;
const STORE_NAME = 'orders';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
}

// Open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'orderNumber' });
      }
    };
  });
};

// Save an order
export const saveOrder = async (order: Order): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(order);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Sort by date descending (newest first)
      const orders = request.result.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      resolve(orders);
    };
  });
};

// Get a single order by order number
export const getOrder = async (orderNumber: string): Promise<Order | undefined> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(orderNumber);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Delete an order
export const deleteOrder = async (orderNumber: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(orderNumber);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Clear all orders
export const clearAllOrders = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
