const path = require('path');

// Test if the VDR library can be loaded without issues
console.log('🧪 Testing VDR library loading...');

try {
  // Try to load the VDR library
  console.log('📦 Loading indy2-vdr...');
  
  // Point to the local vdr-pkg
  const vdrPath = path.resolve(__dirname, '../vdr-pkg');
  console.log('VDR path:', vdrPath);
  
  const { LedgerClient, EthrDidRegistry } = require(vdrPath);
  console.log('✅ VDR library loaded successfully');
  
  // Test creating a client
  console.log('🔧 Creating LedgerClient...');
  const client = new LedgerClient(1337, 'http://localhost:8545', [], null);
  console.log('✅ LedgerClient created');
  
  // Test ping with timeout
  console.log('📡 Testing ping with timeout...');
  const pingPromise = client.ping();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Ping timeout')), 10000);
  });
  
  Promise.race([pingPromise, timeoutPromise])
    .then(result => {
      console.log('✅ Ping successful:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Ping failed:', error.message);
      
      if (error.message === 'Ping timeout') {
        console.log('⚠️  Ping timed out - this might be the source of the memory leak');
      }
      
      process.exit(1);
    });
  
} catch (error) {
  console.error('❌ Failed to load VDR library:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}