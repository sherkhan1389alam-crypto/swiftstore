import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/SocialMedia.tsx', 'utf8');

code = code.replace(
  "import { Save, AlertCircle, CheckCircle2, Instagram, Facebook, Youtube, Twitter, Send, MessageCircle, Pin, Linkedin, Edit, ExternalLink, X, Trash2 } from 'lucide-react';",
  "import { Save, AlertCircle, CheckCircle2, Send, MessageCircle, Edit, ExternalLink, X, Trash2 } from 'lucide-react';\nimport { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube, FaTwitter as Twitter, FaPinterest as Pin, FaLinkedin as Linkedin } from 'react-icons/fa';"
);
fs.writeFileSync('src/pages/admin/SocialMedia.tsx', code);

let code2 = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');
code2 = code2.replace(
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle, Instagram, Facebook, Youtube, Twitter, Send, Pin, Linkedin } from \"lucide-react\";",
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle, Send } from \"lucide-react\";\nimport { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube, FaTwitter as Twitter, FaPinterest as Pin, FaLinkedin as Linkedin } from 'react-icons/fa';"
);
fs.writeFileSync('src/layouts/StoreLayout.tsx', code2);
