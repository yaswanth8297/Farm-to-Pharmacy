import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PLANTS,
  INITIAL_FARMER_LISTINGS,
  INITIAL_FARMER_ORDERS,
  INITIAL_BUYER_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../constants/plantData';
import { StorageService } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Roles: null (Splash), 'farmer', 'buyer'
  const [role, setRole] = useState(null);

  // Screen navigation
  // Farmer tabs: 'home' | 'upload' | 'listings' | 'rewards' | 'orders' | 'profile' | 'notifications'
  // Buyer tabs: 'home' | 'browse' | 'cart' | 'orders' | 'profile' | 'detail' | 'orderPlaced' | 'notifications'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Selected plant for detail viewing
  const [selectedPlant, setSelectedPlant] = useState(INITIAL_PLANTS[0]);

  // Master Plants Catalog
  const [plants, setPlants] = useState(INITIAL_PLANTS);

  // Farmer State
  const [farmerListings, setFarmerListings] = useState(INITIAL_FARMER_LISTINGS);
  const [farmerOrders, setFarmerOrders] = useState(INITIAL_FARMER_ORDERS);
  const [rewardPoints, setRewardPoints] = useState(1240);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);

  // Buyer State
  const [cart, setCart] = useState([
    { plant: INITIAL_PLANTS[0], quantity: 3 }, // Tulsi 3kg
    { plant: INITIAL_PLANTS[3], quantity: 2 }, // Turmeric 2kg
  ]);
  const [buyerOrders, setBuyerOrders] = useState(INITIAL_BUYER_ORDERS);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Shared State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [offlineDrafts, setOfflineDrafts] = useState([]);

  // Modals & Interactive Overlays
  const [provenanceModalVisible, setProvenanceModalVisible] = useState(false);
  const [activeProvenanceBatch, setActiveProvenanceBatch] = useState(null);
  const [aiScanModalVisible, setAiScanModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Load persisted drafts and state on mount
  useEffect(() => {
    (async () => {
      const drafts = await StorageService.getDrafts();
      if (drafts && drafts.length > 0) {
        setOfflineDrafts(drafts);
      }
      const savedPoints = await StorageService.getItem(StorageService.STORAGE_KEYS.REWARDS_POINTS, 1240);
      setRewardPoints(savedPoints);
    })();
  }, []);

  // Save drafts into AsyncStorage
  const saveOfflineDraft = async (draft) => {
    const draftItem = {
      ...draft,
      id: draft.id || `draft_${Date.now()}`,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = await StorageService.saveDraft(draftItem);
    setOfflineDrafts(updated);
    showToast('Draft saved offline locally on device');
  };

  const removeOfflineDraft = async (draftId) => {
    const updated = await StorageService.removeDraft(draftId);
    setOfflineDrafts(updated);
  };

  // Farmer listing creation
  const addFarmerListing = (newListing) => {
    const pointsAwarded = Math.floor(Math.random() * 60) + 35; // 35 - 95 points
    const earnedVal = Number(newListing.quantity) * Number(newListing.pricePerKg);
    const item = {
      id: `list_${Date.now()}`,
      plantId: newListing.plantId || 'plant_custom',
      name: newListing.name,
      quantity: Number(newListing.quantity),
      unit: 'kg',
      pricePerKg: Number(newListing.pricePerKg),
      earned: earnedVal,
      points: pointsAwarded,
      timeText: 'Just now',
      status: 'Live',
      image: newListing.image || INITIAL_PLANTS[0].image,
      batchCode: `BATCH-${newListing.name.substring(0, 3).toUpperCase()}-2026-${Math.floor(Math.random() * 900) + 100}`,
      harvestDate: newListing.harvestDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      batchHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      farmerName: 'Ramesh Kumar',
      farmerLocation: 'Pune, Maharashtra',
    };

    setFarmerListings([item, ...farmerListings]);
    const updatedPoints = rewardPoints + pointsAwarded;
    setRewardPoints(updatedPoints);
    StorageService.setItem(StorageService.STORAGE_KEYS.REWARDS_POINTS, updatedPoints);

    // Also add to marketplace plants catalog
    const newCatalogPlant = {
      id: `plant_${Date.now()}`,
      name: newListing.name,
      scientificName: newListing.scientificName || `${newListing.name} officinalis`,
      hindiName: newListing.hindiName || newListing.name,
      category: newListing.category || 'Immunity',
      tag: 'Fresh Harvest',
      badge: 'Organic',
      price: Number(newListing.pricePerKg),
      unit: 'kg',
      stock: Number(newListing.quantity),
      rating: 5.0,
      reviewsCount: 1,
      farmerId: 'farmer_1',
      farmerName: 'Ramesh Kumar',
      farmerLocation: 'Pune, Maharashtra',
      farmerCertified: true,
      harvestDate: item.harvestDate,
      batchCode: item.batchCode,
      batchHash: item.batchHash,
      labReport: 'Verified Organic by Krishi Kendra Inspector',
      moistureContent: '8.5%',
      activeCompounds: newListing.activeCompounds || ['Organic Polyphenols'],
      medicinalBenefits: newListing.medicinalBenefits || 'Authentic traditional therapeutic herb',
      benefitTags: ['Organic', 'Direct Farm'],
      description: newListing.description || 'Harvested fresh under sustainable agrarian practices.',
      image: item.image,
      heroImage: item.image,
    };
    setPlants([newCatalogPlant, ...plants]);

    // Add notification
    addNotification({
      title: 'Listing Published!',
      message: `${newListing.name} (${newListing.quantity} kg) is now live on the B2B marketplace. Earned +${pointsAwarded} pts!`,
      icon: 'leaf',
      type: 'listing',
    });

    showToast(`✓ Listing Published! Earned +${pointsAwarded} reward points`);
    return item;
  };

  // Rewards redemption
  const redeemVoucher = (voucher) => {
    if (rewardPoints < voucher.points) {
      showToast('⚠️ Insufficient reward points balance');
      return false;
    }
    const newBal = rewardPoints - voucher.points;
    setRewardPoints(newBal);
    StorageService.setItem(StorageService.STORAGE_KEYS.REWARDS_POINTS, newBal);
    setRedeemedVouchers([...redeemedVouchers, { ...voucher, redeemedAt: new Date().toLocaleDateString() }]);
    showToast(`🎉 Redeemed ${voucher.title}! Saved ₹${voucher.discountValue || 'Free Delivery'}`);
    return true;
  };

  // Cart operations
  const addToCart = (plant, qty = 1) => {
    const existingIndex = cart.findIndex((item) => item.plant.id === plant.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { plant, quantity: qty }]);
    }
    showToast(`Added ${qty} kg ${plant.name} to Cart`);
  };

  const updateCartQuantity = (plantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(plantId);
      return;
    }
    setCart(cart.map((item) => (item.plant.id === plantId ? { ...item, quantity: newQty } : item)));
  };

  const removeFromCart = (plantId) => {
    setCart(cart.filter((item) => item.plant.id !== plantId));
  };

  const clearCart = () => setCart([]);

  // Place Buyer Order
  const placeOrder = () => {
    if (cart.length === 0) return null;

    const totalAmt = cart.reduce((sum, item) => sum + item.plant.price * item.quantity, 0);
    const orderNum = `#P${Math.floor(Math.random() * 800) + 1205}`;
    const itemsDescription = cart.map((i) => `${i.plant.name} ${i.quantity}kg`).join(', ');

    const newBuyerOrder = {
      id: orderNum.replace('#', ''),
      orderNumber: orderNum,
      itemsText: itemsDescription,
      sellerText: cart[0]?.plant?.farmerName || 'Ramesh Kumar',
      timeText: 'Just now',
      status: 'Processing',
      totalPrice: totalAmt,
      items: [...cart],
    };

    setBuyerOrders([newBuyerOrder, ...buyerOrders]);

    // Also create corresponding farmer sales order
    const farmerOrderNum = `#F${Math.floor(Math.random() * 800) + 2410}`;
    const newFarmerOrder = {
      id: farmerOrderNum.replace('#', ''),
      orderNumber: farmerOrderNum,
      plantName: cart[0]?.plant?.name || 'Medicinal Batch',
      quantity: cart[0]?.quantity || 5,
      buyerName: 'Dr. Priya Sharma (City Pharmacy)',
      timeText: 'Just now',
      status: 'Processing',
      totalPrice: totalAmt,
    };
    setFarmerOrders([newFarmerOrder, ...farmerOrders]);

    // Notify both sides
    addNotification({
      title: 'Order Placed Successfully!',
      message: `${orderNum} for ${cart.length} items (₹${totalAmt}) has been routed to growers.`,
      icon: 'checkmark-circle',
      type: 'order',
    });

    setLastPlacedOrder(newBuyerOrder);
    clearCart();
    return newBuyerOrder;
  };

  // Reorder
  const reorderPast = (order) => {
    showToast(`✓ Reorder initiated for ${order.orderNumber}`);
    setCurrentScreen('cart');
  };

  // Notifications
  const addNotification = (notif) => {
    const item = {
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timeText: 'Just now',
      unread: true,
      icon: notif.icon || 'leaf',
      type: notif.type || 'alert',
    };
    setNotifications([item, ...notifications]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  // Provenance inspection
  const openProvenance = (batch) => {
    setActiveProvenanceBatch(batch);
    setProvenanceModalVisible(true);
  };

  // In-app messaging
  const openChatWith = (recipient) => {
    setActiveChatRecipient(recipient);
    setMessageModalVisible(true);
  };

  // Unread notification count
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentScreen,
        setCurrentScreen,
        selectedPlant,
        setSelectedPlant,
        plants,
        farmerListings,
        addFarmerListing,
        farmerOrders,
        rewardPoints,
        redeemVoucher,
        redeemedVouchers,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        buyerOrders,
        placeOrder,
        reorderPast,
        lastPlacedOrder,
        offlineDrafts,
        saveOfflineDraft,
        removeOfflineDraft,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        provenanceModalVisible,
        setProvenanceModalVisible,
        activeProvenanceBatch,
        openProvenance,
        aiScanModalVisible,
        setAiScanModalVisible,
        messageModalVisible,
        setMessageModalVisible,
        activeChatRecipient,
        openChatWith,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
