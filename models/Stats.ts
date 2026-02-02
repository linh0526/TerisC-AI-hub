import mongoose, { Schema, model, models } from 'mongoose';

const StatsSchema = new Schema({
  pageViews: { type: Number, default: 0 },
  toolClicks: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const Stats = models.Stats || model('Stats', StatsSchema);

export default Stats;
