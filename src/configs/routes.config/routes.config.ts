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
        key: 'groupMenu.collapse.item7',
        path: '/external-user',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/ExternalUser/ExternalUser'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'groupMenu.collapse.item1',
    //     path: '/remittance-tracker',
    //     component: lazy(() =>
    //         import('@/views/IHRC/components/GlobalSettings/State/State')
    //     ),
    //     authority: [],
    // },
    {
        key: 'remittanceTracker.item1',
        path: '/pf-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/RemittanceTracker/PFSetup/PFSetup')
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.item2',
        path: '/esi-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/RemittanceTracker/ESISetup/ESISetup')
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.item3',
        path: '/lwf-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/RemittanceTracker/LWFSetup/LWFSetup')
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.item4',
        path: '/pt-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/RemittanceTracker/PTSetup/PTSetup')
        ),
        authority: [],
    },
    
    // {
    //     key: 'groupMenu.collapse.item2',
    //     path: '/district',
    //     component: lazy(() =>
    //         import('@/views/IHRC/components/GlobalSettings/District/District')
    //     ),
    //     authority: [],
    // },
    {
        key: 'groupMenu.collapse.item3',
        path: '/compliance',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Compliance/Compliance'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item11',
        path: '/state-manager',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/State/State'
                ),
        ),
        authority: [],
    },
    {
        key: 'addState',
        path: '/add-state',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/State/components/AddStateForm'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'groupMenu.collapse.item4',
    //     path: '/pf-configuration',
    //     component: lazy(() =>
    //         import('@/views/IHRC/components/GlobalSettings/PFConfiguration/PFConfiguration')
    //     ),
    //     authority: [],
    // },
    {
        key: 'groupMenu.collapse.item12',
        path: '/posh',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Posh/Posh'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item14',
        path: '/register',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/RegisterTemplate/RegisterTemplate'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item5',
        path: '/register-template',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/RegisterTemplate/RegisterTemplate'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item6',
        path: '/role',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/Compliance/components/Roles')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item7',
        path: '/company-admin',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/CompanyAdmin/CompanyAdmin')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item9',
        path: '/return-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/ReturnSetup/ReturnSetup')
        ),
        authority: [],
    },
    {
        key: 'customChecklist.customChecklistForm',
        path: '/add-compliance-form',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Compliance/components/ComplianceAddForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'permission.details',
        path: `/permission`,
        component: lazy(() => import('@/views/IHRC/components/GlobalSettings/Compliance/components/Permission')),
        authority: [],
    },
    {
        key: 'compliance.edit',
        path: `${APP_PREFIX_PATH}/compliance/edit/:id`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Compliance/components/ComplianceEditForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'roles.details',
        path: `${APP_PREFIX_PATH}/roles`,
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/Compliance/components/Roles')
        ),
        authority: [],
    },
    {
        key: 'compliance.details',
        path: `${APP_PREFIX_PATH}/compliance/details/:id`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Compliance/components/ComplianceDetail'
                ),
        ),
        authority: [],
    },
    {
        key: 'returnSetup.add',
        path: '/add-return-setup',
        component: lazy(() =>
            import('@/views/IHRC/components/GlobalSettings/ReturnSetup/components/ReturnSetupAddForm')
        ),
        authority: [],
    },
    {
        key: 'returnSetup.edit',
        path: '/edit-return-setup',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/ReturnSetup/components/ReturnSetupEditForm'
                ),
        ),
        authority: [],
    },
]
