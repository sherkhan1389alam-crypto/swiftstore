import re

with open("src/lib/types.ts", "r") as f:
    content = f.read()

# Update Category interface
content = re.sub(
    r'export interface Category \{\s*id: string;\s*orderNumber\?: string;\s*name: string;\s*imageUrl: string;\s*images\?: string\[\];\s*status\?: \'ENABLED\' \| \'DISABLED\';\s*order\?: number;\s*\}',
    """export interface Category {
  id: string;
  orderNumber?: string;
  name: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  status?: 'ENABLED' | 'DISABLED';
  order?: number;
  featured?: boolean;
}""",
    content
)

with open("src/lib/types.ts", "w") as f:
    f.write(content)

