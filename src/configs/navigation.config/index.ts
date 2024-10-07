import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'groupMenu.collapse',
        path: '',
        title: 'Global Settings',
        translateKey: 'nav.groupMenu.collapse.collapse',
        icon: 'globeCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'groupMenu.collapse.item1',
                path: '/state',
                title: 'State',
                translateKey: 'nav.groupMenu.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'groupMenu.collapse.item2',
                path: '/district',
                title: 'District',
                translateKey: 'nav.groupMenu.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'groupMenu.collapse.item3',
                path: '/compliance',
                title: 'Compliance',
                translateKey: 'nav.groupMenu.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'groupMenu.collapse.item4',
                path: '/pf-configuration',
                title: 'PF Configuration',
                translateKey: 'nav.groupMenu.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
