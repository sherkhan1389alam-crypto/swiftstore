import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Homepage.tsx', 'utf8');

const socialLinksStart = code.indexOf('{/* Social Links */}');
if (socialLinksStart !== -1) {
  const endOfDiv = code.lastIndexOf('</div>', code.indexOf('</div>    </div>  );'));
  // Let's just do a regex replace or slice.
  // We can rebuild it based on the earlier version.
}
