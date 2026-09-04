module.exports = [
"[project]/.next-internal/server/app/api/analytics/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const merchantId = 'mch_apex_01';
        // Channel Performance
        const channelStats = [
            {
                channel: 'WhatsApp',
                attempts: 184,
                successfulRecoveries: 62,
                recoveryRate: '33.7%',
                avgTimeMinutes: 8.5
            },
            {
                channel: 'SMS',
                attempts: 96,
                successfulRecoveries: 24,
                recoveryRate: '25.0%',
                avgTimeMinutes: 14.2
            },
            {
                channel: 'Email',
                attempts: 68,
                successfulRecoveries: 12,
                recoveryRate: '17.6%',
                avgTimeMinutes: 42.0
            }
        ];
        // Payment Method Breakdown
        const paymentMethodStats = [
            {
                method: 'UPI',
                totalVolume: 840,
                successRate: '92.4%',
                failRate: '7.6%',
                recoveredCount: 48,
                recoveredValue: 64200
            },
            {
                method: 'Cards',
                totalVolume: 320,
                successRate: '97.8%',
                failRate: '2.2%',
                recoveredCount: 18,
                recoveredValue: 89400
            },
            {
                method: 'Net Banking',
                totalVolume: 94,
                successRate: '95.1%',
                failRate: '4.9%',
                recoveredCount: 9,
                recoveredValue: 31500
            },
            {
                method: 'Wallets',
                totalVolume: 30,
                successRate: '96.6%',
                failRate: '3.4%',
                recoveredCount: 3,
                recoveredValue: 4800
            }
        ];
        // Failure Reasons Distribution
        const failureReasonsBreakdown = [
            {
                reason: 'Bank Server Timeout',
                count: 54,
                percentage: '42.2%'
            },
            {
                reason: 'Expired User Session',
                count: 28,
                percentage: '21.8%'
            },
            {
                reason: 'Authentication Failed',
                count: 22,
                percentage: '17.2%'
            },
            {
                reason: 'Insufficient Funds',
                count: 14,
                percentage: '10.9%'
            },
            {
                reason: 'Network Flap',
                count: 10,
                percentage: '7.8%'
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            channels: channelStats,
            paymentMethods: paymentMethodStats,
            failureReasons: failureReasonsBreakdown
        });
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

//# sourceMappingURL=%5Broot-of-the-server%5D__3e3d7142._.js.map