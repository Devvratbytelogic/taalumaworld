/**
 * POST /api/logs/mpesa
 *
 * Receives a structured MpesaLogEntry from the client and appends it
 * to logs/mpesa-payments.log (JSON Lines format — one JSON object per line).
 *
 * Log rotation: when the file exceeds MAX_LOG_BYTES (10 MB) the current log
 * is archived to mpesa-payments.YYYY-MM-DD-HHmmss.log and a fresh file starts.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { MpesaLogEntry } from '@/utils/mpesaLogger';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'mpesa-payments.log');
const MAX_LOG_BYTES = 10 * 1024 * 1024; // 10 MB

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

function rotatIfNeeded() {
    if (!fs.existsSync(LOG_FILE)) return;
    const { size } = fs.statSync(LOG_FILE);
    if (size < MAX_LOG_BYTES) return;

    const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '-')
        .slice(0, 19); // YYYY-MM-DD-HHmmss
    const archived = path.join(LOG_DIR, `mpesa-payments.${stamp}.log`);
    fs.renameSync(LOG_FILE, archived);
}

export async function POST(req: NextRequest) {
    try {
        const body: MpesaLogEntry = await req.json();

        // Basic validation — reject garbage payloads
        if (!body?.event || !body?.timestamp || !body?.level) {
            return NextResponse.json({ error: 'Invalid log entry' }, { status: 400 });
        }

        ensureLogDir();
        rotatIfNeeded();

        const line = JSON.stringify(body) + '\n';
        fs.appendFileSync(LOG_FILE, line, 'utf8');

        return NextResponse.json({ ok: true });
    } catch (err) {
        // Never let a logging failure surface as a 500 that might concern the user
        console.error('[mpesa-log-route] Failed to write log:', err);
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}

/**
 * GET /api/logs/mpesa?lines=100
 *
 * Returns the last N lines of the log file as JSON.
 * Useful for a quick tail from the admin panel or curl.
 * Restrict this to internal/admin use in production via middleware.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const lines = Math.min(parseInt(searchParams.get('lines') ?? '100', 10), 1000);

        if (!fs.existsSync(LOG_FILE)) {
            return NextResponse.json({ entries: [], total: 0 });
        }

        const raw = fs.readFileSync(LOG_FILE, 'utf8');
        const allLines = raw.split('\n').filter(Boolean);
        const tail = allLines.slice(-lines);

        const entries = tail.map(l => {
            try { return JSON.parse(l); }
            catch { return { raw: l }; }
        });

        return NextResponse.json({
            entries,
            total: allLines.length,
            file: LOG_FILE,
        });
    } catch (err) {
        console.error('[mpesa-log-route] Failed to read log:', err);
        return NextResponse.json({ error: 'Could not read log file' }, { status: 500 });
    }
}
