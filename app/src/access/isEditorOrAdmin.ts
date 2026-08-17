// Deliberately untyped as `Access` — only reads `req.user`, so this narrower
// signature stays structurally assignable to both collection-level `Access`
// and field-level `FieldAccess` slots (their `AccessArgs`/`FieldAccessArgs`
// differ only in `id`'s type, which this function never touches).
export const isEditorOrAdmin = ({ req: { user } }: { req: { user?: { role?: string | null } | null } }) =>
  user?.role === 'editor' || user?.role === 'admin'
