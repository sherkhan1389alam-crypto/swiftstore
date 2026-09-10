import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div className="relative pl-4 md:pl-8 ml-2 border-l-2 border-slate-100 space-y-8">.*?(?=\{/\* Courier Tracking \*/\})', re.DOTALL)

new_timeline = """<div className="relative">
                        {/* Mobile Vertical Line */}
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 md:hidden"></div>
                        {/* Desktop Horizontal Line */}
                        <div className="hidden md:block absolute top-4 left-10 right-10 h-0.5 bg-slate-100"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
                            {/* Ordered */}
                            <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center md:flex-1">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 0 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {format(new Date(order.createdAt), "d MMM yyyy")}
                                        <br className="hidden md:block"/>
                                        <span className="md:block">{format(new Date(order.createdAt), "h:mm a")}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Confirmed */}
                            <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center md:flex-1">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 1 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Confirmed</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {currentStatusIndex >= 1 ? 
                                            <>{format(new Date(order.createdAt), "d MMM yyyy")}<br className="hidden md:block"/><span className="md:block">{format(new Date(order.createdAt), "h:mm a")}</span></>
                                         : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Shipped */}
                            <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center md:flex-1">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 2 ? <Truck className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {order.shippedAt ? 
                                            <>{format(new Date(order.shippedAt), "d MMM yyyy")}<br className="hidden md:block"/><span className="md:block">{format(new Date(order.shippedAt), "h:mm a")}</span></> 
                                        : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Out for Delivery */}
                            <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center md:flex-1">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 3 ? <Package className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {order.outForDeliveryAt ? 
                                            <>{format(new Date(order.outForDeliveryAt), "d MMM yyyy")}<br className="hidden md:block"/><span className="md:block">{format(new Date(order.outForDeliveryAt), "h:mm a")}</span></> 
                                        : `Expected ${format(new Date(order.estimatedDeliveryDate!), 'd MMM')}`}
                                    </p>
                                </div>
                            </div>

                            {/* Delivered */}
                            <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center md:flex-1">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 4 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {order.deliveredAt ? 
                                            <>{format(new Date(order.deliveredAt), "d MMM yyyy")}<br className="hidden md:block"/><span className="md:block">{format(new Date(order.deliveredAt), "h:mm a")}</span></> 
                                        : `Expected ${format(new Date(order.estimatedDeliveryDate!), 'd MMM')}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    """

content = re.sub(pattern, new_timeline, content)

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
