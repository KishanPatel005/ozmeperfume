import User from '../models/User.js';

/**
 * Update user profile
 * @route PUT /api/users/me
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Get user addresses
 * @route GET /api/users/me/addresses
 */
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { addresses: user.addresses || [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Add new address
 * @route POST /api/users/me/addresses
 */
export const addAddress = async (req, res) => {
  try {
    const { type, name, phone, address, city, state, pincode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      type,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country: country || 'India',
      isDefault: isDefault || false,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { address: user.addresses[user.addresses.length - 1] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Update address
 * @route PUT /api/users/me/addresses/:addressId
 */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, name, phone, address, city, state, pincode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr, idx) => {
        if (idx !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update address
    const addressToUpdate = user.addresses[addressIndex];
    if (type) addressToUpdate.type = type;
    if (name) addressToUpdate.name = name;
    if (phone) addressToUpdate.phone = phone;
    if (address) addressToUpdate.address = address;
    if (city) addressToUpdate.city = city;
    if (state) addressToUpdate.state = state;
    if (pincode) addressToUpdate.pincode = pincode;
    if (country) addressToUpdate.country = country;
    if (isDefault !== undefined) addressToUpdate.isDefault = isDefault;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address: user.addresses[addressIndex] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Delete address
 * @route DELETE /api/users/me/addresses/:addressId
 */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

