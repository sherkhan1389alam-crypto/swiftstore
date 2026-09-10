import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { items: cart, removeFromCart, updateQuantity, total: subtotal, shippingCost, finalTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#FAFAFA]">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Your cart is waiting.</h2>
        <p className="text-slate-500 mb-8 font-medium">Discover something you'll love.</p>
        <Link 
          to="/shop" 
          className="bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:bg-slate-800 transition-all text-sm uppercase tracking-wider shadow-lg flex items-center"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart</h1>
          <Link to="/shop" className="text-slate-500 hover:text-slate-900 font-semibold text-sm flex items-center">
            Continue Shopping <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-slate-100 relative">
                <Link to={`/product/${item.slug || item.id}`} className="w-full sm:w-32 aspect-square bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </Link>
                
                <div className="flex-1 w-full flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${item.slug || item.id}`}>
                      <h3 className="text-lg font-bold text-slate-900 hover:text-slate-600 line-clamp-2 pr-8">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto text-slate-400 hover:text-red-500 p-2 sm:p-0 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, Math.min(item.stock || 10, item.quantity + 1))}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-slate-900">₹{item.price * item.quantity}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-500 font-medium">₹{item.price} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>- ₹0</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-bold" : "text-slate-900 font-bold"}>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                
                <div className="h-px bg-slate-100 my-4"></div>
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-extrabold text-slate-900">Total</span>
                  <span className="font-extrabold text-slate-900 text-2xl">₹{finalTotal}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-wider flex justify-center items-center gap-2 mb-6 shadow-lg"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
