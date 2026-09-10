import re

with open("src/pages/admin/ProductForm.tsx", "r") as f:
    content = f.read()

# Add error state
content = content.replace('const [saving, setSaving] = useState(false);', 'const [saving, setSaving] = useState(false);\n  const [errorMsg, setErrorMsg] = useState("");')

# Replace alert with setErrorMsg
handle_save = '''    } catch (error: any) {
      console.error('Error saving product', error);
      setErrorMsg(error.message || 'Failed to save product');
    } finally {'''

content = re.sub(r'\} catch \(error\) \{\s*console.error\([^)]+\);\s*alert\([^)]+\);\s*\} finally \{', handle_save, content)

# Show error in UI
error_ui = '''        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'''

content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">', error_ui)

with open("src/pages/admin/ProductForm.tsx", "w") as f:
    f.write(content)

