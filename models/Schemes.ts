import mongoose, { Schema, model, models } from 'mongoose';

const cropSchema = new Schema({
    name: { type: String, required: true },
    hindiName: String,
    soilTypes: [String],
    seasons: [String], // e.g., Kharif, Rabi
    description: String,
    inputs: {
        fertilizer: String,
        pesticide: String
    },
    imageUrl: String
});

const schemeSchema = new Schema({
    title: { type: String, required: true },
    hindiTitle: String,
    description: String,
    hindiDescription: String,
    link: String,
    category: String
});

const marketPriceSchema = new Schema({
    cropName: { type: String, required: true },
    marketName: { type: String, required: true },
    price: { type: Number, required: true }, // per quintal
    date: { type: Date, default: Date.now }
});

export const Crop = models.Crop || model('Crop', cropSchema);
export const Scheme = models.Scheme || model('Scheme', schemeSchema);
export const MarketPrice = models.MarketPrice || model('MarketPrice', marketPriceSchema);
