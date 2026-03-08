import {cacheLife, cacheTag} from 'next/cache';
import {query} from './api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery} from './queries';

/**
 * Get the active channel with caching enabled.
 */
export async function getActiveChannelCached() {
    'use cache';
    cacheLife('hours');

    const result = await query(GetActiveChannelQuery);
    // CORREÇÃO: Optional chaining para evitar erro no build
    return result?.data?.activeChannel || null;
}

/**
 * Get available countries with caching enabled.
 */
export async function getAvailableCountriesCached() {
    'use cache';
    cacheLife('max');
    cacheTag('countries');

    const result = await query(GetAvailableCountriesQuery);
    // CORREÇÃO: Fallback para array vazio
    return result?.data?.availableCountries || [];
}

/**
 * Get top-level collections with caching enabled.
 */
export async function getTopCollections() {
    'use cache';
    cacheLife('days');
    cacheTag('collections');

    const result = await query(GetTopCollectionsQuery);
    // CORREÇÃO: A linha 40 que causou o último erro no Workflow #45
    return result?.data?.collections?.items || [];
}