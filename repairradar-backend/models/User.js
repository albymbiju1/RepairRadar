const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userRoles = require("../constants/roles");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
            sparse: true,
        },

        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            zip: { type: String, trim: true },
        },

        role: {
            type: String,
            enum: Object.values(userRoles),
            default: userRoles.CUSTOMER,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // Technician-specific fields
        specialties: {
            type: [String],
            default: [],
            index: true,
        },

        hourlyRate: {
            type: Number,
            min: 0,
        },

        yearsOfExperience: {
            type: Number,
            min: 0,
        },

        completedJobs: {
            type: Number,
            default: 0,
            min: 0,
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password when it is created or changed.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Compare a login password with the stored hash.
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
