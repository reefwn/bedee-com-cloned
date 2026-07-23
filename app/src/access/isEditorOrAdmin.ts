import type { Access } from 'payload'

export const isEditorOrAdmin: Access = ({ req: { user } }) =>
  user?.role === 'editor' || user?.role === 'admin'
