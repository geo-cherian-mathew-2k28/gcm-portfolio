import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL and Anon Key are required! Please check your .env.local file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://gcbppyetisfunawqzzjt.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        global: {
            headers: { 'x-client-info': 'portfolio-client' },
        },
    }
);

/**
 * Wraps a Supabase query with retry logic for transient network failures.
 * @param {Function} queryFn - Async function that returns { data, error }
 * @param {number} retries - Number of retry attempts (default: 2)
 * @param {number} delay - Base delay in ms between retries (default: 1000)
 * @returns {Promise<{data: any, error: any}>}
 */
export async function withRetry(queryFn, retries = 2, delay = 1000) {
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const result = await queryFn();

            // If Supabase returns an error, check if it's retryable
            if (result.error) {
                const code = result.error?.code;
                const status = result.error?.status || result.error?.statusCode;
                const isRetryable =
                    status >= 500 ||
                    status === 408 ||
                    code === 'PGRST301' ||
                    code === 'ECONNRESET' ||
                    (!status && !code); // Unknown errors

                if (isRetryable && attempt < retries) {
                    lastError = result.error;
                    await sleep(delay * (attempt + 1));
                    continue;
                }
            }

            return result;
        } catch (err) {
            lastError = err;
            if (attempt < retries) {
                await sleep(delay * (attempt + 1));
                continue;
            }
            return { data: null, error: lastError };
        }
    }

    return { data: null, error: lastError };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe fetch for portfolio data with graceful fallback.
 * Returns default values instead of throwing.
 */
export async function fetchPortfolioData() {
    const defaults = {
        profile: null,
        projects: [],
        experience: [],
        education: [],
        skills: [],
        certificates: [],
        gallery: [],
    };

    try {
        const [
            profileRes,
            projectsRes,
            experienceRes,
            educationRes,
            skillsRes,
            certsRes,
            galleryRes,
        ] = await Promise.allSettled([
            withRetry(() => supabase.from('profiles').select('*').single()),
            withRetry(() => supabase.from('projects').select('*').order('created_at', { ascending: false })),
            withRetry(() => supabase.from('experience').select('*').order('created_at', { ascending: false })),
            withRetry(() => supabase.from('education').select('*').order('created_at', { ascending: false })),
            withRetry(() => supabase.from('skills').select('*').order('id')),
            withRetry(() => supabase.from('certificates').select('*').order('created_at', { ascending: false })),
            withRetry(() => supabase.from('gallery').select('*').order('created_at', { ascending: false })),
        ]);

        return {
            profile: profileRes.status === 'fulfilled' ? profileRes.value?.data : defaults.profile,
            projects: projectsRes.status === 'fulfilled' ? (projectsRes.value?.data || []) : defaults.projects,
            experience: experienceRes.status === 'fulfilled' ? (experienceRes.value?.data || []) : defaults.experience,
            education: educationRes.status === 'fulfilled' ? (educationRes.value?.data || []) : defaults.education,
            skills: skillsRes.status === 'fulfilled' ? (skillsRes.value?.data || []) : defaults.skills,
            certificates: certsRes.status === 'fulfilled' ? (certsRes.value?.data || []) : defaults.certificates,
            gallery: galleryRes.status === 'fulfilled' ? (galleryRes.value?.data || []) : defaults.gallery,
        };
    } catch (err) {
        console.error('Critical fetch failure:', err);
        return defaults;
    }
}
