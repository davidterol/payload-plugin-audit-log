import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { auditLogPlugin } from '../src/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', editor: lexicalEditor() },
        { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
      ],
      timestamps: true,
    },
    {
      slug: 'products',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number' },
        { name: 'stock', type: 'number' },
        { name: 'description', type: 'textarea' },
      ],
      timestamps: true,
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/audit-log-dev',
  }),
  plugins: [
    auditLogPlugin({
      auditCollectionSlug: 'audit-logs',
      watch: [
        {
          collection: 'posts',
          fields: ['title', 'content', 'status'],
        },
        {
          collection: 'products',
          fields: null,
        },
      ],
      trackedFields: {},
      logUser: true,
      logTimestamp: true,
      includeDiffs: true,
    }),
  ],
})