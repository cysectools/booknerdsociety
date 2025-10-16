#!/usr/bin/env node

/**
 * Generate Secrets for LeftOnRead Deployment
 * 
 * This script generates secure random secrets for your deployment.
 * Run with: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Deployment Secrets for LeftOnRead\n');
console.log('=' .repeat(60));

// Generate JWT Secret (64 bytes = 128 hex chars)
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\n📝 JWT_SECRET (for backend):\n');
console.log(jwtSecret);

// Generate Encryption Key (32 bytes = 64 hex chars)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('\n🔑 VITE_APP_ENCRYPTION_KEY (for frontend):\n');
console.log(encryptionKey);

// Generate Session Secret (32 bytes)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('\n🎫 SESSION_SECRET (optional, for sessions):\n');
console.log(sessionSecret);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets generated successfully!\n');
console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('   - Keep these secrets private and secure');
console.log('   - Never commit secrets to version control');
console.log('   - Use different secrets for development and production');
console.log('   - Rotate secrets regularly (every 3-6 months)');
console.log('   - Store in a password manager or secure vault\n');

console.log('📋 Quick Setup Commands:\n');
console.log('Backend (Railway/Render):');
console.log(`   railway variables set JWT_SECRET="${jwtSecret}"\n`);

console.log('Frontend (Vercel Dashboard):');
console.log(`   VITE_APP_ENCRYPTION_KEY = ${encryptionKey}\n`);

console.log('=' .repeat(60));
console.log('\n');

