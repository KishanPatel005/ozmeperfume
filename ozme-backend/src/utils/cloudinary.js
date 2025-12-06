import { v2 as cloudinary } from 'cloudinary';

// Lazy initialization - configure only when needed
let isConfigured = false;

const configureCloudinary = () => {
    if (isConfigured) {
        return true;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Debug: Log which variables are missing
    if (!cloudName || !apiKey || !apiSecret) {
        const missing = [];
        if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
        if (!apiKey) missing.push('CLOUDINARY_API_KEY');
        if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
        
        console.error('❌ Cloudinary Configuration Error - Missing variables:');
        console.error(`   CLOUDINARY_CLOUD_NAME: ${cloudName ? '✓ Set' : '✗ Missing'}`);
        console.error(`   CLOUDINARY_API_KEY: ${apiKey ? '✓ Set' : '✗ Missing'}`);
        console.error(`   CLOUDINARY_API_SECRET: ${apiSecret ? '✓ Set' : '✗ Missing'}`);
        console.error('💡 Please check your .env file in ozme-backend directory and ensure all Cloudinary variables are set.');
        console.error('💡 After updating .env file, restart the server.');
        
        const errorMsg = `Cloudinary credentials not configured. Missing: ${missing.join(', ')}. Please set these in your .env file and restart the server.`;
        throw new Error(errorMsg);
    }

    try {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
        
        isConfigured = true;
        console.log('✅ Cloudinary configured successfully');
        return true;
    } catch (configError) {
        console.error('❌ Cloudinary configuration failed:', configError.message);
        throw new Error(`Failed to configure Cloudinary: ${configError.message}`);
    }
};

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the image file or base64 string
 * @param {string} folder - Folder name in Cloudinary (default: 'ozme-products')
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadImage = async (filePath, folder = 'ozme-products') => {
    try {
        // Configure Cloudinary before use
        configureCloudinary();

        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        // Provide more helpful error messages
        if (error.message.includes('credentials not configured')) {
            throw error;
        }
        
        throw new Error(`Failed to upload image to Cloudinary: ${error.message || 'Unknown error'}`);
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} filePaths - Array of image paths or base64 strings
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array<Object>>} - Array of upload results
 */
export const uploadMultipleImages = async (filePaths, folder = 'ozme-products') => {
    try {
        const uploadPromises = filePaths.map((filePath) => uploadImage(filePath, folder));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteImage = async (publicId) => {
    try {
        // Configure Cloudinary before use
        configureCloudinary();
        
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        
        if (error.message.includes('credentials not configured')) {
            throw error;
        }
        
        throw new Error(`Failed to delete image from Cloudinary: ${error.message || 'Unknown error'}`);
    }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteMultipleImages = async (publicIds) => {
    try {
        // Configure Cloudinary before use
        configureCloudinary();
        
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error('Cloudinary multiple delete error:', error);
        
        if (error.message.includes('credentials not configured')) {
            throw error;
        }
        
        throw new Error(`Failed to delete images from Cloudinary: ${error.message || 'Unknown error'}`);
    }
};

export default cloudinary;
