/**
 * Admin User Hook
 * Manages current admin user and their permissions
 */

import { useState, useEffect } from 'react';
import type { AdminUser, AdminRole } from '../types/admin';
import { rolePermissions } from '../types/admin';

/**
 * Mock admin user for demonstration
 * In production, this would fetch from your authentication system
 */
export function useAdminUser() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading admin user from localStorage or API
    const loadAdminUser = () => {
      try {
        const savedRole = localStorage.getItem('taaluma_admin_role') as AdminRole;
        const role: AdminRole = savedRole || 'super_admin';
        
        const mockUser: AdminUser = {
          id: 'admin-001',
          email: 'admin@taaluma.world',
          name: 'Admin User',
          role: role,
          permissions: rolePermissions[role],
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          createdAt: new Date('2024-01-01'),
          lastActive: new Date(),
        };
        
        setAdminUser(mockUser);
      } catch (error) {
        console.error('Failed to load admin user:', error);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminUser();
  }, []);

  const switchRole = (newRole: AdminRole) => {
    if (!adminUser) return;
    
    const updatedUser: AdminUser = {
      ...adminUser,
      role: newRole,
      permissions: rolePermissions[newRole],
    };
    
    setAdminUser(updatedUser);
    localStorage.setItem('taaluma_admin_role', newRole);
  };

  return {
    adminUser,
    isLoading,
    switchRole,
  };
}
