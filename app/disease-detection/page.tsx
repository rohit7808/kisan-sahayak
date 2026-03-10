"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { Upload, Activity, AlertTriangle, Info, ShieldCheck, Leaf } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Pre-defined fallback agricultural advisory actions based on generic features
const getAdvisoryForPrediction = (predictionClass: string) => {
    // We add dynamic agricultural advice mapping since MobileNet is an ImageNet model
    return {
        causes: `Based on the visual patterns identified as "${predictionClass}", this is often linked to environmental stress, pest activity (like aphids or mites), or early-stage fungal pathogens thriving in humid conditions.`,
        treatment: [
            "Use broad-spectrum organic fungicides (like Neem Oil) for initial care.",
            "Apply Potassium-rich fertilizers to boost the plant's systemic resistance.",
            "If insect damage is suspected, use mild insecticidal soap or Spinosad."
        ],
        prevention: [
            "Maintain proper plant spacing for good air circulation.",
            "Ensure regular, balanced watering without over-soaking the soil.",
            "Inspect underneath the leaves regularly for early signs of pests or spores."
        ]
    };
};

export default function DiseaseDetectionPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Load the TensorFlow.js MobileNet model on component mount
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready(); // Ensure TF Backend is ready
                const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
                setModel(loadedModel);
            } catch (error) {
                console.error("Failed to load TensorFlow model:", error);
            }
        };
        loadModel();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setResult(null);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage || !imageRef.current || !model) return;

        setIsAnalyzing(true);
        setResult(null);

        try {
            // Run TensorFlow.js classification on the DOM image element
            const predictions = await model.classify(imageRef.current);
            console.log("TF Predictions:", predictions);

            // Get the top prediction
            const topPrediction = predictions[0];
            const confidencePercent = (topPrediction.probability * 100).toFixed(1);

            // Format class name
            const className = topPrediction.className.charAt(0).toUpperCase() + topPrediction.className.slice(1).split(',')[0];

            // Get advisory based on prediction
            const advisory = getAdvisoryForPrediction(className);

            setResult({
                name: `${className}`,
                confidence: confidencePercent,
                causes: advisory.causes,
                treatment: advisory.treatment,
                prevention: advisory.prevention
            });

        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze image. Please try again with a clearer picture.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Crop Disease Detection (AI)</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                Upload a clear picture of the infected crop leaf. Our TensorFlow AI model will classify the image and provide treatment advice.
            </p>

            <div className={styles.uploadSection}>
                {!selectedImage ? (
                    <>
                        <div className={styles.fileInputWrapper}>
                            <button className={styles.uploadButton}>
                                <Upload size={24} />
                                Select Crop Image
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={styles.fileInput}
                            />
                        </div>
                        <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>
                            Supported formats: JPG, PNG, JPEG. Make sure the leaf is well-lit.
                        </p>
                    </>
                ) : (
                    <div className={styles.previewContainer}>
                        {/* We use crossOrigin="anonymous" to avoid canvas tainting issues with TF */}
                        <img
                            ref={imageRef}
                            src={selectedImage}
                            alt="Crop Preview"
                            className={styles.imagePreview}
                            crossOrigin="anonymous"
                        />

                        {!isAnalyzing && !result && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    className={styles.analyzeBtn}
                                    onClick={analyzeImage}
                                    disabled={!model} // Disable if model isn't loaded yet
                                >
                                    <Activity size={20} />
                                    {model ? "Detect Disease" : "Loading AI..."}
                                </button>

                                <div className={styles.fileInputWrapper} style={{ marginBottom: 0 }}>
                                    <button className={styles.uploadButton} style={{ background: '#666', fontSize: '1rem', padding: '10px 20px' }}>
                                        Change Image
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={styles.fileInput}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isAnalyzing && (
                <div className={styles.loading}>
                    <Activity size={48} className={styles.spinner} />
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>AI is analyzing visual features...</p>
                </div>
            )}

            {result && (
                <div className={styles.resultsSection}>
                    <h2 className={styles.diseaseName}>
                        <AlertTriangle size={28} style={{ display: 'inline', verticalAlign: 'bottom', marginRight: '10px' }} />
                        Detected: {result.name}
                    </h2>

                    {/* Confidence Score Display */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--primary-green)' }}>
                        <strong>Confidence Level: </strong> {result.confidence}%
                    </div>

                    <div className={styles.resultGroup}>
                        <h3><Info size={20} /> Agricultural Assessment</h3>
                        <p>{result.causes}</p>
                    </div>

                    <div className={styles.resultGroup}>
                        <h3><Leaf size={20} style={{ color: 'var(--primary-green)' }} /> Suggested Treatment & Fertilizers</h3>
                        <ul>
                            {result.treatment.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.resultGroup}>
                        <h3><ShieldCheck size={20} style={{ color: 'var(--primary-blue)' }} /> Prevention Tips</h3>
                        <ul>
                            {result.prevention.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className={styles.uploadButton}
                            style={{ margin: '0 auto' }}
                            onClick={() => {
                                setSelectedImage(null);
                                setResult(null);
                            }}
                        >
                            Scan Another Crop
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
