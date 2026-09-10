import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

# Add success param state
content = content.replace("const [error, setError] = useState('');", "const [error, setError] = useState('');\n  const [isSuccess, setIsSuccess] = useState(false);")

# Read success param
read_param = """    if (idParam) {
      setOrderNumber(idParam);
      trackOrderById(idParam);
    }
    if (params.get('success') === 'true') {
        setIsSuccess(true);
    }"""
content = content.replace("""    if (idParam) {
      setOrderNumber(idParam);
      trackOrderById(idParam);
    }""", read_param)

# Display success banner
success_banner = """            {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl mb-6 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                        <h3 className="text-lg font-black tracking-tight">Order Placed Successfully</h3>
                        <p className="text-emerald-700 font-medium text-sm">Thank you for your purchase.</p>
                    </div>
                </div>
            )}
            
            <button """

content = content.replace("            <button ", success_banner)

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
