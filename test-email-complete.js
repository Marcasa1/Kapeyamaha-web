require('dotenv').config();

console.log('🔍 Checking email configuration...\n');

// Check all required variables
const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
let allGood = true;

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    const value = varName.includes('PASS') 
      ? '***' + process.env[varName].slice(-4) // Show last 4 chars only for password
      : process.env[varName];
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: MISSING!`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All email variables are set!');
  console.log('\nTo send a test email, run:');
  console.log('node send-test-fixed.js');
} else {
  console.log('❌ Missing some email variables!');
  console.log('\nPlease check your .env file and make sure all required variables are set.');
}