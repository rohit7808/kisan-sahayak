import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface ICrop {
  name: string;
  hindiName?: string;
  soilTypes: string[];
  seasons: string[];
  description?: string;
  inputs?: {
    fertilizer?: string;
    pesticide?: string;
  };
  imageUrl?: string;
}

export interface ICropDocument extends ICrop, Document {}

const cropSchema = new Schema<ICrop>({
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
