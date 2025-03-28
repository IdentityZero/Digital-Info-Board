/**
 * NOT IN USE
 * 
 * Permission Rules
 *      Syntax:
 *          action:resource
 * 
 *       Actions:
 *          - create
 *          - read (single instance)
 *          - list
 *          - update
 *          - delete
 * 
 *          - approve
 *          - grant
 *          - revoke
 *
 *      Resource:
 *          # Base Resources are resources that the user owned by default. See Resource modifiers

 *          - Base Resource
 *              - userProfile
 *              - announcements
 * 
 *          - Resource modifier
 *              - all (all_users or all_announcements)
 * 
 */

import { User } from "../types/UserTypes";

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][number];

// We can store this in a db
const PERMISSIONS = {
  admin: [
    "create:announcements",
    "read:announcements",
    "list:announcements",
    "update:announcements",
    "delete:announcements",
    "read:all_announcements",
    "list:all_announcements",
    "delete:all_announcements",
    "read:userProfile",
    "read:all_userProfile",
    "list:all_userProfile",
    "delete:userProfile",
    "delete:all_userProfile",
  ],
  limited_admin: [
    "create:announcements",
    "read:announcements",
    "list:announcements",
    "update:announcements",
    "delete:announcements",
    "read:userProfile",
    "update:userProfile",
  ],
};

export function hasPermission(user: User, permission: Permission): boolean {
  let role: keyof typeof PERMISSIONS = user.is_admin
    ? "admin"
    : "limited_admin";

  const rolePermissions = PERMISSIONS[role];
  return rolePermissions.includes(permission);
}
