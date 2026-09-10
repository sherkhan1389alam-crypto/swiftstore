#!/bin/bash
cat src/pages/store/TrackOrder.tsx | awk '
BEGIN { in_tracking = 0 }
/{\/\* Tracking Details Box \*\/}/ {
    print "          {/* Tracking Details Box */}"
    print "          {order.trackingNumber ? ("
    print "             <div className=\"mb-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6\">"
    print "               <div className=\"flex items-center gap-4\">"
    print "                 <div className=\"w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600\">"
    print "                   <Truck className=\"w-6 h-6\" />"
    print "                 </div>"
    print "                 <div>"
    print "                   <p className=\"text-sm font-bold text-indigo-900 uppercase tracking-wider mb-1\">Courier & Tracking</p>"
    print "                   <p className=\"text-lg font-black text-indigo-950\">{order.courierName || '\''Courier Partner'\''}</p>"
    print "                   <p className=\"text-indigo-700 font-medium\">Tracking ID: {order.trackingNumber}</p>"
    print "                 </div>"
    print "               </div>"
    print "               {order.trackingUrl && ("
    print "                 <a href={order.trackingUrl} target=\"_blank\" rel=\"noreferrer\" className=\"w-full md:w-auto text-center bg-white text-indigo-600 border border-indigo-200 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap\">"
    print "                   Track Shipment"
    print "                 </a>"
    print "               )}"
    print "             </div>"
    print "          ) : ("
    print "             <div className=\"mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center\">"
    print "               <p className=\"text-slate-500 font-medium\">Courier tracking will be available after shipment.</p>"
    print "             </div>"
    print "          )}"
    in_tracking = 1
    next
}
in_tracking && /<div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">/ {
    in_tracking = 0
    print $0
    next
}
!in_tracking {
    print $0
}
' > src/pages/store/TrackOrder.tsx.new

mv src/pages/store/TrackOrder.tsx.new src/pages/store/TrackOrder.tsx
