#!/bin/bash
cat src/pages/store/TrackOrder.tsx | head -n 135 > src/pages/store/TrackOrder.tsx.new
cat << 'INNER_EOF' >> src/pages/store/TrackOrder.tsx.new
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-red-700 mb-2">{order.status.replace(/_/g, ' ')}</h3>
              <p className="text-red-600 font-medium max-w-md mx-auto">This order is no longer active. If you have any questions or need a refund, please contact support.</p>
            </div>
          ) : (
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="relative pl-8 border-l-2 border-slate-100 space-y-10 ml-4">
                {/* Step 1: Ordered */}
                <div className="relative">
                  <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${currentStatusIndex >= 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {currentStatusIndex >= 0 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <h4 className={`text-lg font-bold ${currentStatusIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">{format(new Date(order.createdAt), 'd MMM yyyy')}</p>
                </div>
                
                {/* Step 2: Shipped */}
                <div className="relative">
                  <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${currentStatusIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {currentStatusIndex >= 4 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <h4 className={`text-lg font-bold ${currentStatusIndex >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {order.shippedAt ? format(new Date(order.shippedAt), 'd MMM yyyy') : 'Pending'}
                  </p>
                </div>
                
                {/* Step 3: Out for Delivery */}
                <div className="relative">
                  <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${currentStatusIndex >= 5 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {currentStatusIndex >= 5 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <h4 className={`text-lg font-bold ${currentStatusIndex >= 5 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {order.outForDeliveryAt ? format(new Date(order.outForDeliveryAt), 'd MMM yyyy') : 'Pending'}
                  </p>
                </div>
                
                {/* Step 4: Delivered */}
                <div className="relative">
                  <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${currentStatusIndex >= 6 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {currentStatusIndex >= 6 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <h4 className={`text-lg font-bold ${currentStatusIndex >= 6 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {order.deliveredAt 
                      ? format(new Date(order.deliveredAt), 'd MMM yyyy') 
                      : order.estimatedDeliveryDate 
                        ? `Expected by ${format(new Date(order.estimatedDeliveryDate), 'd MMM yyyy')}` 
                        : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          )}
INNER_EOF
cat src/pages/store/TrackOrder.tsx | tail -n +199 >> src/pages/store/TrackOrder.tsx.new
mv src/pages/store/TrackOrder.tsx.new src/pages/store/TrackOrder.tsx
