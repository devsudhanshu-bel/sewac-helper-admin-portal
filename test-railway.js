const https = require('https');

// Login
const data = JSON.stringify({username: 'sewac', password: 'admin@sewac2026'});
const opts = {
  hostname: 'sewac-helper-admin-portal-production.up.railway.app',
  path: '/api/admin/login',
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data)}
};

const req = https.request(opts, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const json = JSON.parse(body);
    const token = json.token;
    
    console.log('\n=== RAILWAY: ALL LOGS (PAGE 1) ===');
    const s1 = Date.now();
    const opts1 = {
      hostname: 'sewac-helper-admin-portal-production.up.railway.app',
      path: '/api/logs/all?limit=100&page=1',
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + token}
    };
    
    const r1 = https.request(opts1, res1 => {
      let b1 = '';
      res1.on('data', c => b1 += c);
      res1.on('end', () => {
        const t1 = Date.now();
        const j = JSON.parse(b1);
        console.log('TIME', t1 - s1, 'ms | TOTAL', j.total, '| PAGES', j.totalPages, '| COUNT', j.data.length);
        
        // Test DISTRIBUTED filter
        console.log('\n=== RAILWAY: DISTRIBUTED ONLY ===');
        const s2 = Date.now();
        const opts2 = {
          hostname: 'sewac-helper-admin-portal-production.up.railway.app',
          path: '/api/logs/all?action=DISTRIBUTED&limit=100&page=1',
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + token}
        };
        
        const r2 = https.request(opts2, res2 => {
          let b2 = '';
          res2.on('data', c => b2 += c);
          res2.on('end', () => {
            const t2 = Date.now();
            const j2 = JSON.parse(b2);
            console.log('TIME', t2 - s2, 'ms | TOTAL', j2.total, '| COUNT', j2.data.length);
            process.exit(0);
          });
        });
        r2.end();
      });
    });
    r1.end();
  });
});

req.write(data);
req.end();
