require('dotenv').config();

console.log('🔧 Verifying .env settings:\n');

const checks = {
  'TESTMAIL_API_KEY': process.env.TESTMAIL_API_KEY,
  'TESTMAIL_NAMESPACE': process.env.TESTMAIL_NAMESPACE,
  'EMAIL_USER': process.env.EMAIL_USER,
  'EMAIL_HOST': process.env.EMAIL_HOST,
  'PORT': process.env.PORT
};

Object.entries(checks).forEach(([key, value]) => {
  const hasPlaceholder = value && (
    value.includes('your-') || 
    value.includes('example') || 
    value.includes('placeholder')
  );
  
  if (!value) {
    console.log(`❌ ${key}: NOT SET`);
  } else if (hasPlaceholder) {
    console.log(`⚠️  ${key}: HAS PLACEHOLDER (needs real value)`);
  } else {
    console.log(`✅ ${key}: SET`);
  }
});

console.log('\n📝 Next steps:');
if (process.env.TESTMAIL_API_KEY?.includes('your_testmail')) {
  console.log('1. Get Testmail API key from https://testmail.app');
  console.log('2. Update TESTMAIL_API_KEY and TESTMAIL_NAMESPACE in .env');
}
if (process.env.EMAIL_USER?.includes('your-email')) {
  console.log('3. Update EMAIL_USER and EMAIL_PASS with real Gmail credentials');
}
