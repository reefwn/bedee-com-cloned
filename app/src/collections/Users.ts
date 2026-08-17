import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Admin', defaultColumns: ['email', 'role'] },
  access: {
    read: ({ req: { user } }) => !!user,
    // Bootstrap case: allow creating a user with zero existing users (first admin),
    // otherwise require an existing admin. Without this nobody could ever create
    // the first account — Payload does not bypass custom access control for that.
    create: async ({ req }) => {
      if (req.user?.role === 'admin') return true
      const { totalDocs } = await req.payload.count({ collection: 'users' })
      return totalDocs === 0
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
