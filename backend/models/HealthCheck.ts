import mongoose from 'mongoose';

const HealthCheckSchema = new mongoose.Schema<IHealthCheck>(
  {
    event: String,
  },
  {
    collection: 'HealthCheck',
    minimize: false,
  },
);

const HealthCheck = mongoose.model('HealthCheck', HealthCheckSchema);

export default HealthCheck;
