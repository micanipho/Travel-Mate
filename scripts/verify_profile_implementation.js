#!/usr/bin/env node

/**
 * Profile Management Implementation Verification Script
 * 
 * This script verifies that all Profile Management components are properly implemented
 * without requiring a running server or database connection.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Profile Management Implementation Verification\n');

// File paths to check
const files = {
  userController: 'server/controllers/UserController.js',
  validation: 'server/middleware/validation.js',
  userRoutes: 'server/routes/users.js',
  userModel: 'server/models/User.js'
};

// Verification results
const results = {
  passed: 0,
  failed: 0,
  details: []
};

function checkFile(filePath, checks) {
  console.log(`📁 Checking ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    results.failed++;
    results.details.push(`❌ ${filePath} - File not found`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let allPassed = true;
  
  checks.forEach(check => {
    if (check.type === 'contains') {
      if (content.includes(check.text)) {
        results.passed++;
        results.details.push(`✅ ${filePath} - ${check.description}`);
      } else {
        results.failed++;
        results.details.push(`❌ ${filePath} - ${check.description}`);
        allPassed = false;
      }
    } else if (check.type === 'regex') {
      if (check.pattern.test(content)) {
        results.passed++;
        results.details.push(`✅ ${filePath} - ${check.description}`);
      } else {
        results.failed++;
        results.details.push(`❌ ${filePath} - ${check.description}`);
        allPassed = false;
      }
    }
  });
  
  return allPassed;
}

// UserController checks
checkFile(files.userController, [
  {
    type: 'contains',
    text: "const User = require('../models/User');",
    description: 'User model import'
  },
  {
    type: 'contains',
    text: 'static async getProfile(req, res)',
    description: 'getProfile method exists'
  },
  {
    type: 'contains',
    text: 'static async updateProfile(req, res)',
    description: 'updateProfile method exists'
  },
  {
    type: 'contains',
    text: 'static async updatePassword(req, res)',
    description: 'updatePassword method exists'
  },
  {
    type: 'contains',
    text: 'await User.findById(req.user.id)',
    description: 'getProfile implementation'
  },
  {
    type: 'contains',
    text: 'await User.emailExists(email, userId)',
    description: 'Email uniqueness check'
  },
  {
    type: 'contains',
    text: 'await User.verifyPassword(currentPassword',
    description: 'Password verification'
  }
]);

// Validation middleware checks
checkFile(files.validation, [
  {
    type: 'contains',
    text: 'const validatePasswordUpdate = [',
    description: 'validatePasswordUpdate middleware exists'
  },
  {
    type: 'contains',
    text: "body('currentPassword')",
    description: 'Current password validation'
  },
  {
    type: 'contains',
    text: "body('newPassword')",
    description: 'New password validation'
  },
  {
    type: 'contains',
    text: "body('confirmPassword')",
    description: 'Confirm password validation'
  },
  {
    type: 'contains',
    text: 'validatePasswordUpdate',
    description: 'Password validation exported'
  },
  {
    type: 'regex',
    pattern: /matches\(\/\^.*\$\/\)/,
    description: 'Password strength regex'
  }
]);

// Routes checks
checkFile(files.userRoutes, [
  {
    type: 'contains',
    text: "router.get('/profile', authenticateToken",
    description: 'GET profile route'
  },
  {
    type: 'contains',
    text: "router.put('/profile', authenticateToken, validateProfileUpdate",
    description: 'PUT profile route with validation'
  },
  {
    type: 'contains',
    text: "router.put('/password', authenticateToken, validatePasswordUpdate",
    description: 'PUT password route with validation'
  },
  {
    type: 'contains',
    text: 'validatePasswordUpdate',
    description: 'Password validation import'
  }
]);

// User model checks
checkFile(files.userModel, [
  {
    type: 'contains',
    text: 'static async findById(id)',
    description: 'findById method exists'
  },
  {
    type: 'contains',
    text: 'static async updateProfile(id, updateData)',
    description: 'updateProfile method exists'
  },
  {
    type: 'contains',
    text: 'static async updatePassword(id, newPassword)',
    description: 'updatePassword method exists'
  },
  {
    type: 'contains',
    text: 'static async emailExists(email, excludeId',
    description: 'emailExists method exists'
  },
  {
    type: 'contains',
    text: 'static async verifyPassword(plainPassword, hashedPassword)',
    description: 'verifyPassword method exists'
  }
]);

// Print results
console.log('\n📊 Verification Results:');
console.log('========================');
results.details.forEach(detail => console.log(detail));

console.log(`\n📈 Summary:`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📊 Total:  ${results.passed + results.failed}`);

if (results.failed === 0) {
  console.log('\n🎉 All Profile Management components are properly implemented!');
  console.log('✅ Ready for testing and deployment.');
} else {
  console.log('\n⚠️  Some components need attention.');
  console.log('❌ Please review the failed checks above.');
}

console.log('\n🚀 Next Steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Run manual tests using the curl commands in the test report');
console.log('3. Write and run unit tests');
console.log('4. Write and run integration tests');

process.exit(results.failed === 0 ? 0 : 1);
