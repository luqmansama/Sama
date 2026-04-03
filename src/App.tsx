/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  Coins, 
  ShoppingCart, 
  X, 
  Smartphone, 
  CheckCircle2,
  QrCode,
  Pizza,
  UtensilsCrossed,
  Popcorn,
  CupSoda,
  Drumstick,
  Gamepad,
  Trophy,
  Target,
  Loader2,
  Lock
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/src/lib/utils";

type Page = "home" | "activities" | "shop" | "tokens" | "checkout";

interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface Activity {
  id: string;
  name: string;
  cost: number;
  icon: React.ReactNode;
  color: string;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

const ACTIVITIES: Activity[] = [
  { id: "ps5", name: "PS5 Gaming", cost: 2, icon: <Gamepad className="w-6 h-6" />, color: "from-blue-500 to-indigo-600" },
  { id: "billiards", name: "Billiards", cost: 3, icon: <Target className="w-6 h-6" />, color: "from-emerald-500 to-teal-600" },
  { id: "bowling", name: "Bowling", cost: 5, icon: <Trophy className="w-6 h-6" />, color: "from-orange-500 to-red-600" },
];

const SHOP_ITEMS: ShopItem[] = [
  { id: "burger", name: "Gourmet Burger", price: 4500, icon: <UtensilsCrossed className="w-6 h-6" />, description: "Juicy beef patty with secret sauce" },
  { id: "pizza", name: "Pepperoni Pizza", price: 8500, icon: <Pizza className="w-6 h-6" />, description: "Wood-fired with extra cheese" },
  { id: "popcorn", name: "Butter Popcorn", price: 2500, icon: <Popcorn className="w-6 h-6" />, description: "Large bucket of fresh movie-style popcorn" },
  { id: "wings", name: "Chicken Wings", price: 5500, icon: <Drumstick className="w-6 h-6" />, description: "6pcs of spicy buffalo wings" },
  { id: "soda", name: "Soft Drink", price: 1500, icon: <CupSoda className="w-6 h-6" />, description: "Chilled 500ml soda of your choice" },
];

const TOKEN_PACKS = [
  { id: "10", label: "10 Tokens", amount: 10, price: 2000 },
  { id: "30", label: "30 Tokens", amount: 30, price: 5000 },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [balance, setBalance] = useState(120);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookingModal, setBookingModal] = useState<{ open: boolean; game?: Activity }>({ open: false });
  const [paymentModal, setPaymentModal] = useState<{ 
    open: boolean; 
    label?: string; 
    price?: number;
    step: "input" | "processing" | "pin" | "success";
  }>({ open: false, step: "input" });
  const [paymentMethod, setPaymentMethod] = useState<"airtel" | "mpamba" | "">("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addToCart = (item: ShopItem) => {
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), name: item.name, price: item.price }]);
    setSuccessMessage(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleBooking = (activity: Activity) => {
    if (balance < activity.cost) {
      alert("Insufficient tokens!");
      return;
    }
    setBalance(prev => prev - activity.cost);
    setBookingModal({ open: true, game: activity });
  };

  const initiatePayment = (label: string, price: number) => {
    setPaymentModal({ open: true, label, price, step: "input" });
  };

  const startPayment = () => {
    if (!phone || !paymentMethod) {
      alert("Please select a payment method and enter your phone number.");
      return;
    }
    setPaymentModal(prev => ({ ...prev, step: "processing" }));
    
    // Simulate network delay to "send request"
    setTimeout(() => {
      setPaymentModal(prev => ({ ...prev, step: "pin" }));
    }, 2000);
  };

  const confirmPin = () => {
    if (pin.length < 4) {
      alert("Please enter a valid 4-digit PIN.");
      return;
    }
    setPaymentModal(prev => ({ ...prev, step: "processing" }));
    
    // Simulate transaction processing
    setTimeout(() => {
      setPaymentModal(prev => ({ ...prev, step: "success" }));
      
      // Finalize the transaction
      if (paymentModal.label?.includes("Tokens")) {
        const pack = TOKEN_PACKS.find(p => p.label === paymentModal.label);
        if (pack) setBalance(prev => prev + pack.amount);
      } else {
        setCart([]);
      }
      
      // Close after a short delay
      setTimeout(() => {
        setPaymentModal({ open: false, step: "input" });
        setPhone("");
        setPaymentMethod("");
        setPin("");
        setActivePage("home");
        setSuccessMessage("Transaction completed successfully!");
      }, 2000);
    }, 2500);
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00f3ff] selection:text-black">
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-white/10 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            <NavItem icon={<Home />} label="Home" active={activePage === "home"} onClick={() => setActivePage("home")} />
            <NavItem icon={<Gamepad2 />} label="Activities" active={activePage === "activities"} onClick={() => setActivePage("activities")} />
            <NavItem icon={<ShoppingBag />} label="Shop" active={activePage === "shop"} onClick={() => setActivePage("shop")} />
            <NavItem icon={<Coins />} label="Tokens" active={activePage === "tokens"} onClick={() => setActivePage("tokens")} />
            <button 
              onClick={() => setActivePage("checkout")}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                activePage === "checkout" ? "text-[#00f3ff]" : "text-white/60 hover:text-white"
              )}
            >
              <ShoppingCart />
              <span className="text-[10px] uppercase tracking-wider font-medium">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00f3ff] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-24 md:pt-32">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)] bg-white">
                  <img 
                    src="/logo.png" 
                    alt="SAMA Gaming Lounge Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if logo.png is not found
                      e.currentTarget.src = "https://picsum.photos/seed/gaming/200/200";
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                    SAMA <span className="text-[#00f3ff]">Lounge</span>
                  </h1>
                  <p className="text-white/60 text-sm md:text-base">The Ultimate Gaming Hub</p>
                </div>
              </header>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f3ff]/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#00f3ff]/20 transition-colors" />
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold mb-2">Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-[#00f3ff]">{balance}</span>
                  <span className="text-xl font-medium text-white/60">Tokens</span>
                </div>
                <button 
                  onClick={() => setActivePage("tokens")}
                  className="mt-6 flex items-center gap-2 text-sm font-bold text-[#00f3ff] hover:underline"
                >
                  Top up now <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction 
                  title="Play Games" 
                  desc="PS5, Billiards & more" 
                  icon={<Gamepad2 className="text-[#00f3ff]" />} 
                  onClick={() => setActivePage("activities")}
                />
                <QuickAction 
                  title="Order Food" 
                  desc="Burgers, Pizza & Drinks" 
                  icon={<ShoppingBag className="text-[#00f3ff]" />} 
                  onClick={() => setActivePage("shop")}
                />
              </div>
            </motion.div>
          )}

          {activePage === "activities" && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold">Activities</h2>
              <div className="grid grid-cols-1 gap-4">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => handleBooking(activity)}
                    className="flex items-center justify-between p-6 bg-[#111] rounded-2xl border border-white/5 hover:border-[#00f3ff]/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-4 rounded-xl bg-gradient-to-br", activity.color)}>
                        {activity.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold">{activity.name}</h3>
                        <p className="text-white/40 text-sm">Instant booking available</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00f3ff] font-black text-xl">{activity.cost} Tokens</p>
                      <p className="text-white/40 text-xs uppercase tracking-widest">Per Session</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === "shop" && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold">Shop</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SHOP_ITEMS.map((item) => (
                  <div key={item.id} className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#00f3ff]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-white/40 text-sm">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-bold">MWK {item.price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-[#00f3ff] text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === "tokens" && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold">Buy Tokens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TOKEN_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => initiatePayment(pack.label, pack.price)}
                    className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 rounded-3xl border border-white/5 text-left hover:border-[#00f3ff]/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-3 bg-[#00f3ff]/10 rounded-xl text-[#00f3ff]">
                        <Coins />
                      </div>
                      <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">Popular</span>
                    </div>
                    <h3 className="text-2xl font-black mb-1">{pack.label}</h3>
                    <p className="text-white/40 text-sm mb-6">Instant credit to account</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-white/40">MWK</span>
                      <span className="text-3xl font-bold">{pack.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold">Checkout</h2>
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                    <ShoppingCart size={40} />
                  </div>
                  <p className="text-white/40">Your cart is empty</p>
                  <button 
                    onClick={() => setActivePage("shop")}
                    className="text-[#00f3ff] font-bold hover:underline"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
                    {cart.map((item, idx) => (
                      <div key={item.id} className={cn("p-6 flex justify-between items-center", idx !== cart.length - 1 && "border-b border-white/5")}>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-white/40 text-sm">MWK {item.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <div className="p-6 bg-white/5 flex justify-between items-center">
                      <span className="text-white/60 font-medium">Total Amount</span>
                      <span className="text-2xl font-black text-[#00f3ff]">MWK {totalCartPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => initiatePayment("Cart Payment", totalCartPrice)}
                    className="w-full bg-[#00f3ff] text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(0,243,255,0.3)]"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModal({ open: false })}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white text-black p-8 rounded-[2rem] w-full max-w-sm text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-black rounded-3xl">
                  <QRCodeSVG value={bookingModal.game?.name || "Booking"} size={200} fgColor="#00f3ff" bgColor="#000000" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{bookingModal.game?.name}</h3>
                <p className="text-black/60 font-medium">Show this QR at the counter</p>
              </div>
              <div className="bg-black/5 p-4 rounded-2xl">
                <p className="text-xs uppercase tracking-widest font-bold text-black/40 mb-1">Cost Deducted</p>
                <p className="text-xl font-black">{bookingModal.game?.cost} Tokens</p>
              </div>
              <button 
                onClick={() => setBookingModal({ open: false })}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentModal({ open: false })}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#111] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  {paymentModal.step === "input" && "Payment"}
                  {paymentModal.step === "processing" && "Processing..."}
                  {paymentModal.step === "pin" && "Enter PIN"}
                  {paymentModal.step === "success" && "Success!"}
                </h3>
                {paymentModal.step === "input" && (
                  <button onClick={() => setPaymentModal({ open: false, step: "input" })} className="text-white/40 hover:text-white">
                    <X />
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {paymentModal.step === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">{paymentModal.label}</p>
                      <p className="text-2xl font-black text-[#00f3ff]">MWK {paymentModal.price?.toLocaleString()}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-white/60">Select Method</p>
                      <div className="grid grid-cols-2 gap-3">
                        <PaymentMethodBtn 
                          label="Airtel Money" 
                          active={paymentMethod === "airtel"} 
                          onClick={() => setPaymentMethod("airtel")} 
                        />
                        <PaymentMethodBtn 
                          label="Mpamba" 
                          active={paymentMethod === "mpamba"} 
                          onClick={() => setPaymentMethod("mpamba")} 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-white/60">Phone Number</p>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input 
                          type="tel" 
                          placeholder="0999 000 000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#00f3ff]/50 transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={startPayment}
                      className="w-full bg-[#00f3ff] text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {paymentModal.step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-12 flex flex-col items-center justify-center space-y-4"
                  >
                    <Loader2 className="w-12 h-12 text-[#00f3ff] animate-spin" />
                    <p className="text-white/60 font-medium">Communicating with provider...</p>
                  </motion.div>
                )}

                {paymentModal.step === "pin" && (
                  <motion.div
                    key="pin"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <p className="text-white/60">A secure prompt has been sent to</p>
                      <p className="text-[#00f3ff] font-bold">{phone}</p>
                      <p className="text-white/40 text-sm">Please enter your secret PIN below to authorize the transaction of MWK {paymentModal.price?.toLocaleString()}</p>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                      <input 
                        type="password" 
                        maxLength={4}
                        placeholder="••••"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-center text-2xl tracking-[1em] focus:outline-none focus:border-[#00f3ff]/50 transition-all"
                      />
                    </div>

                    <button 
                      onClick={confirmPin}
                      className="w-full bg-[#00f3ff] text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform"
                    >
                      Authorize Payment
                    </button>
                  </motion.div>
                )}

                {paymentModal.step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-12 flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-[#00f3ff]/10 rounded-full flex items-center justify-center text-[#00f3ff]">
                      <CheckCircle2 size={48} />
                    </div>
                    <p className="text-xl font-bold">Payment Successful!</p>
                    <p className="text-white/40 text-center">Your account has been updated.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 md:bottom-8 md:left-auto md:right-8 z-[200]"
          >
            <div className="bg-[#00f3ff] text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold">
              <CheckCircle2 size={20} />
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
        active ? "text-[#00f3ff]" : "text-white/60 hover:text-white"
      )}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
    </button>
  );
}

function QuickAction({ title, desc, icon, onClick }: { title: string; desc: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-6 bg-[#111] rounded-3xl border border-white/5 hover:border-white/10 transition-all text-left"
    >
      <div className="p-3 bg-white/5 rounded-2xl">
        {icon}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-white/40 text-xs">{desc}</p>
      </div>
    </button>
  );
}

function PaymentMethodBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "py-3 px-4 rounded-xl border text-sm font-bold transition-all",
        active ? "bg-[#00f3ff] border-[#00f3ff] text-black" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
      )}
    >
      {label}
    </button>
  );
}
