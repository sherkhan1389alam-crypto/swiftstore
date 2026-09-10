sed -i "s/import About from '.\/pages\/store\/About';/import About from '.\/pages\/store\/About';\nimport Terms from '.\/pages\/store\/Terms';\nimport Privacy from '.\/pages\/store\/Privacy';\nimport Refund from '.\/pages\/store\/Refund';/g" src/App.tsx

sed -i "s/<Route path=\"about\" element={<About \/>} \/>/<Route path=\"about\" element={<About \/>} \/>\n          <Route path=\"terms\" element={<Terms \/>} \/>\n          <Route path=\"privacy\" element={<Privacy \/>} \/>\n          <Route path=\"refund\" element={<Refund \/>} \/>/g" src/App.tsx
