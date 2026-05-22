import { Schema, model, models } from "mongoose";

export interface GameDocument {
  key: string;
  title: string;
  description?: string;
  internalScoreRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<GameDocument>(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    internalScoreRange: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 3 },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const GameModel = models.Game || model<GameDocument>("Game", gameSchema);
