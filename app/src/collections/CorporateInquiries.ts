import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Exported so the frontend form (CorporateInquiryForm.tsx) renders the exact
// same option lists — one source of truth for what's a valid value.
export const INDUSTRY_OPTIONS = [
  'Agriculture',
  'Manufacturing',
  'Construction',
  'Real Estate',
  'Retail and Wholesale',
  'Logistics',
  'Hospitality and Tourism',
  'Technology',
  'Finance',
  'Professional Services',
  'Arts and Entertainment',
  'Government and Public Administration',
  'Consumer Goods',
  'Healthcare',
  'Avaition',
  'Education',
  'Insurance',
  'Oil & Gas',
  'Automotive',
  'Others',
]

export const COMPANY_SIZE_OPTIONS = ['น้อยกว่า 50', '51-200', '201-500', '501-1,000', '> 1,000']

export const INTEREST_OPTIONS = [
  'ประเมินสุขภาพใจ',
  'ตรวจสุขภาพพนักงาน / ฉีดวัคซีนพนักงาน',
  'ปรึกษาแพทย์ออนไลน์',
  'ปรึกษาจิตแพทย์ / นักจิตวิทยาออนไลน์',
  'ปรึกษาเภสัชกรพร้อมส่งยาถึงบ้าน',
  'กิจกรรมส่งเสริมสุขภาพ (Health Talk / Workshop)',
  'อื่นๆ',
]

// Same public-write/admin-read model as ContactSubmissions — real fields
// migrated from the source's Corp Contact form (a FluentForm on bedee.com),
// no email adapter configured so this collection IS the delivery mechanism.
const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Resolved', value: 'resolved' },
]

export const CorporateInquiries: CollectionConfig = {
  slug: 'corporate-inquiries',
  admin: {
    useAsTitle: 'companyName',
    group: 'Content',
    defaultColumns: ['companyName', 'fullName', 'email', 'industry', 'status', 'createdAt'],
  },
  access: { create: () => true, read: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'companyName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'position', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'industry', type: 'select', required: true, options: INDUSTRY_OPTIONS },
    { name: 'companySize', type: 'select', required: true, options: COMPANY_SIZE_OPTIONS },
    // Not `type: 'select'` — Postgres enum labels are capped at 63 bytes
    // (NAMEDATALEN), and these Thai option strings exceed that as UTF-8.
    // The dropdown UI lives in our own frontend form either way.
    { name: 'interests', type: 'text', required: true, hasMany: true },
    { name: 'message', type: 'textarea' },
    // Field-level access, not just collection-level — create is public (the
    // form itself), so without this a submitter could POST status:"resolved"
    // directly. defaultValue applies once the create-time value is blocked.
    {
      name: 'status',
      type: 'select',
      options: STATUS_OPTIONS,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      access: { create: isEditorOrAdmin, update: isEditorOrAdmin },
    },
    { name: 'honeypot', type: 'text', admin: { hidden: true } },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.honeypot) throw new Error('Submission rejected')
        return data
      },
    ],
  },
}
