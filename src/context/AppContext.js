import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PLANTS,
  INITIAL_FARMER_LISTINGS,
  INITIAL_FARMER_ORDERS,
  INITIAL_BUYER_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../constants/plantData';
import { StorageService } from '../utils/storage';
import { DEMO_ACCOUNTS } from '../constants/demoAccounts';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Session
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Roles: null (Splash / unauthenticated), 'farmer', 'buyer'
  const [role, setRole] = useState(null);

  // Screen navigation
  // Farmer tabs: 'home' | 'upload' | 'listings' | 'rewards' | 'orders' | 'profile' | 'notifications'
  // Buyer tabs: 'home' | 'browse' | 'cart' | 'orders' | 'profile' | 'detail' | 'orderPlaced' | 'notifications'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Selected plant for detail viewing
  const [selectedPlant, setSelectedPlant] = useState(INITIAL_PLANTS[0]);

  // Master Plants Catalog (persisted)
  const [plants, setPlants] = useState(INITIAL_PLANTS);

  // Farmer State (persisted)
  const [farmerListings, setFarmerListings] = useState(INITIAL_FARMER_LISTINGS);
  const [farmerOrders, setFarmerOrders] = useState(INITIAL_FARMER_ORDERS);
  const [rewardPoints, setRewardPoints] = useState(1240);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);

  // Buyer State (persisted)
  const [cart, setCart] = useState([]);
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

  // Chat message store: map of recipientName -> array of messages
  const [chatMessages, setChatMessages] = useState({
    default: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Namaste! The fresh harvest batch was picked this morning at 6:30 AM.',
        time: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Can you confirm moisture content is under 9% for AYUSH certification?',
        time: '10:16 AM',
      },
      {
        id: 'm3',
        sender: 'them',
        text: 'Yes, moisture test reading is 8.2%. The verified QR batch code is attached to every sack.',
        time: '10:18 AM',
      },
    ],
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Restore session and persisted state on app start
  useEffect(() => {
    (async () => {
      try {
        // 1. Session restoration
        const savedSession = await StorageService.getItem(StorageService.STORAGE_KEYS.SESSION, null);
        if (savedSession && savedSession.role) {
          setUser(savedSession);
          setRole(savedSession.role);
        }

        // 2. Drafts & points
        const drafts = await StorageService.getDrafts();
        if (drafts && drafts.length > 0) {
          setOfflineDrafts(drafts);
        }

        const savedPoints = await StorageService.getItem(StorageService.STORAGE_KEYS.REWARDS_POINTS, null);
        if (savedPoints !== null) {
          setRewardPoints(savedPoints);
        }

        // 3. Persisted cart
        const savedCart = await StorageService.getItem(StorageService.STORAGE_KEYS.CART, null);
        if (savedCart) {
          setCart(savedCart);
        }

        // 4. Persisted listings & plants
        const savedListings = await StorageService.getItem(StorageService.STORAGE_KEYS.LISTINGS, null);
        if (savedListings) {
          setFarmerListings(savedListings);
        }

        const savedPlants = await StorageService.getItem(StorageService.STORAGE_KEYS.PLANTS, null);
        if (savedPlants) {
          setPlants(savedPlants);
        }

        // 5. Persisted orders
        const savedBuyerOrders = await StorageService.getItem(StorageService.STORAGE_KEYS.ORDERS_BUYER, null);
        if (savedBuyerOrders) {
          setBuyerOrders(savedBuyerOrders);
        }

        const savedFarmerOrders = await StorageService.getItem(StorageService.STORAGE_KEYS.ORDERS_FARMER, null);
        if (savedFarmerOrders) {
          setFarmerOrders(savedFarmerOrders);
        }
      } catch (err) {
        console.warn('Error hydrating persisted app state:', err);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  // Login handler
  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Mimic API network latency
    const normalizedEmail = String(email).trim().toLowerCase();

    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === normalizedEmail && a.password === password
    );

    if (!account) {
      return { ok: false, error: 'Incorrect email or password' };
    }

    const { password: _omit, ...safeUser } = account;
    setUser(safeUser);
    setRole(safeUser.role);
    setCurrentScreen('home');
    await StorageService.setItem(StorageService.STORAGE_KEYS.SESSION, safeUser);
    showToast(`Welcome, ${safeUser.name}`);
    return { ok: true };
  };

  // Register handler
  const register = async ({ name, email, phone, password, role, additionalInfo = {} }) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Mimic API network latency
    const normalizedEmail = String(email).trim().toLowerCase();

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '+91 98765 43210',
      role: role, // 'farmer' or 'buyer'
      location: additionalInfo.location || (role === 'farmer' ? 'Pune, Maharashtra' : 'Mumbai, Maharashtra'),
      company: additionalInfo.company || (role === 'buyer' ? (name.trim().includes('Pharm') ? name.trim() : name.trim() + ' Ayurvedic Labs') : undefined),
      farmAcreage: additionalInfo.farmAcreage || (role === 'farmer' ? '5 Acres' : undefined),
      ayushLicense: additionalInfo.ayushLicense || (role === 'buyer' ? 'AYUSH-MH-2026-9921' : undefined),
      gstin: additionalInfo.gstin || (role === 'buyer' ? '27AABCU9603R1ZX' : undefined),
      verified: true,
      registeredAt: new Date().toISOString(),
    };

    setUser(newUser);
    setRole(role);
    setCurrentScreen('home');
    await StorageService.setItem(StorageService.STORAGE_KEYS.SESSION, newUser);
    showToast(`Account registered! Welcome, ${newUser.name}`);
    return { ok: true, user: newUser };
  };

  // Logout handler
  const logout = async () => {
    setUser(null);
    setRole(null);
    setCurrentScreen('home');
    await StorageService.removeItem(StorageService.STORAGE_KEYS.SESSION);
    showToast('Signed out successfully');
  };

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

  // Farmer listing creation (uses user profile & rule-based rewards)
  const addFarmerListing = (newListing) => {
    const qty = Number(newListing.quantity) || 1;
    const price = Number(newListing.pricePerKg) || 100;
    const earnedVal = qty * price;

    // Rule-based rewards: 1 point per ₹20 listing value (minimum 40 points)
    const pointsAwarded = Math.max(40, Math.round(earnedVal / 20));

    const farmerName = user?.name || 'Ramesh Kumar';
    const farmerLocation = user?.location || 'Pune, Maharashtra';

    const item = {
      id: `list_${Date.now()}`,
      plantId: newListing.plantId || 'plant_custom',
      name: newListing.name,
      quantity: qty,
      unit: 'kg',
      pricePerKg: price,
      earned: earnedVal,
      points: pointsAwarded,
      timeText: 'Just now',
      status: 'Live',
      image: newListing.image || INITIAL_PLANTS[0].image,
      batchCode: `BATCH-${newListing.name.substring(0, 3).toUpperCase()}-2026-${Math.floor(Math.random() * 900) + 100}`,
      harvestDate: newListing.harvestDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      batchHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      farmerName,
      farmerLocation,
    };

    const updatedListings = [item, ...farmerListings];
    setFarmerListings(updatedListings);
    StorageService.setItem(StorageService.STORAGE_KEYS.LISTINGS, updatedListings);

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
      price: price,
      unit: 'kg',
      stock: qty,
      rating: 5.0,
      reviewsCount: 1,
      farmerId: user?.id || 'farmer_1',
      farmerName,
      farmerLocation,
      farmerCertified: true,
      harvestDate: item.harvestDate,
      batchCode: item.batchCode,
      batchHash: item.batchHash,
      labReport: 'Verified Organic by Krishi Kendra Inspector',
      moistureContent: '8.4%',
      activeCompounds: newListing.activeCompounds || ['Organic Polyphenols', 'Botanical Bioactives'],
      medicinalBenefits: newListing.medicinalBenefits || 'Authentic traditional therapeutic herb',
      benefitTags: ['Organic', 'Direct Farm', 'AYUSH Tested'],
      description: newListing.description || 'Harvested fresh under certified sustainable agricultural practices.',
      image: item.image,
      heroImage: item.image,
    };

    const updatedPlants = [newCatalogPlant, ...plants];
    setPlants(updatedPlants);
    StorageService.setItem(StorageService.STORAGE_KEYS.PLANTS, updatedPlants);

    // Add notification
    addNotification({
      title: 'Listing Published!',
      message: `${newListing.name} (${qty} kg) is now live on the B2B marketplace. Earned +${pointsAwarded} pts!`,
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

    const updatedRedeemed = [
      ...redeemedVouchers,
      { ...voucher, redeemedAt: new Date().toLocaleDateString() },
    ];
    setRedeemedVouchers(updatedRedeemed);
    StorageService.setItem(StorageService.STORAGE_KEYS.REDEEMED_VOUCHERS, updatedRedeemed);

    showToast(`🎉 Redeemed ${voucher.title}! Saved ₹${voucher.discountValue || 'Free Delivery'}`);
    return true;
  };

  // Cart operations (with state bug fix & persistence)
  const addToCart = (plant, qty = 1) => {
    const existingIndex = cart.findIndex((item) => item.plant.id === plant.id);
    let updated;
    if (existingIndex > -1) {
      updated = cart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      updated = [...cart, { plant: { ...plant }, quantity: qty }];
    }
    setCart(updated);
    StorageService.setItem(StorageService.STORAGE_KEYS.CART, updated);
    showToast(`Added ${qty} kg ${plant.name} to Cart`);
  };

  const updateCartQuantity = (plantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(plantId);
      return;
    }
    const updated = cart.map((item) =>
      item.plant.id === plantId ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    StorageService.setItem(StorageService.STORAGE_KEYS.CART, updated);
  };

  const removeFromCart = (plantId) => {
    const updated = cart.filter((item) => item.plant.id !== plantId);
    setCart(updated);
    StorageService.setItem(StorageService.STORAGE_KEYS.CART, updated);
  };

  const clearCart = () => {
    setCart([]);
    StorageService.setItem(StorageService.STORAGE_KEYS.CART, []);
  };

  // Place Buyer Order (with inventory deduction, stock check & multi-item splitting)
  const placeOrder = (paymentMethod = 'UPI / Instant Bank Settlement') => {
    if (cart.length === 0) return null;

    // 1. Check stock availability for all items
    for (const item of cart) {
      const livePlant = plants.find((p) => p.id === item.plant.id);
      if (livePlant && livePlant.stock < item.quantity) {
        showToast(`⚠️ Only ${livePlant.stock} kg available for ${livePlant.name}`);
        return null;
      }
    }

    // 2. Deduct stock from plants inventory
    const updatedPlants = plants.map((plant) => {
      const inCart = cart.find((item) => item.plant.id === plant.id);
      if (inCart) {
        return {
          ...plant,
          stock: Math.max(0, plant.stock - inCart.quantity),
        };
      }
      return plant;
    });
    setPlants(updatedPlants);
    StorageService.setItem(StorageService.STORAGE_KEYS.PLANTS, updatedPlants);

    // 3. Calculate order total & numbers
    const subtotalAmt = cart.reduce((sum, item) => sum + item.plant.price * item.quantity, 0);
    const gstAmt = Math.round(subtotalAmt * 0.05);
    const grandTotal = subtotalAmt + gstAmt;
    const orderSeq = Date.now().toString().slice(-4);
    const orderNum = `#ORD-2026-${orderSeq}`;
    const txnId = `TXN-AYUSH-${Date.now().toString().slice(-8)}`;
    const receiptNum = `REC-GST-${Date.now().toString().slice(-6)}`;
    const itemsDescription = cart.map((i) => `${i.plant.name} (${i.quantity}kg)`).join(', ');

    const buyerName = user?.name ? `${user.name} (${user.organization || 'Pharma Tech'})` : 'Dr. Priya Sharma (City Pharmacy)';
    const primarySeller = cart[0]?.plant?.farmerName || 'Ramesh Kumar';

    // 4. Create Buyer purchase order with verified payment record
    const newBuyerOrder = {
      id: orderNum.replace('#', ''),
      orderNumber: orderNum,
      transactionId: txnId,
      receiptNumber: receiptNum,
      paymentStatus: 'Payment Successful',
      itemsText: itemsDescription,
      sellerText: primarySeller,
      timeText: 'Just now',
      status: 'Processing',
      subtotal: subtotalAmt,
      gst: gstAmt,
      totalPrice: grandTotal,
      paymentMethod,
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      items: cart.map((item) => ({ ...item })),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedBuyerOrders = [newBuyerOrder, ...buyerOrders];
    setBuyerOrders(updatedBuyerOrders);
    StorageService.setItem(StorageService.STORAGE_KEYS.ORDERS_BUYER, updatedBuyerOrders);

    // 5. Multi-item splitting: Create a distinct farmer sales order for EACH cart item
    const newFarmerOrdersList = cart.map((cartItem, idx) => ({
      id: `FO-${orderSeq}-${idx + 1}`,
      orderNumber: `#F-${orderSeq}-${idx + 1}`,
      plantName: cartItem.plant.name,
      quantity: cartItem.quantity,
      pricePerKg: cartItem.plant.price,
      buyerName,
      timeText: 'Just now',
      status: 'Processing',
      totalPrice: cartItem.plant.price * cartItem.quantity,
      batchCode: cartItem.plant.batchCode || `BATCH-${cartItem.plant.name.slice(0, 3).toUpperCase()}-2026`,
    }));

    const updatedFarmerOrders = [...newFarmerOrdersList, ...farmerOrders];
    setFarmerOrders(updatedFarmerOrders);
    StorageService.setItem(StorageService.STORAGE_KEYS.ORDERS_FARMER, updatedFarmerOrders);

    // 6. Notify both parties
    addNotification({
      title: 'Order Dispatched to Growers!',
      message: `${orderNum} for ${cart.length} plant item(s) (₹${grandTotal.toLocaleString('en-IN')}) verified via smart contract.`,
      icon: 'checkmark-circle',
      type: 'order',
    });

    setLastPlacedOrder(newBuyerOrder);
    clearCart();
    return newBuyerOrder;
  };

  // Farmer Order Dispatch Status Update
  const updateFarmerOrderStatus = (orderId, newStatus) => {
    const updated = farmerOrders.map((o) =>
      o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o
    );
    setFarmerOrders(updated);
    StorageService.setItem(StorageService.STORAGE_KEYS.ORDERS_FARMER, updated);
    showToast(`✓ Order ${orderId} status set to ${newStatus}`);
  };

  // Reorder
  const reorderPast = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => addToCart(item.plant, item.quantity));
      showToast(`✓ Re-added items from ${order.orderNumber} to cart`);
    } else {
      showToast(`✓ Reorder initiated for ${order.orderNumber}`);
    }
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

  // In-app messaging & simulated auto-replies
  const openChatWith = (recipient) => {
    setActiveChatRecipient(recipient);
    setMessageModalVisible(true);
  };

  const sendChatMessage = (text, recipientKey = 'default') => {
    if (!text.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentList = chatMessages[recipientKey] || chatMessages['default'] || [];
    const updated = [...currentList, newMsg];

    setChatMessages((prev) => ({
      ...prev,
      [recipientKey]: updated,
      default: updated,
    }));

    showToast('Message sent');

    // Contextual auto-reply simulation after 1.2s
    setTimeout(() => {
      const replies = [
        'Understood! The moisture content has been verified under AYUSH standards.',
        'Noted. The batch QR label has been sealed on the transit sacks.',
        'Great, our regional dispatch partner has scheduled dock delivery for tomorrow.',
      ];
      const autoText = replies[Math.floor(Math.random() * replies.length)];

      const autoReply = {
        id: `m_reply_${Date.now()}`,
        sender: 'them',
        text: autoText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => {
        const list = prev[recipientKey] || prev['default'] || [];
        return {
          ...prev,
          [recipientKey]: [...list, autoReply],
          default: [...list, autoReply],
        };
      });
    }, 1400);
  };

  // Unread notification count
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        user,
        authReady,
        login,
        register,
        logout,
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
        updateFarmerOrderStatus,
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
        chatMessages,
        sendChatMessage,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
