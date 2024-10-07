import { lazy } from 'react'
import authRoute from './authRoute'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/IHRC/components/Home/Home')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/state',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/State/State')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/district',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/District/District')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item3',
        path: '/compliance',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/Compliance/Compliance')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item4',
        path: '/pf-configuration',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/PFConfiguration/PFConfiguration')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item5',
        path: '/version-history',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/VersionHistory/VersionHistory')
        ),
        authority: [],
    },
    {
        key: 'customChecklist.customChecklistForm',
        path: '/add-compliance-form',
        component: lazy(() => import('@/views/IHRC/components/GlobalSettings/Compliance/components/ComplianceAddForm')),
        authority: [],
    },
]