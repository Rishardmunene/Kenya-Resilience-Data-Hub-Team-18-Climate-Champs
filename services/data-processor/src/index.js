const cron = require('node-cron');
require('dotenv').config();

console.log('🔄 KCRD Data Processor starting...');

// Mock data processing function
const processClimateData = async () => {
  console.log('📊 Processing climate data...');
  
  // Simulate data processing
  const mockData = {
    timestamp: new Date().toISOString(),
    regions: [
      { name: 'Nairobi', temperature: 24.5, rainfall: 45.2, aqi: 156 },
      { name: 'Mombasa', temperature: 28.1, rainfall: 67.8, aqi: 45 },
      { name: 'Kisumu', temperature: 26.3, rainfall: 52.1, aqi: 78 }
    ]
  };
  
  console.log('✅ Data processed:', mockData);
  return mockData;
};

// Schedule data processing every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    await processClimateData();
  } catch (error) {
    console.error('❌ Error processing data:', error);
  }
});

// Health check function
const healthCheck = () => {
  return {
    status: 'healthy',
    service: 'data-processor',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
};

// Start the service
console.log('🚀 KCRD Data Processor running...');
console.log('⏰ Scheduled data processing every 5 minutes');

// Export for testing
module.exports = { processClimateData, healthCheck };
