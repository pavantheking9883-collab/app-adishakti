const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

const accountSid = process.argv[2] || process.env.TWILIO_ACCOUNT_SID;
const authToken = process.argv[3] || process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error("ERROR: Missing Twilio Account SID or Auth Token arguments.");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function run() {
  try {
    const numbers = await client.incomingPhoneNumbers.list({ limit: 1 });
    if (numbers.length === 0) {
      console.log('NO_NUMBERS_FOUND');
      return;
    }
    const number = numbers[0].phoneNumber;
    console.log('FOUND_NUMBER:' + number);
    
    // Update .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Clean existing Twilio keys if any
    envContent = envContent
      .split('\n')
      .filter(line => !line.startsWith('TWILIO_ACCOUNT_SID') && !line.startsWith('TWILIO_AUTH_TOKEN') && !line.startsWith('TWILIO_PHONE_NUMBER'))
      .join('\n');
      
    envContent += `\nTWILIO_ACCOUNT_SID="${accountSid}"`;
    envContent += `\nTWILIO_AUTH_TOKEN="${authToken}"`;
    envContent += `\nTWILIO_PHONE_NUMBER="${number}"\n`;
    
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('ENV_UPDATED_SUCCESS');
  } catch (err) {
    console.error('ERROR:' + err.message);
  }
}

run();
