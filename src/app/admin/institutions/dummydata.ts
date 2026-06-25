import type {
    IAllInstitutionsAPIResponse,
    ISingleInstitutionAPIResponse,
    IInstitutionUsageReportAPIResponse,
    IRegistrationPromptAPIResponse,
} from '@/types/institution';

// ─── Institutions ──────────────────────────────────────────────────────────────

export const DUMMY_INSTITUTIONS: IAllInstitutionsAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Institutions fetched successfully',
    data: [
        {
            _id: 'inst_001',
            name: 'University of Nairobi',
            country: 'Kenya',
            contact_email: 'partnerships@uonbi.ac.ke',
            logo_url: 'https://upload.wikimedia.org/wikipedia/en/f/f0/University_of_Nairobi_seal.png',
            email_domains: [
                { domain: 'students.uonbi.ac.ke', is_primary: true },
                { domain: 'uonbi.ac.ke', is_primary: false },
            ],
            status: 'active',
            promotional_access: {
                start_date: '2026-01-15T00:00:00.000Z',
                end_date: '2026-08-10T00:00:00.000Z',
                is_active: true,
                grace_period_days: 0,
            },
            re_access_pricing: {
                type: 'discounted',
                discount_percentage: 30,
            },
            blueprint_ids: ['bp_001', 'bp_002', 'bp_003', 'bp_005'],
            total_registrations: 312,
            active_users: 274,
            paid_conversions: 48,
            createdAt: '2025-12-20T08:30:00.000Z',
            updatedAt: '2026-06-01T10:15:00.000Z',
        },
        {
            _id: 'inst_002',
            name: 'Strathmore University',
            country: 'Kenya',
            contact_email: 'partnerships@strathmore.edu',
            logo_url: undefined,
            email_domains: [
                { domain: 'strathmore.edu', is_primary: true },
                { domain: 'student.strathmore.edu', is_primary: false },
            ],
            status: 'active',
            promotional_access: {
                start_date: '2026-03-01T00:00:00.000Z',
                end_date: '2026-07-02T00:00:00.000Z',
                is_active: true,
                grace_period_days: 0,
            },
            re_access_pricing: {
                type: 'market',
            },
            blueprint_ids: ['bp_001', 'bp_004'],
            total_registrations: 187,
            active_users: 143,
            paid_conversions: 29,
            createdAt: '2026-02-10T11:00:00.000Z',
            updatedAt: '2026-06-10T09:45:00.000Z',
        },
        {
            _id: 'inst_003',
            name: 'USIU-Africa',
            country: 'Kenya',
            contact_email: 'corporate@usiu.ac.ke',
            logo_url: undefined,
            email_domains: [
                { domain: 'usiu.ac.ke', is_primary: true },
            ],
            status: 'active',
            promotional_access: {
                start_date: '2026-04-01T00:00:00.000Z',
                end_date: '2026-10-31T00:00:00.000Z',
                is_active: true,
                grace_period_days: 7,
            },
            re_access_pricing: {
                type: 'discounted',
                discount_percentage: 20,
            },
            blueprint_ids: ['bp_002', 'bp_003'],
            total_registrations: 94,
            active_users: 81,
            paid_conversions: 11,
            createdAt: '2026-03-25T14:00:00.000Z',
            updatedAt: '2026-06-20T16:30:00.000Z',
        },
        {
            _id: 'inst_004',
            name: 'KCA University',
            country: 'Kenya',
            contact_email: 'info@kca.ac.ke',
            logo_url: undefined,
            email_domains: [
                { domain: 'kca.ac.ke', is_primary: true },
                { domain: 'students.kca.ac.ke', is_primary: false },
            ],
            status: 'suspended',
            promotional_access: {
                start_date: '2026-02-01T00:00:00.000Z',
                end_date: '2026-07-15T00:00:00.000Z',
                is_active: false,
                grace_period_days: 0,
            },
            re_access_pricing: {
                type: 'market',
            },
            blueprint_ids: ['bp_001'],
            total_registrations: 53,
            active_users: 0,
            paid_conversions: 6,
            createdAt: '2026-01-28T09:00:00.000Z',
            updatedAt: '2026-05-14T12:00:00.000Z',
        },
        {
            _id: 'inst_005',
            name: 'Daystar University',
            country: 'Kenya',
            contact_email: 'admin@daystar.ac.ke',
            logo_url: undefined,
            email_domains: [
                { domain: 'daystar.ac.ke', is_primary: true },
            ],
            status: 'terminated',
            promotional_access: {
                start_date: '2025-09-01T00:00:00.000Z',
                end_date: '2026-03-01T00:00:00.000Z',
                is_active: false,
                grace_period_days: 0,
            },
            re_access_pricing: {
                type: 'market',
            },
            blueprint_ids: [],
            total_registrations: 38,
            active_users: 0,
            paid_conversions: 14,
            createdAt: '2025-08-15T07:00:00.000Z',
            updatedAt: '2026-03-05T08:00:00.000Z',
        },
    ],
};

// ─── Single Institution ────────────────────────────────────────────────────────

export const DUMMY_INSTITUTION_BY_ID: ISingleInstitutionAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Institution fetched successfully',
    data: DUMMY_INSTITUTIONS.data[0],
};

// ─── Usage Report ──────────────────────────────────────────────────────────────

export const DUMMY_USAGE_REPORT: IInstitutionUsageReportAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Usage report fetched successfully',
    data: [
        {
            institution_id: 'inst_001',
            institution_name: 'University of Nairobi',
            total_registrations: 312,
            active_users: 274,
            blueprint_views: 1840,
            paid_conversions: 48,
            conversion_rate: 15.38,
            days_remaining: Math.ceil(
                (new Date('2026-08-10').getTime() - Date.now()) / 86_400_000
            ),
        },
        {
            institution_id: 'inst_002',
            institution_name: 'Strathmore University',
            total_registrations: 187,
            active_users: 143,
            blueprint_views: 920,
            paid_conversions: 29,
            conversion_rate: 15.51,
            days_remaining: Math.ceil(
                (new Date('2026-07-02').getTime() - Date.now()) / 86_400_000
            ),
        },
        {
            institution_id: 'inst_003',
            institution_name: 'USIU-Africa',
            total_registrations: 94,
            active_users: 81,
            blueprint_views: 430,
            paid_conversions: 11,
            conversion_rate: 11.7,
            days_remaining: Math.ceil(
                (new Date('2026-10-31').getTime() - Date.now()) / 86_400_000
            ),
        },
        {
            institution_id: 'inst_004',
            institution_name: 'KCA University',
            total_registrations: 53,
            active_users: 0,
            blueprint_views: 210,
            paid_conversions: 6,
            conversion_rate: 11.32,
            days_remaining: Math.ceil(
                (new Date('2026-07-15').getTime() - Date.now()) / 86_400_000
            ),
        },
        {
            institution_id: 'inst_005',
            institution_name: 'Daystar University',
            total_registrations: 38,
            active_users: 0,
            blueprint_views: 145,
            paid_conversions: 14,
            conversion_rate: 36.84,
            days_remaining: -116,
        },
    ],
};

// ─── Registration Prompt Settings ─────────────────────────────────────────────

export const DUMMY_REGISTRATION_PROMPT: IRegistrationPromptAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Registration prompt settings fetched successfully',
    data: {
        is_enabled: true,
        heading: 'Are you a student from a partner university?',
        message:
            'Register using your university email address to access selected Taaluma.World content free of charge for a promotional period.\n\nIf your institution is not currently listed and you would like Taaluma.World to partner with your university, please contact us.',
        contact_email: 'teamtaaluma@taaluma.world',
    },
};

// ─── Generic mutation success response ────────────────────────────────────────

export const DUMMY_MUTATION_SUCCESS = {
    http_status_code: 200,
    status: true,
    message: 'Operation completed successfully',
    data: null,
};
