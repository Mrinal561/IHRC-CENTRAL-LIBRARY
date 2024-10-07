import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCog,
    HiOutlineUser,
    HiOutlineGlobeAlt ,
} from 'react-icons/hi'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { AiOutlineAudit } from "react-icons/ai";
import { MdOutlineMonitorHeart } from 'react-icons/md';


export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineCog />,
    userCollapse: <HiOutlineUser />,
    globeCollapse: <HiOutlineGlobeAlt  />,
    buildingCollapse: <HiOutlineBuildingOffice2  />,
    auditCollapse: <AiOutlineAudit />,
    remittanceCollapse: <MdOutlineMonitorHeart />


}

export default navigationIcon
