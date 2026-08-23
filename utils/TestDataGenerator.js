export default class TestDataGenerator {
    /**
     * Generates a random secure password meeting complexity rules:
     * - Contains Uppercase, Lowercase, Number, and Special Character
     * - 12+ characters long
     * @returns {string} e.g. "Pass@948215Ab"
     */
    static generateRandomPassword() {
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        return `Pass@${randomDigits}Ab`;
    }

    /**
     * Generates a unique timestamp-based string
     * @param {string} prefix
     * @returns {string} e.g. "test_1692200000"
     */
    static generateUniqueId(prefix = 'user') {
        return `${prefix}_${Date.now()}`;
    }
    /**
     * Generates a random full name.
     * @param {string} prefix - Optional prefix.
     * @returns {string} e.g. "Parent Test 4521"
     */
    static generateRandomFullName(prefix = 'Parent') {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${prefix} Test ${randomDigits}`;
    }

    /**
     * Generates a random 10-digit phone number matching the application mask format (XXX)XXX-XXXX.
     * @returns {string} e.g. "(555)234-5678"
     */
    static generateRandomPhoneNumber() {
        const areaCode = '555';
        const mid = Math.floor(100 + Math.random() * 900);
        const last = Math.floor(1000 + Math.random() * 9000);
        return `(${areaCode})${mid}-${last}`;
    }

    /**
     * Generates runtime student details with dynamic name (prefix 'automation student', Date.now(), and random number) and unique identifiers.
     * @param {Object} baseData - Base student details template from JSON
     * @returns {Object} Student details object with dynamic name, email, permit number, and template values.
     */
    static generateStudentData(baseData = {}) {
        const timestamp = Date.now();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const firstName = "automation";
        const lastName = `student ${timestamp} ${randomNum}`;
        const fullName = `${firstName} ${lastName}`;
        const uniqueEmail = `automation_${timestamp}_${randomNum}@test.com`;
        const permitNumber = `${Math.floor(100000000 + Math.random() * 900000000)}`;

        return {
            ...baseData,
            firstName,
            lastName,
            name: fullName,
            studentEmail: baseData.studentEmail || uniqueEmail,
            permitNumber: baseData.permitNumber || permitNumber,
        };
    }
}
