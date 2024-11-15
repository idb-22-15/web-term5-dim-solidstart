import { query } from '@solidjs/router'
import { getCatalog } from '~/server/actions'

export const getCatalogQuery = query(() => getCatalog(), 'catalog')
