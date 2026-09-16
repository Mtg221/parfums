import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  runTransaction 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderFormData, OrderStatus, ProductFormat } from '@/types';

const ORDERS_COLLECTION = 'orders';

export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        id: docSnap.id,
        customerName: data.customerName || '',
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || '',
        productId: data.productId || '',
        productName: data.productName || '',
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        formatId: data.formatId || '',
        sizeMl: data.sizeMl || 0,
        quantity: data.quantity || 1,
        unitPrice: data.unitPrice || 0,
        totalPrice: data.totalPrice || 0,
        status: (data.status as OrderStatus) || 'new',
        whatsappOpened: data.whatsappOpened ?? true,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      customerName: data.customerName || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes || '',
      productId: data.productId || '',
      productName: data.productName || '',
      categoryId: data.categoryId || '',
      categoryName: data.categoryName || '',
      formatId: data.formatId || '',
      sizeMl: data.sizeMl || 0,
      quantity: data.quantity || 1,
      unitPrice: data.unitPrice || 0,
      totalPrice: data.totalPrice || 0,
      status: (data.status as OrderStatus) || 'new',
      whatsappOpened: data.whatsappOpened ?? true,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    };
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
}

/**
 * Creates an order in Firestore securely after validating format, price, and stock in Firestore transaction.
 */
export async function createOrder(formData: OrderFormData): Promise<Order> {
  if (!formData.customerName.trim()) throw new Error('Le nom du client est obligatoire.');
  if (!formData.phone.trim()) throw new Error('Le numéro de téléphone est obligatoire.');
  if (!formData.address.trim()) throw new Error("L'adresse de livraison est obligatoire.");
  if (formData.quantity < 1) throw new Error('La quantité doit être d\'au moins 1.');

  const productRef = doc(db, 'products', formData.productId);

  return await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Le parfum sélectionné est introuvable.');
    }

    const productData = productSnap.data();
    const formats: ProductFormat[] = productData.formats || [];
    
    // Find format
    const formatIndex = formats.findIndex(f => f.id === formData.formatId || f.sizeMl === formData.sizeMl);
    if (formatIndex === -1) {
      throw new Error('Le format sélectionné n\'est pas disponible pour ce parfum.');
    }

    const selectedFormat = formats[formatIndex];
    
    // Check stock
    if (selectedFormat.stock < formData.quantity) {
      throw new Error(`Stock insuffisant (${selectedFormat.stock} disponible(s) en ${selectedFormat.sizeMl} mL).`);
    }

    // Official calculations
    const officialUnitPrice = selectedFormat.price;
    const officialTotalPrice = officialUnitPrice * formData.quantity;

    // Decrement stock
    formats[formatIndex].stock -= formData.quantity;
    transaction.update(productRef, {
      formats: formats,
      updatedAt: serverTimestamp(),
    });

    // Create new order doc reference
    const orderRef = doc(collection(db, ORDERS_COLLECTION));
    const orderData = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      notes: formData.notes?.trim() || '',
      productId: formData.productId,
      productName: productData.name || formData.productName,
      categoryId: productData.categoryId || formData.categoryId,
      categoryName: productData.categoryName || '',
      formatId: selectedFormat.id,
      sizeMl: selectedFormat.sizeMl,
      quantity: formData.quantity,
      unitPrice: officialUnitPrice,
      totalPrice: officialTotalPrice,
      status: 'new' as OrderStatus,
      whatsappOpened: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    transaction.set(orderRef, orderData);

    return {
      id: orderRef.id,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
}
