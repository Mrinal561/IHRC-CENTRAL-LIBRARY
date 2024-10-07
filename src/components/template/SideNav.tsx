import React from 'react';
import classNames from 'classnames';
import ScrollBar from '@/components/ui/ScrollBar';
// import { Clock, UserCircle, MapPin } from 'lucide-react';
import { HiClock, HiUserCircle, HiMap } from 'react-icons/hi';
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant';
import Logo from '@/components/template/Logo';
import navigationConfig from '@/configs/navigation.config';
import VerticalMenuContent from '@/components/template/VerticalMenuContent';
import useResponsive from '@/utils/hooks/useResponsive';
import { useAppSelector } from '@/store';
import { HiMapPin } from 'react-icons/hi2';

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
};

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
};

const SideNav = () => {
    const themeColor = useAppSelector((state) => state.theme.themeColor);
    const primaryColorLevel = useAppSelector((state) => state.theme.primaryColorLevel);
    const navMode = useAppSelector((state) => state.theme.navMode);
    const mode = useAppSelector((state) => state.theme.mode);
    const direction = useAppSelector((state) => state.theme.direction);
    const currentRouteKey = useAppSelector((state) => state.base.common.currentRouteKey);
    const sideNavCollapse = useAppSelector((state) => state.theme.layout.sideNavCollapse);
    const userAuthority = useAppSelector((state) => state.auth.user.authority);
    
    const lastLogin = '01/09/2024';
    const userRole = 'Admin';
    const companyLocation = 'Samastipur';

    const { larger } = useResponsive();

    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`;
        }
        return `side-nav-${navMode}`;
    };

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK;
        }
        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode;
        }
        return navMode;
    };

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={!sideNavCollapse}
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    );

    const footerContent = (
        <div className="side-nav-footer mt-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mx-4 mb-4 overflow-x-hidden">
            <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                    <HiClock className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm">
                        <span className="font-semibold">Last Login:</span> {lastLogin}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <HiUserCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                        <span className="font-semibold">Role:</span> {userRole}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <HiMapPin className="w-5 h-5 text-red-500" />
                    <span className="text-sm">
                        <span className="font-semibold">Location:</span> {companyLocation}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {larger.md && (
                <div
                    style={!sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
                    className={classNames(
                        'side-nav',
                        sideNavColor(),
                        sideNavCollapse && 'side-nav-expand'
                    )}
                >
                    <div className="side-nav-content-content h-full flex flex-col ">
                        <div className="side-nav-header">
                            <Logo
                                mode={logoMode()}
                                type={!sideNavCollapse ? 'streamline' : 'full'}
                                className={!sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER}
                            />
                        </div>
                        <div className="side-nav-middle flex-1">
                            {!sideNavCollapse ? (
                                menuContent
                            ) : (
                                <ScrollBar autoHide direction={direction}>
                                    {menuContent}
                                </ScrollBar>
                            )}
                        </div>
                        {sideNavCollapse}
                    </div>
                </div>
            )}
        </>
    );
};

export default SideNav;