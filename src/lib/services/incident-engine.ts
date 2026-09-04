import { prisma } from '../prisma';
import { eventHub } from '../events/event-hub';

export class IncidentEngine {
  async getActiveIncidents() {
    const merchantId = 'mch_apex_01';
    return prisma.incident.findMany({
      where: { merchantId, status: 'ACTIVE' },
      orderBy: { startedAt: 'desc' },
    });
  }

  async triggerUpiSpikeSimulation() {
    const merchantId = 'mch_apex_01';

    // Create or update active UPI anomaly incident
    const incident = await prisma.incident.create({
      data: {
        merchantId,
        title: 'UPI Failure Spike Detected',
        paymentMethod: 'UPI',
        baselineRate: 4.0,
        currentRate: 13.8,
        status: 'ACTIVE',
        startedAt: new Date(),
        affectedValue: 184200,
        possibleExplanation: 'Sudden high traffic volume coincided with partner bank acquiring server timeout bursts.',
        likelyFactor: 'NPCI UPI switch response delay increased from 180ms to 4,200ms for specific issuing bank handles.',
      },
    });

    await prisma.auditLog.create({
      data: {
        merchantId,
        entityType: 'INCIDENT',
        entityId: incident.id,
        action: 'ANOMALY_DETECTED',
        details: `Payment Incident Triggered: UPI Failure Spike (Baseline 4.0% -> Current 13.8%).`,
      },
    });

    eventHub.broadcast('incident.detected', {
      id: incident.id,
      title: incident.title,
      paymentMethod: incident.paymentMethod,
      baselineRate: incident.baselineRate,
      currentRate: incident.currentRate,
      startedAt: incident.startedAt.toISOString(),
      possibleExplanation: incident.possibleExplanation,
      likelyFactor: incident.likelyFactor,
    });

    return incident;
  }

  async resolveIncident(incidentId: string) {
    const incident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    eventHub.broadcast('incident.resolved', {
      id: incidentId,
      title: incident.title,
    });

    return incident;
  }
}

export const incidentEngine = new IncidentEngine();
