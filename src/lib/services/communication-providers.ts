export interface CommunicationPayload {
  recipient: string;
  customerName: string;
  orderId: string;
  amount: number;
  paymentLink: string;
}

export interface CommunicationResult {
  success: boolean;
  messageId: string;
  provider: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  timestamp: string;
  deliveryStatus: 'SENT' | 'DELIVERED' | 'FAILED';
  error?: string;
}

export interface CommunicationProvider {
  sendWhatsApp(payload: CommunicationPayload): Promise<CommunicationResult>;
  sendSMS(payload: CommunicationPayload): Promise<CommunicationResult>;
  sendEmail(payload: CommunicationPayload): Promise<CommunicationResult>;
}

export class MockWhatsAppProvider implements CommunicationProvider {
  async sendWhatsApp(payload: CommunicationPayload): Promise<CommunicationResult> {
    // Simulate slight network latency
    await new Promise((res) => setTimeout(res, 120));

    return {
      success: true,
      messageId: `wa_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: 'Meta WhatsApp Business API (Simulated)',
      channel: 'WHATSAPP',
      timestamp: new Date().toISOString(),
      deliveryStatus: 'DELIVERED',
    };
  }

  async sendSMS(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendWhatsApp(payload);
  }

  async sendEmail(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendWhatsApp(payload);
  }
}

export class MockSMSProvider implements CommunicationProvider {
  async sendSMS(payload: CommunicationPayload): Promise<CommunicationResult> {
    await new Promise((res) => setTimeout(res, 100));

    return {
      success: true,
      messageId: `sms_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: 'Twilio / Telecom Gateway (Simulated)',
      channel: 'SMS',
      timestamp: new Date().toISOString(),
      deliveryStatus: 'DELIVERED',
    };
  }

  async sendWhatsApp(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendSMS(payload);
  }

  async sendEmail(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendSMS(payload);
  }
}

export class MockEmailProvider implements CommunicationProvider {
  async sendEmail(payload: CommunicationPayload): Promise<CommunicationResult> {
    await new Promise((res) => setTimeout(res, 150));

    return {
      success: true,
      messageId: `eml_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: 'SendGrid / AWS SES (Simulated)',
      channel: 'EMAIL',
      timestamp: new Date().toISOString(),
      deliveryStatus: 'DELIVERED',
    };
  }

  async sendWhatsApp(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendEmail(payload);
  }

  async sendSMS(payload: CommunicationPayload): Promise<CommunicationResult> {
    return this.sendEmail(payload);
  }
}

// Router class to pick provider based on channel configuration
export class MultiChannelCommunicationService {
  private waProvider = new MockWhatsAppProvider();
  private smsProvider = new MockSMSProvider();
  private emailProvider = new MockEmailProvider();

  async dispatchMessage(
    channel: 'WHATSAPP' | 'SMS' | 'EMAIL',
    payload: CommunicationPayload
  ): Promise<CommunicationResult> {
    switch (channel) {
      case 'WHATSAPP':
        return this.waProvider.sendWhatsApp(payload);
      case 'SMS':
        return this.smsProvider.sendSMS(payload);
      case 'EMAIL':
        return this.emailProvider.sendEmail(payload);
      default:
        return this.waProvider.sendWhatsApp(payload);
    }
  }
}

export const communicationService = new MultiChannelCommunicationService();
