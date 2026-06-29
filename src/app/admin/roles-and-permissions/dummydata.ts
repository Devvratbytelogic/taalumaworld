import type {
    IAllRolesAPIResponse,
    IPermissionsMatrixAPIResponse,
    IAllStaffAPIResponse,
    IAllUserSegmentsAPIResponse,
    IMutationAPIResponse,
} from '@/types/rolesPermissions';

// ─── Permission catalogue ──────────────────────────────────────────────────────

const PERMISSION_CATALOG = [
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access the admin dashboard', category: 'Platform' },
    { id: 'settings.manage', name: 'Manage Settings', description: 'Configure global platform settings', category: 'Platform' },
    { id: 'users.manage', name: 'Manage Career Architects', description: 'View and manage Career Architect accounts', category: 'Users' },
    { id: 'mentors.manage', name: 'Manage Mentors', description: 'Onboard, suspend, and manage mentors', category: 'Users' },
    { id: 'institutions.manage', name: 'Manage University Partners', description: 'Configure institutional access programs', category: 'Users' },
    { id: 'content.moderate', name: 'Moderate Blueprints', description: 'Remove, suspend, or unpublish blueprints', category: 'Content' },
    { id: 'content.manage', name: 'Manage Content', description: 'Create and edit blueprints, series, and categories', category: 'Content' },
    { id: 'transactions.view', name: 'View Transactions', description: 'Access transaction records', category: 'Commerce' },
    { id: 'orders.view', name: 'View Orders', description: 'Access order records', category: 'Commerce' },
    { id: 'financial.reports', name: 'Financial Reports', description: 'View revenue and financial reports', category: 'Commerce' },
    { id: 'financial.payouts', name: 'Manage Payouts', description: 'Process mentor payouts and statements', category: 'Commerce' },
    { id: 'analytics.view', name: 'View Analytics', description: 'Access commercial analytics dashboard', category: 'Analytics' },
    { id: 'roles.manage', name: 'Manage Roles & Permissions', description: 'Create roles and adjust permission assignments', category: 'System' },
    { id: 'audit.view', name: 'View Audit Logs', description: 'Review administrative action logs', category: 'System' },
];

const ALL_PERMISSION_IDS = PERMISSION_CATALOG.map((p) => p.id);

// ─── Roles ───────────────────────────────────────────────────────────────────

export const DUMMY_ROLES: IAllRolesAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Roles fetched successfully',
    data: [
        {
            _id: 'role_super_admin',
            id: 'super_admin',
            name: 'Super Administrator',
            description: 'Full platform access — manages RBAC, analytics, tier settings, and all modules.',
            user_count: 2,
            is_system: true,
            permissions: [...ALL_PERMISSION_IDS],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2026-06-01T10:00:00.000Z',
        },
        {
            _id: 'role_general_admin',
            id: 'general_admin',
            name: 'General Administrator',
            description: 'Content moderation and user/mentor management. No financial access.',
            user_count: 3,
            is_system: true,
            permissions: [
                'dashboard.view', 'users.manage', 'mentors.manage', 'institutions.manage',
                'content.moderate', 'content.manage', 'audit.view',
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2026-06-01T10:00:00.000Z',
        },
        {
            _id: 'role_finance_admin',
            id: 'finance_admin',
            name: 'Finance Administrator',
            description: 'Payouts, revenue reports, transactions, and order management only.',
            user_count: 1,
            is_system: true,
            permissions: [
                'dashboard.view', 'transactions.view', 'orders.view',
                'financial.reports', 'financial.payouts',
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2026-06-01T10:00:00.000Z',
        },
        {
            _id: 'role_mentor',
            id: 'mentor',
            name: 'Mentor',
            description: 'Publishes Blueprints and Series. Limited admin access to own content.',
            user_count: 14,
            is_system: true,
            permissions: ['dashboard.view', 'content.manage'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2026-06-01T10:00:00.000Z',
        },
    ],
};

// ─── Permissions matrix ────────────────────────────────────────────────────────

export const DUMMY_PERMISSIONS_MATRIX: IPermissionsMatrixAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Permissions matrix fetched successfully',
    data: {
        permissions: PERMISSION_CATALOG,
        roles: DUMMY_ROLES.data.map((r) => ({ id: r.id, name: r.name, is_system: r.is_system })),
        matrix: Object.fromEntries(DUMMY_ROLES.data.map((r) => [r.id, [...r.permissions]])),
    },
};

// ─── Staff ─────────────────────────────────────────────────────────────────────

export const DUMMY_STAFF: IAllStaffAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Staff fetched successfully',
    data: [
        { _id: 'staff_001', name: 'Sarah Kimani', email: 'sarah@taaluma.world', role: 'super_admin', status: 'active', last_active: '2026-06-26T08:30:00.000Z', createdAt: '2024-03-15T09:00:00.000Z' },
        { _id: 'staff_002', name: 'James Ochieng', email: 'james@taaluma.world', role: 'super_admin', status: 'active', last_active: '2026-06-25T16:45:00.000Z', createdAt: '2024-05-20T11:00:00.000Z' },
        { _id: 'staff_003', name: 'Grace Wanjiku', email: 'grace@taaluma.world', role: 'general_admin', status: 'active', last_active: '2026-06-26T07:15:00.000Z', createdAt: '2025-01-10T08:00:00.000Z' },
        { _id: 'staff_004', name: 'Peter Mutua', email: 'peter@taaluma.world', role: 'general_admin', status: 'active', last_active: '2026-06-24T14:20:00.000Z', createdAt: '2025-02-14T10:30:00.000Z' },
        { _id: 'staff_005', name: 'Amina Hassan', email: 'amina@taaluma.world', role: 'general_admin', status: 'active', last_active: '2026-06-23T09:00:00.000Z', createdAt: '2025-04-01T13:00:00.000Z' },
        { _id: 'staff_006', name: 'David Kiprop', email: 'david@taaluma.world', role: 'finance_admin', status: 'active', last_active: '2026-06-26T06:00:00.000Z', createdAt: '2025-06-01T09:00:00.000Z' },
        { _id: 'staff_007', name: 'Dr. Evelyn Mwangi', email: 'evelyn@mentor.taaluma.world', role: 'mentor', status: 'active', last_active: '2026-06-25T18:30:00.000Z', createdAt: '2025-08-12T07:00:00.000Z' },
        { _id: 'staff_008', name: 'Prof. Samuel Otieno', email: 'samuel@mentor.taaluma.world', role: 'mentor', status: 'suspended', last_active: '2026-05-10T12:00:00.000Z', createdAt: '2025-09-01T08:00:00.000Z' },
    ],
};

// ─── User segments ─────────────────────────────────────────────────────────────

export const DUMMY_USER_SEGMENTS: IAllUserSegmentsAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'User segments fetched successfully',
    data: [
        {
            id: 'career_architect',
            name: 'Career Architect',
            description: 'Regular users who register with standard email providers (Gmail, Yahoo, Outlook, etc.).',
            terms_document: 'Career Architect Terms & Conditions',
            dashboard: 'Career Architect Dashboard',
            user_count: 1240,
        },
        {
            id: 'institutional_career_architect',
            name: 'Institutional Career Architect',
            description: 'University students with verified institutional email addresses from partner universities.',
            terms_document: 'Career Architect Terms & Conditions',
            dashboard: 'Career Architect Dashboard (with institutional access)',
            user_count: 646,
        },
        {
            id: 'mentor',
            name: 'Mentor',
            description: 'Qualified individuals who create and publish Blueprints and Series on the platform.',
            terms_document: 'Mentor Terms & Conditions',
            dashboard: 'Mentor Dashboard',
            user_count: 14,
        },
        {
            id: 'administrator',
            name: 'Administrator',
            description: 'Platform staff with elevated access — Super Admin, General Admin, or Finance Admin roles.',
            terms_document: 'Administrator Terms & Conditions',
            dashboard: 'Administrator Panel',
            user_count: 6,
        },
    ],
};

export const DUMMY_MUTATION_SUCCESS: IMutationAPIResponse = {
    http_status_code: 200,
    status: true,
    message: 'Operation completed successfully',
    data: null,
};
