import bcrypt from "bcryptjs"

async function generateHash() {
    const password = 'admin123';
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('🔑 Password:', password);
        console.log('🔐 Generated Hash:', hash);
        
        // Test the hash
        const isValid = await bcrypt.compare(password, hash);
        console.log('✅ Hash Validation:', isValid);
        
        console.log('\n📋 SQL UPDATE Command:');
        console.log(`UPDATE users SET password = '${hash}' WHERE email = 'superadmin@company.com';`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

generateHash();