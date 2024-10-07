import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Trans } from 'react-i18next'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    userAuthority: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({ nav, onLinkClick, userAuthority }: DefaultItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuCollapse
                key={nav.key}
                label={
                    <>
                        <VerticalMenuIcon icon={nav.icon} />
                        <span>
                            <Trans
                                i18nKey={nav.translateKey}
                                defaults={nav.title}
                            />
                        </span>
                    </>
                }
                eventKey={nav.key}
                expanded={false}
                className="mb-2"
            >
               {nav.subMenu.map((subNav) => (
                    <AuthorityCheck
                        key={subNav.key}
                        userAuthority={userAuthority}
                        authority={subNav.authority}
                    >
                        {subNav.type === NAV_ITEM_TYPE_COLLAPSE ? (
                            <DefaultItem
                                nav={subNav}
                                onLinkClick={onLinkClick}
                                userAuthority={userAuthority}
                            />
                        ) : (
                            <MenuItem eventKey={subNav.key}>
                                {subNav.path ? (
                                    <Link
                                        className="h-full w-full flex items-center"
                                        to={subNav.path}
                                        onClick={() =>
                                            onLinkClick?.({
                                                key: subNav.key,
                                                title: subNav.title,
                                                path: subNav.path,
                                            })
                                        }
                                        target={subNav.isExternalLink ? '_blank' : ''}
                                    >
                                        <span>
                                            <Trans
                                                i18nKey={subNav.translateKey}
                                                defaults={subNav.title}
                                            />
                                        </span>
                                    </Link>
                                ) : (
                                    <span>
                                        <Trans
                                            i18nKey={subNav.translateKey}
                                            defaults={subNav.title}
                                        />
                                    </span>
                                )}
                            </MenuItem>
                        )}
                    </AuthorityCheck>
                ))}
            </MenuCollapse>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    onLinkClick,
    userAuthority,
    direction,
}: CollapsedItemProps) => {
    const menuItem = (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
                <VerticalMenuIcon icon={nav.icon} />
        </MenuItem>
    )

    const renderSubMenu = (subNav: NavigationTree) => (
        <AuthorityCheck
            key={subNav.key}
            userAuthority={userAuthority}
            authority={subNav.authority}
        >
            {subNav.subMenu && subNav.subMenu.length > 0 ? (
                <Dropdown.Menu eventKey={subNav.key} title={
                    <div className="flex items-center justify-between w-full">
                        <span>{subNav.title}</span>
                    </div>
                }>
                    {subNav.subMenu.map(renderSubMenu)}
                </Dropdown.Menu>
            ) : (
                <Dropdown.Item eventKey={subNav.key}>
                    {subNav.path ? (
                        <Link
                            className="h-full w-full flex items-center"
                            to={subNav.path}
                            onClick={() =>
                                onLinkClick?.({
                                    key: subNav.key,
                                    title: subNav.title,
                                    path: subNav.path,
                                })
                            }
                            target={subNav.isExternalLink ? '_blank' : ''}
                        >
                            <span>
                                <Trans
                                    i18nKey={subNav.translateKey}
                                    defaults={subNav.title}
                                />
                            </span>
                        </Link>
                    ) : (
                        <span>
                            <Trans
                                i18nKey={subNav.translateKey}
                                defaults={subNav.title}
                            />
                        </span>
                    )}
                </Dropdown.Item>
            )}
        </AuthorityCheck>
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
        <Dropdown
            trigger="hover"
            renderTitle={menuItem}
            placement={
                direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'
            }
            className='side-nav-dropdown'
        >
            {nav.subMenu.map(renderSubMenu)}
        </Dropdown>
    </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItem = ({
    sideCollapsed,
    ...rest
}: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
