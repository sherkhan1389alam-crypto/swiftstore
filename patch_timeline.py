import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'\{/\* Ordered \*/\}.*?(?=\{/\* Courier Tracking \*/\})', re.DOTALL)

new_timeline = """{/* Ordered */}
                            <div className="relative">
                                <div className={`absolute -left-[27px] md:-left-[45px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 0 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {format(new Date(order.createdAt), "d MMM yyyy • h:mm a")}
                                </p>
                            </div>

                            {/* Confirmed */}
                            <div className="relative">
                                <div className={`absolute -left-[27px] md:-left-[45px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 1 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Confirmed</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {currentStatusIndex >= 1 ? format(new Date(order.createdAt), "d MMM yyyy • h:mm a") : 'Awaiting confirmation'}
                                </p>
                            </div>

                            {/* Shipped */}
                            <div className="relative">
                                <div className={`absolute -left-[27px] md:-left-[45px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 2 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.shippedAt ? format(new Date(order.shippedAt), "d MMM yyyy • h:mm a") : 'Awaiting shipment'}
                                </p>
                            </div>

                            {/* Out for Delivery */}
                            <div className="relative">
                                <div className={`absolute -left-[27px] md:-left-[45px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 3 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.outForDeliveryAt ? format(new Date(order.outForDeliveryAt), "d MMM yyyy • h:mm a") : `Expected by ${format(new Date(order.estimatedDeliveryDate!), 'd MMM yyyy')}`}
                                </p>
                            </div>

                            {/* Delivered */}
                            <div className="relative">
                                <div className={`absolute -left-[27px] md:-left-[45px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 4 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.deliveredAt ? format(new Date(order.deliveredAt), "d MMM yyyy • h:mm a") : `Expected by ${format(new Date(order.estimatedDeliveryDate!), 'd MMM yyyy')}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    """

content = re.sub(pattern, new_timeline, content)

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
