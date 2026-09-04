module.exports = [
"[project]/.next-internal/server/app/api/instant-checkout/verify/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'error'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventHub",
    ()=>eventHub
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/events [external] (events, cjs)");
;
class EventHub extends __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__["EventEmitter"] {
    clients = new Set();
    constructor(){
        super();
        this.setMaxListeners(100);
    }
    subscribe(callback) {
        this.clients.add(callback);
        return ()=>{
            this.clients.delete(callback);
        };
    }
    broadcast(type, data) {
        const payload = {
            type,
            timestamp: new Date().toISOString(),
            data
        };
        this.emit(type, payload);
        // Push to all active SSE subscribers
        this.clients.forEach((client)=>{
            try {
                client(payload);
            } catch (err) {
                console.error('Error broadcasting event to SSE client:', err);
            }
        });
    }
    getSubscriberCount() {
        return this.clients.size;
    }
}
// Singleton EventHub
const globalForEvents = globalThis;
const eventHub = globalForEvents.eventHub ?? new EventHub();
if ("TURBOPACK compile-time truthy", 1) globalForEvents.eventHub = eventHub;
}),
"[project]/src/lib/services/communication-providers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MockEmailProvider",
    ()=>MockEmailProvider,
    "MockSMSProvider",
    ()=>MockSMSProvider,
    "MockWhatsAppProvider",
    ()=>MockWhatsAppProvider,
    "MultiChannelCommunicationService",
    ()=>MultiChannelCommunicationService,
    "communicationService",
    ()=>communicationService
]);
class MockWhatsAppProvider {
    async sendWhatsApp(payload) {
        // Simulate slight network latency
        await new Promise((res)=>setTimeout(res, 120));
        return {
            success: true,
            messageId: `wa_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            provider: 'Meta WhatsApp Business API (Simulated)',
            channel: 'WHATSAPP',
            timestamp: new Date().toISOString(),
            deliveryStatus: 'DELIVERED'
        };
    }
    async sendSMS(payload) {
        return this.sendWhatsApp(payload);
    }
    async sendEmail(payload) {
        return this.sendWhatsApp(payload);
    }
}
class MockSMSProvider {
    async sendSMS(payload) {
        await new Promise((res)=>setTimeout(res, 100));
        return {
            success: true,
            messageId: `sms_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            provider: 'Twilio / Telecom Gateway (Simulated)',
            channel: 'SMS',
            timestamp: new Date().toISOString(),
            deliveryStatus: 'DELIVERED'
        };
    }
    async sendWhatsApp(payload) {
        return this.sendSMS(payload);
    }
    async sendEmail(payload) {
        return this.sendSMS(payload);
    }
}
class MockEmailProvider {
    async sendEmail(payload) {
        await new Promise((res)=>setTimeout(res, 150));
        return {
            success: true,
            messageId: `eml_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            provider: 'SendGrid / AWS SES (Simulated)',
            channel: 'EMAIL',
            timestamp: new Date().toISOString(),
            deliveryStatus: 'DELIVERED'
        };
    }
    async sendWhatsApp(payload) {
        return this.sendEmail(payload);
    }
    async sendSMS(payload) {
        return this.sendEmail(payload);
    }
}
class MultiChannelCommunicationService {
    waProvider = new MockWhatsAppProvider();
    smsProvider = new MockSMSProvider();
    emailProvider = new MockEmailProvider();
    async dispatchMessage(channel, payload) {
        switch(channel){
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
const communicationService = new MultiChannelCommunicationService();
}),
"[project]/src/lib/services/recovery-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecoveryEngine",
    ()=>RecoveryEngine,
    "recoveryEngine",
    ()=>recoveryEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$communication$2d$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/communication-providers.ts [app-route] (ecmascript)");
;
;
;
class RecoveryEngine {
    /**
   * Check whether a failed payment is eligible for recovery workflow execution
   */ async checkEligibility(paymentId) {
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findUnique({
            where: {
                id: paymentId
            },
            include: {
                customer: true,
                order: true,
                merchant: true,
                recoveryWorkflow: true
            }
        });
        if (!payment) {
            return {
                eligible: false,
                score: 0,
                reason: 'Payment record not found',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 1: Check if payment is already successful or recovered
        if (payment.status === 'SUCCESS' || payment.status === 'RECOVERED') {
            return {
                eligible: false,
                score: 0,
                reason: 'Payment is already completed or recovered',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 2: If status is PENDING, wait and do NOT execute messaging to prevent double charge
        if (payment.status === 'PENDING') {
            return {
                eligible: false,
                score: 0,
                reason: 'Payment is currently PENDING verification',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 3: Check Order Validity
        if (payment.order && (payment.order.status === 'CANCELLED' || payment.order.status === 'COMPLETED')) {
            return {
                eligible: false,
                score: 0,
                reason: `Order status is ${payment.order.status}`,
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 4: Check Customer Presence
        if (!payment.customer) {
            return {
                eligible: false,
                score: 0,
                reason: 'No known customer contact available (Mode 2 Instant Checkout applies)',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 5: Check Customer Opt-Out / Consent
        if (payment.customer.consentOptOut) {
            return {
                eligible: false,
                score: 0,
                reason: 'Customer has opted out of communication notifications',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 6: Check Available Contact Details (Merchant CRM rule - never assume 3rd party app data)
        const hasPhone = Boolean(payment.customer.phone && payment.customer.phone.trim().length >= 10);
        const hasEmail = Boolean(payment.customer.email && payment.customer.email.includes('@'));
        if (!hasPhone && !hasEmail) {
            return {
                eligible: false,
                score: 0,
                reason: 'Merchant system has no phone or email for this customer',
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 7: Check Attempt Limit (Merchant configured max attempts: 2 or 3)
        const maxAttempts = payment.merchant?.maxRecoveryAttempts || 3;
        const currentAttempts = payment.recoveryWorkflow?.currentAttempts || 0;
        if (currentAttempts >= maxAttempts) {
            return {
                eligible: false,
                score: 0,
                reason: `Maximum recovery attempts (${maxAttempts}) reached`,
                recommendedChannel: 'WHATSAPP'
            };
        }
        // Rule 8: Determine Best Channel
        let channel = 'WHATSAPP';
        if (payment.customer.preferredChannel === 'EMAIL' && hasEmail) {
            channel = 'EMAIL';
        } else if (payment.customer.preferredChannel === 'SMS' && hasPhone) {
            channel = 'SMS';
        } else if (hasPhone) {
            channel = 'WHATSAPP';
        } else if (hasEmail) {
            channel = 'EMAIL';
        }
        // Calculate Recovery Score (0 - 100)
        let score = 70;
        if (payment.amount > 5000) score += 10;
        if (payment.paymentMethod === 'UPI') score += 5;
        if (payment.failureReason === 'BANK_SERVER_TIMEOUT' || payment.failureReason === 'NETWORK_FLAP') score += 10;
        if (payment.failureReason === 'INSUFFICIENT_FUNDS') score -= 15;
        if (currentAttempts > 0) score -= 10 * currentAttempts;
        score = Math.max(10, Math.min(99, score));
        return {
            eligible: true,
            score,
            reason: 'Eligible for automated recovery',
            recommendedChannel: channel
        };
    }
    /**
   * Initiate or proceed with automated recovery attempt
   */ async processRecovery(paymentId, manualChannelOverride) {
        const eligibility = await this.checkEligibility(paymentId);
        if (!eligibility.eligible) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
                data: {
                    merchantId: 'mch_apex_01',
                    entityType: 'RECOVERY_ENGINE',
                    entityId: paymentId,
                    action: 'RECOVERY_BLOCKED',
                    details: `Recovery execution skipped for payment ${paymentId}: ${eligibility.reason}`
                }
            });
            return {
                success: false,
                reason: eligibility.reason
            };
        }
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findUnique({
            where: {
                id: paymentId
            },
            include: {
                customer: true,
                order: true,
                merchant: true
            }
        });
        if (!payment || !payment.customer) {
            return {
                success: false,
                reason: 'Payment or customer invalid'
            };
        }
        const channel = manualChannelOverride || eligibility.recommendedChannel;
        const recipient = channel === 'EMAIL' ? payment.customer.email : payment.customer.phone;
        if (!recipient) {
            return {
                success: false,
                reason: `Customer has no valid address for ${channel}`
            };
        }
        // Get or create Recovery Workflow
        let workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.findUnique({
            where: {
                paymentId
            }
        });
        if (!workflow) {
            workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.create({
                data: {
                    paymentId,
                    merchantId: payment.merchantId,
                    customerId: payment.customerId,
                    mode: 'KNOWN_CUSTOMER',
                    status: 'IN_PROGRESS',
                    recoveryScore: eligibility.score,
                    recommendedChannel: channel,
                    currentAttempts: 0,
                    maxAttempts: payment.merchant.maxRecoveryAttempts || 3
                }
            });
        }
        const nextAttemptNum = workflow.currentAttempts + 1;
        const paymentLink = `https://recoverflow.ai/checkout/${payment.id}?token=demo_sec_${Date.now()}`;
        // Polite, neutral message content (No threatening/aggressive wording)
        const bodyText = `Hi ${payment.customer.name},\n\nYour payment for order ${payment.order?.orderNumber || payment.id} (₹${payment.amount.toLocaleString()}) was not completed.\n\nIf you would still like to complete your purchase, you can use the secure payment link below:\n${paymentLink}\n\nNo action is required if you have already completed the payment.`;
        // Dispatch via Communication Provider
        const commResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$communication$2d$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["communicationService"].dispatchMessage(channel, {
            recipient,
            customerName: payment.customer.name,
            orderId: payment.order?.orderNumber || payment.id,
            amount: payment.amount,
            paymentLink
        });
        // Create Recovery Attempt Record
        const attempt = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryAttempt.create({
            data: {
                workflowId: workflow.id,
                attemptNumber: nextAttemptNum,
                channel,
                status: commResult.deliveryStatus,
                sentAt: new Date()
            }
        });
        // Log Communication Message
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].communicationMessage.create({
            data: {
                recoveryAttemptId: attempt.id,
                channel,
                recipient,
                subject: channel === 'EMAIL' ? `Payment Recovery Request - Order ${payment.order?.orderNumber || payment.id}` : null,
                body: bodyText,
                paymentLink,
                deliveryStatus: commResult.deliveryStatus
            }
        });
        // Update Workflow Attempt Count
        const isLastAttempt = nextAttemptNum >= workflow.maxAttempts;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.update({
            where: {
                id: workflow.id
            },
            data: {
                currentAttempts: nextAttemptNum,
                status: isLastAttempt ? 'STOPPED' : 'IN_PROGRESS',
                stopReason: isLastAttempt ? 'MAX_ATTEMPTS_REACHED' : null
            }
        });
        // Create Audit Log
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
            data: {
                merchantId: payment.merchantId,
                entityType: 'RECOVERY_WORKFLOW',
                entityId: workflow.id,
                action: 'MESSAGE_SENT',
                details: `Attempt #${nextAttemptNum} sent to ${payment.customer.name} via ${channel} (${recipient}).`
            }
        });
        // Broadcast Real-time Event
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast('recovery.attempt', {
            paymentId,
            workflowId: workflow.id,
            attemptNumber: nextAttemptNum,
            channel,
            customerName: payment.customer.name,
            amount: payment.amount,
            status: 'SENT'
        });
        return {
            success: true,
            workflowId: workflow.id,
            attemptNumber: nextAttemptNum,
            channel,
            recipient,
            messageId: commResult.messageId
        };
    }
    /**
   * Stop automated recovery for a payment
   */ async stopRecovery(paymentId, reason) {
        const workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.findUnique({
            where: {
                paymentId
            }
        });
        if (!workflow) return;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.update({
            where: {
                id: workflow.id
            },
            data: {
                status: 'STOPPED',
                stopReason: reason
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
            data: {
                merchantId: workflow.merchantId,
                entityType: 'RECOVERY_WORKFLOW',
                entityId: workflow.id,
                action: 'AUTOMATION_STOPPED',
                details: `Recovery workflow stopped for payment ${paymentId}. Reason: ${reason}`
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast('recovery.stopped', {
            paymentId,
            workflowId: workflow.id,
            reason
        });
    }
    /**
   * Mark payment as RECOVERED upon customer link payment
   */ async completeRecovery(paymentId) {
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findUnique({
            where: {
                id: paymentId
            },
            include: {
                order: true,
                recoveryWorkflow: true
            }
        });
        if (!payment) return null;
        // Update payment status
        const updatedPayment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.update({
            where: {
                id: paymentId
            },
            data: {
                status: 'RECOVERED',
                recoveredAt: new Date(),
                recoveryValue: payment.amount
            }
        });
        // Update Order status if present
        if (payment.orderId) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.update({
                where: {
                    id: payment.orderId
                },
                data: {
                    status: 'COMPLETED'
                }
            });
        }
        // Stop Workflow with PAYMENT_COMPLETED
        if (payment.recoveryWorkflow) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].recoveryWorkflow.update({
                where: {
                    id: payment.recoveryWorkflow.id
                },
                data: {
                    status: 'COMPLETED',
                    stopReason: 'PAYMENT_COMPLETED'
                }
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
            data: {
                merchantId: payment.merchantId,
                entityType: 'PAYMENT',
                entityId: paymentId,
                action: 'PAYMENT_RECOVERED',
                details: `Payment ${paymentId} of ₹${payment.amount} successfully recovered via customer recovery link. Automation stopped.`
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast('payment.recovered', {
            paymentId,
            amount: payment.amount,
            merchantId: payment.merchantId
        });
        return updatedPayment;
    }
}
const recoveryEngine = new RecoveryEngine();
}),
"[project]/src/lib/services/payment-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaymentEngine",
    ()=>PaymentEngine,
    "paymentEngine",
    ()=>paymentEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/events/event-hub.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$recovery$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/recovery-engine.ts [app-route] (ecmascript)");
;
;
;
class PaymentEngine {
    /**
   * Record a payment event and process downstream recovery workflows
   */ async processPaymentEvent(input) {
        const merchantId = input.merchantId || 'mch_apex_01';
        // Verify existing payment or order status to prevent duplicate processing
        if (input.orderId) {
            const existingOrder = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findUnique({
                where: {
                    id: input.orderId
                },
                include: {
                    payments: true
                }
            });
            if (existingOrder && existingOrder.status === 'COMPLETED') {
                return {
                    status: 'BLOCKED_DUPLICATE',
                    message: 'Order has already been completed successfully. Double payment prevented.'
                };
            }
        }
        // Create Payment record
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.create({
            data: {
                merchantId,
                customerId: input.customerId,
                orderId: input.orderId,
                amount: input.amount,
                currency: 'INR',
                paymentMethod: input.paymentMethod,
                provider: input.provider || 'Razorpay',
                status: input.status,
                failureReason: input.failureReason || null,
                recoveryValue: input.status === 'SUCCESS' ? input.amount : 0
            },
            include: {
                customer: true,
                order: true
            }
        });
        // Record initial payment attempt
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].paymentAttempt.create({
            data: {
                paymentId: payment.id,
                attemptNumber: 1,
                status: input.status,
                responseCode: input.status === 'SUCCESS' ? '200_OK' : input.failureReason || 'ERR_UNKNOWN'
            }
        });
        // Create Audit log
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].auditLog.create({
            data: {
                merchantId,
                entityType: 'PAYMENT',
                entityId: payment.id,
                action: `PAYMENT_${input.status}`,
                details: `Payment of ₹${input.amount} via ${input.paymentMethod} set to ${input.status}.`
            }
        });
        // Broadcast SSE event
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$events$2f$event$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eventHub"].broadcast(`payment.${input.status.toLowerCase()}`, {
            paymentId: payment.id,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            customerName: payment.customer?.name || 'Anonymous POS Customer',
            failureReason: payment.failureReason
        });
        // Auto-trigger recovery workflow if FAILED and customer is known
        if (input.status === 'FAILED' && input.customerId) {
            // Execute in background
            setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$recovery$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recoveryEngine"].processRecovery(payment.id).catch(console.error);
            }, 500);
        }
        return payment;
    }
    /**
   * Mode 2 Instant Checkout Status Verification
   * Critical safety check to prevent double payments
   */ async verifyInstantCheckoutStatus(paymentId) {
        const payment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findUnique({
            where: {
                id: paymentId
            },
            include: {
                order: true
            }
        });
        if (!payment) {
            return {
                verifiedState: 'NOT_FOUND',
                message: 'No transaction record found with this ID.',
                canPayAgain: false
            };
        }
        if (payment.status === 'SUCCESS' || payment.status === 'RECOVERED') {
            return {
                verifiedState: 'SUCCESS',
                amount: payment.amount,
                message: 'Payment confirmed successfully. DO NOT ask customer to pay again.',
                canPayAgain: false
            };
        }
        if (payment.status === 'PENDING') {
            return {
                verifiedState: 'PENDING',
                amount: payment.amount,
                message: 'Payment confirmation pending. Please wait while we verify with bank gateway.',
                canPayAgain: false
            };
        }
        // Status is FAILED
        return {
            verifiedState: 'FAILED',
            amount: payment.amount,
            failureReason: payment.failureReason || 'Transaction rejected by issuing bank',
            message: 'Payment was not completed. You may select a retry option below.',
            canPayAgain: true,
            options: [
                'TRY_AGAIN_STATUS_CHECK',
                'GENERATE_NEW_PAYMENT_REQUEST',
                'SHOW_NEW_QR',
                'CHANGE_PAYMENT_METHOD',
                'CASH_OPTION'
            ]
        };
    }
}
const paymentEngine = new PaymentEngine();
}),
"[project]/src/app/api/instant-checkout/verify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$payment$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/payment-engine.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function POST(req) {
    try {
        const { paymentId, amount, paymentMethod } = await req.json();
        if (!paymentId) {
            // Simulate creating an anonymous POS payment verification attempt
            const newPayment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$payment$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paymentEngine"].processPaymentEvent({
                merchantId: 'mch_apex_01',
                amount: amount || 50,
                paymentMethod: paymentMethod || 'UPI',
                status: 'PENDING',
                isKnownCustomer: false
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                verifiedState: 'PENDING',
                paymentId: newPayment.id || null,
                amount: newPayment.amount || amount || 50,
                message: 'Payment confirmation pending. Please wait while we verify with bank gateway.',
                canPayAgain: false
            });
        }
        const verification = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$payment$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paymentEngine"].verifyInstantCheckoutStatus(paymentId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(verification);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2c41b1dc._.js.map